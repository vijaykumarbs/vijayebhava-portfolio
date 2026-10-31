"use client";

import { useEffect, useRef, useState } from "react";

export function ProductClarityAnimation() {
  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const art = artRef.current;
    const root = rootRef.current;
    if (!stage || !art || !root) return;

    let cancelled = false;
    let started = false;
    let cleanup: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;
    const start = async () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      const { mountProductClarityAnimation } = await import("./product-clarity-animation-engine");
      if (cancelled) return;
      cleanup = mountProductClarityAnimation(stage, art, root, setActive);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) void start();
      }, { rootMargin: "160px 0px" });
      observer.observe(stage);
    } else {
      void start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanup?.();
      root.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`clarity-animation${active ? " is-active" : ""}`}
      role="img"
      aria-label="A 19.8-second product story: customer requests and competing assumptions are investigated, evidence brings the core problem into focus, and a three-step plan creates forward movement."
    >
      <div className="clarity-fallback" aria-hidden="true">
        <span>Complexity</span><b>→</b><span>Investigation</span><b>→</b><span>Clarity</span><b>→</b><span>Decision</span><b>→</b><span>Forward movement</span>
      </div>
      <svg ref={artRef} className="clarity-svg" viewBox="220 90 1320 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g ref={rootRef} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <p className="clarity-caption">Complexity becomes a clear, evidence-led next step.</p>
    </div>
  );
}
