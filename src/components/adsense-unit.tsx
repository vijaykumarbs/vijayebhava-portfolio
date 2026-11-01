"use client";

import { useEffect, useState } from "react";

const PUBLISHER_ID = "ca-pub-8700230535823222";
const AD_SLOT_ID = "3831604696";

type AdsByGoogleQueue = unknown[] & { requestNonPersonalizedAds?: number };

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogleQueue;
  }
}

export function AdSenseUnit({ placement }: { placement: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const updateConsent = (event?: Event) => {
      const allowed = event instanceof CustomEvent
        ? event.detail === true
        : localStorage.getItem("vb-analytics-consent") === "all";
      setConsented(allowed);
    };

    updateConsent();
    window.addEventListener("vb-ads-consent-change", updateConsent);
    return () => window.removeEventListener("vb-ads-consent-change", updateConsent);
  }, []);

  useEffect(() => {
    if (!consented) return;

    if (!document.getElementById("google-adsense-script")) {
      const script = document.createElement("script");
      script.id = "google-adsense-script";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;
      document.head.appendChild(script);
    }

    try {
      const queue = window.adsbygoogle = window.adsbygoogle || [];
      queue.requestNonPersonalizedAds = 1;
      queue.push({});
    } catch {
      // AdSense can reject a slot when the site is not yet approved to serve ads.
    }
  }, [consented]);

  if (!consented) return null;

  return (
    <aside className="blog-ad" aria-label="Advertisement" data-ad-placement={placement}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={AD_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
