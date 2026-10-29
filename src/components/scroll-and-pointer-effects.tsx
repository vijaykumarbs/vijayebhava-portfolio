"use client";

import { useEffect } from "react";

export function ScrollAndPointerEffects() {
  useEffect(() => {
    const html = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduceMotion || !("IntersectionObserver" in window)) {
      html.removeAttribute("data-motion");
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      html.dataset.motion = "on";
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
      revealItems.forEach((item) => revealObserver.observe(item));

      const approach = document.querySelector<HTMLElement>(".approach");
      let progressFrame = 0;
      const updateProcess = () => {
        if (progressFrame) return;
        progressFrame = requestAnimationFrame(() => {
          progressFrame = 0;
          if (!approach) return;
          const rect = approach.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, (window.innerHeight * .82 - rect.top) / (rect.height * .78)));
          approach.style.setProperty("--process-progress", String(progress));
        });
      };
      updateProcess();
      window.addEventListener("scroll", updateProcess, { passive: true });
      window.addEventListener("resize", updateProcess, { passive: true });

      const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      const disposers: Array<() => void> = [];
      if (pointerQuery.matches) {
        const atmosphere = document.documentElement;
        let pointerFrame = 0;
        let nextAmbient = { x: 54, y: 15, pointerX: 0, pointerY: 0, storyX: 0, storyY: 0 };
        const storyStages = Array.from(document.querySelectorAll<HTMLElement>(".clarity-animation"));
        const resetAmbient = () => {
          if (pointerFrame) cancelAnimationFrame(pointerFrame);
          pointerFrame = 0;
          atmosphere.style.setProperty("--ambient-x", "54%");
          atmosphere.style.setProperty("--ambient-y", "15%");
          hero?.style.setProperty("--pointer-dx", "0px");
          hero?.style.setProperty("--pointer-dy", "0px");
          storyStages.forEach((stage) => {
            stage.style.setProperty("--story-shift-x", "0px");
            stage.style.setProperty("--story-shift-y", "0px");
          });
        };
        const hero = document.querySelector<HTMLElement>(".hero");
        const onMove = (event: PointerEvent) => {
          if (event.pointerType === "touch" || !hero) return;
          const bounds = hero.getBoundingClientRect();
          const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
          const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
          const stage = storyStages[0];
          const stageBounds = stage?.getBoundingClientRect();
          const localX = stage && stageBounds ? Math.min(1, Math.max(0, (event.clientX - stageBounds.left) / stageBounds.width)) : .5;
          const localY = stage && stageBounds ? Math.min(1, Math.max(0, (event.clientY - stageBounds.top) / stageBounds.height)) : .5;
          nextAmbient = {
            x: Math.min(100, Math.max(0, (event.clientX / window.innerWidth) * 100)),
            y: Math.min(100, Math.max(0, (event.clientY / window.innerHeight) * 100)),
            pointerX: x,
            pointerY: y,
            storyX: (localX - .5) * 18,
            storyY: (localY - .5) * 14,
          };
          if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
            pointerFrame = 0;
            atmosphere.style.setProperty("--ambient-x", `${nextAmbient.x}%`);
            atmosphere.style.setProperty("--ambient-y", `${nextAmbient.y}%`);
            hero.style.setProperty("--pointer-x", String(nextAmbient.pointerX));
            hero.style.setProperty("--pointer-y", String(nextAmbient.pointerY));
            hero.style.setProperty("--pointer-dx", `${(nextAmbient.pointerX - .5) * 18}px`);
            hero.style.setProperty("--pointer-dy", `${(nextAmbient.pointerY - .5) * 14}px`);
            storyStages.forEach((storyStage) => {
              storyStage.style.setProperty("--story-shift-x", `${nextAmbient.storyX}px`);
              storyStage.style.setProperty("--story-shift-y", `${nextAmbient.storyY}px`);
            });
          });
        };
        hero?.addEventListener("pointermove", onMove, { passive: true });
        hero?.addEventListener("pointerleave", resetAmbient, { passive: true });
        disposers.push(() => {
          hero?.removeEventListener("pointermove", onMove);
          hero?.removeEventListener("pointerleave", resetAmbient);
          if (pointerFrame) cancelAnimationFrame(pointerFrame);
          resetAmbient();
        });
      }

      return () => {
        html.removeAttribute("data-motion");
        revealObserver.disconnect();
        window.removeEventListener("scroll", updateProcess);
        window.removeEventListener("resize", updateProcess);
        if (progressFrame) cancelAnimationFrame(progressFrame);
        disposers.forEach((dispose) => dispose());
      };
    }

    return () => undefined;
  }, []);

  return null;
}
