"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ConsentChoice = "all" | "necessary" | "rejected" | "unanswered" | "loading";
type StoredConsentChoice = Exclude<ConsentChoice, "unanswered" | "loading">;
const CONSENT_STORAGE_KEY = "vb-analytics-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __vijayebhavaAnalyticsInitialized?: boolean;
    __vijayebhavaAnalyticsConsentGranted?: boolean;
  }
}

export function trackAnalyticsEvent(name: string, parameters: Record<string, string> = {}) {
  if (typeof window === "undefined" || !window.__vijayebhavaAnalyticsConsentGranted) return;
  window.gtag?.("event", name, parameters);
}

export function GoogleAnalyticsPageViews({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<ConsentChoice>("loading");
  const [showPreferences, setShowPreferences] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);
  const lastConsentGranted = useRef(false);

  useEffect(() => {
    const storedChoice = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedChoice === "all" || storedChoice === "necessary" || storedChoice === "rejected") {
      setChoice(storedChoice);
    } else {
      setChoice("unanswered");
    }
  }, []);

  useEffect(() => {
    function handleTrackedLink(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[data-analytics-event]");
      const eventName = link?.dataset.analyticsEvent;
      if (!link || !eventName) return;

      trackAnalyticsEvent(eventName, {
        network: link.dataset.analyticsNetwork || "unknown",
        placement: link.dataset.analyticsPlacement || "unknown",
        link_url: link.href,
      });
    }

    document.addEventListener("click", handleTrackedLink);
    return () => document.removeEventListener("click", handleTrackedLink);
  }, []);

  useEffect(() => {
    if (choice !== "all") {
      lastConsentGranted.current = false;
      window.__vijayebhavaAnalyticsConsentGranted = false;
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
      return;
    }

    if (!window.__vijayebhavaAnalyticsInitialized) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.gtag("js", new Date());
      window.__vijayebhavaAnalyticsInitialized = true;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }

    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.__vijayebhavaAnalyticsConsentGranted = true;
    window.gtag?.("config", measurementId, { send_page_view: false });

    if (lastTrackedPath.current !== pathname || !lastConsentGranted.current) {
      lastTrackedPath.current = pathname;
      lastConsentGranted.current = true;
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: `${window.location.origin}${pathname}`,
        page_title: document.title,
      });
    }
  }, [choice, measurementId, pathname]);

  function chooseConsent(nextChoice: StoredConsentChoice) {
    localStorage.setItem(CONSENT_STORAGE_KEY, nextChoice);
    setChoice(nextChoice);
    setShowPreferences(false);
    window.dispatchEvent(new CustomEvent("vb-ads-consent-change", { detail: nextChoice === "all" }));
  }

  if (choice === "loading") return null;

  if (choice === "unanswered" || showPreferences) {
    return (
      <section className="analytics-consent" aria-labelledby="analytics-consent-title" aria-describedby="analytics-consent-description">
        <div>
          <h2 id="analytics-consent-title">Your privacy choices</h2>
          <p id="analytics-consent-description">Necessary storage keeps the site working. Accept all to allow Google Analytics and Google ads. Form contents are never sent to Google.</p>
        </div>
        <div className="analytics-consent-actions">
          <button type="button" onClick={() => chooseConsent("all")}>Accept all</button>
          <button type="button" onClick={() => chooseConsent("necessary")}>Necessary only</button>
          <button type="button" onClick={() => chooseConsent("rejected")}>Reject all</button>
        </div>
      </section>
    );
  }

  return <button className="analytics-preferences" type="button" onClick={() => setShowPreferences(true)}>Privacy choices</button>;
}
