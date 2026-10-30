"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-controller";
import { BOOKING_URL } from "@/data/site-config";

const links = [
  { href: "/#who-i-help", label: "Who I help" },
  { href: "/#approach", label: "Approach" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/blog/", label: "Blog" },
];

export function SiteHeader({ brand }: { brand: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="wordmark" href="/#top" aria-label={`${brand}, home`} onClick={() => setMenuOpen(false)}>
        <span className="wordmark-mark">VB</span><span className="wordmark-name">VIJAYEBHAVA</span>
      </a>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? "Close" : "Menu"}</span><i aria-hidden="true">{menuOpen ? "−" : "+"}</i>
      </button>
      <nav id="main-navigation" className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
        {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        <a className="nav-contact" href={BOOKING_URL} target="_blank" rel="noopener">Let's talk <span aria-hidden="true">↗</span></a>
      </nav>
      <ThemeToggle />
    </header>
  );
}
