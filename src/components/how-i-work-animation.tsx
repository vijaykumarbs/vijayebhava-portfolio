"use client";

import { useState } from "react";
import { chapters } from "@/data/chapters";

function StepIcon({ id }: { id: string }) {
  switch (id) {
    case "understand":
      return <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15 20.5 20.5" /></>;
    case "validate":
      return <path d="m5 12.5 4.5 4.5L19 7" />;
    case "prioritise":
      return <path d="M5 7h14M5 12h10M5 17h6" />;
    case "design":
      return <><rect x="4.5" y="4.5" width="15" height="15" rx="2" /><path d="M4.5 10h15M10 10v9.5" /></>;
    case "deliver":
      return <path d="M5 12h13M13 6l6 6-6 6" />;
    case "measure":
      return <><path d="m4 18 5-6 4 3 7-8" /><path d="M15 7h5v5" /></>;
    default:
      return null;
  }
}

function createAnimationStyles() {
  const stepDuration = 15;
  const styles = chapters.map((_, index) => {
    const start = index * stepDuration;
    const end = start + stepDuration;
    const last = index === chapters.length - 1;
    const node = `how-node-${index}`;
    const icon = `how-icon-${index}`;
    const caption = `how-caption-${index}`;
    const captionEnd = last ? 94 : end - 1.5;
    const captionFade = last ? 97 : end;

    return `
      @keyframes ${node} {
        0%, ${start}% { fill: var(--paper); stroke: var(--line); transform: scale(1); }
        ${start + 1.5}%, ${end}% { fill: var(--spark); stroke: var(--spark); transform: scale(1.14); }
        ${end + 1}%, 95% { fill: var(--primary); stroke: var(--primary); transform: scale(1); }
        99%, 100% { fill: var(--paper); stroke: var(--line); transform: scale(1); }
      }
      @keyframes ${icon} {
        0%, ${start}% { color: var(--muted); }
        ${start + 1.5}%, ${end}% { color: var(--spark-ink); }
        ${end + 1}%, 95% { color: var(--on-primary); }
        99%, 100% { color: var(--muted); }
      }
      @keyframes ${caption} {
        0%, ${start}% { opacity: 0; transform: translateY(8px); }
        ${start + 2.5}%, ${captionEnd}% { opacity: 1; transform: translateY(0); }
        ${captionFade}%, 100% { opacity: 0; transform: translateY(-4px); }
      }
      .how-node-${index} { animation: ${node} 18s ease-in-out infinite; }
      .how-icon-${index} { animation: ${icon} 18s ease-in-out infinite; }
      .how-caption-${index} { animation: ${caption} 18s ease-in-out infinite; }
    `;
  }).join("\n");

  return `${styles}
    @keyframes how-progress {
      0% { stroke-dashoffset: 500; opacity: 1; }
      75% { stroke-dashoffset: 0; }
      95% { stroke-dashoffset: 0; opacity: 1; }
      99% { stroke-dashoffset: 0; opacity: 0; }
      100% { stroke-dashoffset: 500; opacity: 0; }
    }
  `;
}

const animationStyles = createAnimationStyles();

export function HowIWorkAnimation() {
  const [paused, setPaused] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  function selectStep(index: number) {
    setSelectedStep(index);
    const root = document.querySelector<HTMLElement>(".how-i-work");
    if (!root) return;
    const time = index * 2.7 + 0.6;
    root.querySelectorAll<HTMLElement>(".how-node, .how-icon, .how-i-work-caption, .how-i-work-progress")
      .forEach((element) => { element.style.animationDelay = `-${time}s`; });
    requestAnimationFrame(() => {
      root.getAnimations({ subtree: true }).forEach((animation) => {
        try { animation.currentTime = time * 1000; } catch { /* Some browsers expose a read-only animation timeline. */ }
      });
    });
  }

  return (
    <div className={`how-i-work${paused ? " is-paused" : ""}`} data-selected-step={selectedStep ?? undefined}>
      <style>{animationStyles}</style>
      <figure className="how-i-work-figure" aria-label="A six-step loop: understand, validate, prioritise, design, deliver, measure and improve.">
        <svg className="how-i-work-track" viewBox="0 0 600 100" aria-label="Select a step in the How I work animation">
          <line className="how-i-work-base" x1="50" y1="50" x2="550" y2="50" />
          <line className="how-i-work-progress" x1="50" y1="50" x2="550" y2="50" />
          {chapters.map((chapter, index) => {
            const x = 50 + index * 100;
            return (
              <g
                key={chapter.id}
                className="how-step-target"
                role="button"
                tabIndex={0}
                aria-label={`Show step ${index + 1}: ${chapter.title}`}
                onClick={() => selectStep(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectStep(index);
                  }
                }}
              >
                <circle className={`how-node how-node-${index}`} cx={x} cy="50" r="22" />
                <svg className={`how-icon how-icon-${index}`} x={x - 12} y="38" width="24" height="24" viewBox="0 0 24 24">
                  <StepIcon id={chapter.id} />
                </svg>
              </g>
            );
          })}
        </svg>
        <div className="how-i-work-captions" aria-hidden="true">
          {chapters.map((chapter, index) => (
            <div className={`how-i-work-caption how-caption-${index}`} key={chapter.id}>
              <p className="how-i-work-step">Step {index + 1} of {chapters.length} <strong>{chapter.eyebrow}</strong></p>
              <h3>{chapter.title}</h3>
              <p className="how-i-work-output"><strong>Output</strong>{chapter.deliverable}</p>
            </div>
          ))}
        </div>
        <ol className="sr-only">
          {chapters.map((chapter) => <li key={chapter.id}>{chapter.eyebrow}: {chapter.title} Output: {chapter.deliverable}</li>)}
        </ol>
      </figure>
      <button className="how-i-work-control" type="button" aria-pressed={paused} onClick={() => {
        if (paused) setSelectedStep(null);
        setPaused((value) => !value);
      }}>
        {paused ? "Play animation" : "Pause animation"}
      </button>
    </div>
  );
}
