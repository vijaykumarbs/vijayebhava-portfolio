"use client";

import { useEffect, useState } from "react";

export type Atmosphere = "dawn" | "day" | "golden-hour" | "dusk" | "night";
export type ThemeMode = "auto" | "light" | "dark";

export function atmosphereFor(date: Date): Atmosphere {
  const hour = date.getHours();
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 16) return "day";
  if (hour >= 16 && hour < 18) return "golden-hour";
  if (hour >= 18 && hour < 20) return "dusk";
  return "night";
}

function nextAtmosphereChange(now: Date): Date {
  for (const hour of [5, 8, 16, 18, 20]) {
    const boundary = new Date(now);
    boundary.setHours(hour, 0, 0, 75);
    if (boundary.getTime() > now.getTime()) return boundary;
  }
  const dawn = new Date(now);
  dawn.setDate(dawn.getDate() + 1);
  dawn.setHours(5, 0, 0, 75);
  return dawn;
}

function systemDefault(): Exclude<ThemeMode, "auto"> {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function validMode(value: string | null): value is ThemeMode {
  return value === "auto" || value === "light" || value === "dark";
}

export function ThemeController() {
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;

    const applySystemDefault = () => {
      const saved = localStorage.getItem("vb-theme");
      root.dataset.theme = validMode(saved) ? saved : systemDefault();
    };
    const updateAtmosphere = () => {
      root.dataset.atmosphere = atmosphereFor(new Date());
      window.clearTimeout(timer);
      if (!document.hidden) {
        timer = window.setTimeout(updateAtmosphere, Math.max(1000, nextAtmosphereChange(new Date()).getTime() - Date.now()));
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "vb-theme" || event.key === null) applySystemDefault();
    };
    const onSystemChange = () => {
      if (!validMode(localStorage.getItem("vb-theme"))) applySystemDefault();
    };
    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(timer);
      else updateAtmosphere();
    };
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");

    applySystemDefault();
    updateAtmosphere();
    window.addEventListener("storage", onStorage);
    scheme.addEventListener("change", onSystemChange);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", updateAtmosphere);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", onStorage);
      scheme.removeEventListener("change", onSystemChange);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", updateAtmosphere);
    };
  }, []);
  return null;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("auto");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme((root.dataset.theme as ThemeMode) || "auto");
    const systemScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!validMode(localStorage.getItem("vb-theme"))) sync();
    };
    sync();
    window.addEventListener("storage", sync);
    systemScheme.addEventListener("change", onSystemChange);
    return () => {
      window.removeEventListener("storage", sync);
      systemScheme.removeEventListener("change", onSystemChange);
    };
  }, []);

  function cycleTheme() {
    const current = document.documentElement.dataset.theme || theme;
    const next: ThemeMode = current === "auto" ? "light" : current === "light" ? "dark" : "auto";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("vb-theme", next);
    setTheme(next);
  }

  const next = theme === "auto" ? "light" : theme === "light" ? "dark" : "auto";
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme is ${theme === "auto" ? "automatic" : theme}. Change to ${next}.`}
      title={`Theme: ${theme}`}
    >
      <span aria-hidden="true">{theme === "dark" ? "☾" : theme === "light" ? "☼" : "◐"}</span>
      <span className="theme-toggle-label">{theme === "auto" ? "Auto" : theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
