"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 19.8;

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

    const resizeArt = () => art.setAttribute("viewBox", stage.clientWidth <= 760 ? "330 0 1040 900" : "220 90 1320 760");
    resizeArt();
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resizeArt) : null;
    resizeObserver?.observe(stage);

    const ns = "http://www.w3.org/2000/svg";
    const ink = "var(--animation-ink)";
    const paper = "var(--animation-paper)";
    const colors = { ink, blue: "#176B53", amber: "#D9B77E", sage: "#48B99A" };
    const actions: Array<(time: number) => void> = [];
    const element = (tag: string, attrs: Record<string, string | number>, parent: SVGElement = root) => {
      const node = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
      parent.appendChild(node);
      return node;
    };
    const ease = (x: number) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
    const clamp = (a: number, b: number, t: number) => ease((t - a) / (b - a));
    const windowOf = (a: number, b: number, t: number) => clamp(a, a + 0.5, t) * (1 - clamp(b - 0.5, b, t));
    const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
    const pen = (parent: SVGElement, d: string, color: string, width = 2.2, opacity = 1) =>
      element("path", { d, fill: "none", stroke: color, "stroke-width": width, "stroke-opacity": opacity, pathLength: 1, "stroke-dasharray": "1 1", "stroke-linecap": "round", "stroke-linejoin": "round" }, parent) as SVGPathElement;
    const draw = (node: SVGElement, t: number, from: number, to: number) => node.setAttribute("stroke-dashoffset", String(1 - clamp(from, to, t)));
    const text = (parent: SVGElement, value: string, x: number, y: number, size: number, color = ink, anchor = "start") => {
      const node = element("text", { x, y, "font-size": size, fill: color, "text-anchor": anchor, "font-family": "'Bradley Hand', 'Segoe Print', 'Comic Sans MS', cursive", "font-weight": 600, stroke: "none" }, parent) as SVGTextElement;
      node.textContent = value;
      return node;
    };
    const squiggle = (x: number, y: number, width: number) => {
      let d = `M${x},${y}`;
      for (let i = 0; i < Math.floor(width / 14); i++) d += i ? " t14,0" : " q7,-6 14,0";
      return d;
    };

    const notes = [
      { color: "blue", title: "Customer asks", positions: [[640, 420, -7, 1], [520, 330, -3, 1], [400, 330, 0, 1], [1100, 200, 0, .55]], lines: [90, 60], later: true },
      { color: "amber", title: "Unclear goal", positions: [[720, 380, 5, 1], [690, 300, 2, 1], [400, 470, 0, 1], [1100, 305, 0, .55]], lines: [70, 100], later: true },
      { color: "sage", title: "Interview data", positions: [[800, 470, -4, 0], [860, 430, -1, 1], [570, 330, 0, 1], [1100, 500, 0, 0]], lines: [100, 60] },
      { color: "ink", title: "Everyone wants X", positions: [[900, 400, 8, 1], [980, 330, 4, .9], [1000, 300, 4, 0], [1000, 300, 4, 0]], lines: [80, 100] },
      { color: "blue", title: "Core problem", positions: [[560, 500, 3, 1], [540, 470, 0, 1], [740, 410, 0, 1], [400, 300, 0, 1]], lines: [100, 50] },
      { color: "amber", title: "A: Quick fix", positions: [[820, 540, -5, 1], [800, 540, -2, 1], [930, 330, 0, 1], [1100, 410, 0, .55]], lines: [100, 60], later: true },
      { color: "sage", title: "B: Full rebuild", positions: [[740, 520, 6, 1], [700, 570, 3, 1], [930, 500, 0, 1], [1100, 515, 0, .55]], lines: [100, 70], later: true },
    ];
    const keyframes = [0, 3.6, 5, 7.6, 9, 11.6, 13, 99];
    const place = (positions: number[][], t: number) => {
      const values = [positions[0], positions[0], positions[1], positions[1], positions[2], positions[2], positions[3], positions[3]];
      let index = 0;
      while (index < 6 && t >= keyframes[index + 1]) index++;
      const f = ease((t - keyframes[index]) / (keyframes[index + 1] - keyframes[index]));
      return values[index].map((value, i) => value + (values[index + 1][i] - value) * f);
    };

    const complexity = element("g", {});
    const arrows = [
      "M650,415 C640,340 760,320 800,370 M800,370 l-12,-2 M800,370 l-4,-12",
      "M880,470 C950,520 900,560 840,545 M840,545 l10,-8 M840,545 l12,6",
      "M570,520 C520,600 640,610 700,575 M700,575 l-12,-2 M700,575 l-6,-11",
      "M800,380 C860,330 900,330 925,385 M925,385 l-8,-9 M925,385 l-12,-1",
    ].map((d) => pen(complexity, d, ink, 1.8, .55));
    const grouping = pen(complexity, "M378,322 C372,400 384,500 378,584", colors.sage, 2.4);
    const connections = [pen(complexity, "M892,440 C910,400 915,385 930,378", colors.amber, 2.4), pen(complexity, "M892,460 C910,500 915,520 930,548", colors.amber, 2.4)];
    const evidence = [pen(complexity, "M720,610 L822,628", ink, 2.4), pen(complexity, "M771,624 l-11,20 h22 z", ink, 2), pen(complexity, "M702,598 a10,10 0 1 0 .1,0", colors.blue, 2.2), pen(complexity, "M832,634 a6,6 0 1 0 .1,0", colors.blue, 2.2)];
    const tradeoff = text(complexity, "trade-off", 771, 682, 24, ink, "middle");
    const annotations = [[2, "backed by data", 0, 126, colors.sage, 7], [3, "no evidence", 0, 128, colors.amber, 6.8]] as const;

    notes.forEach((note, index) => {
      const group = element("g", {});
      const color = colors[note.color as keyof typeof colors];
      element("rect", { width: 150, height: 100, rx: 4, fill: paper, stroke: ink, "stroke-opacity": .7, "stroke-width": 1.5 }, group);
      element("rect", { width: 150, height: 6, rx: 3, fill: color, stroke: "none", "fill-opacity": .85 }, group);
      text(group, note.title, 12, 44, 23);
      note.lines.forEach((width, line) => element("path", { d: squiggle(14, 66 + line * 18, width), stroke: ink, "stroke-opacity": .4, "stroke-width": 2 }, group));
      const decorations: SVGElement[] = [];
      if (note.later) {
        decorations.push(element("rect", { x: -8, y: -8, width: 166, height: 116, rx: 8, fill: "none", stroke: ink, "stroke-width": 1.6, "stroke-dasharray": "7 6", "stroke-opacity": .6 }, group));
        decorations.push(text(group, "later", 152, -14, 22, colors.amber, "end"));
      }
      const marks = [
        [1, "M156,-4 q12,-16 24,-6 q6,12 -8,18 q-6,4 -6,12 M166,46 a2,2 0 1 0 .1,0", colors.amber, 3, 5.3, 6.1],
        [2, "M118,70 l10,10 l20,-30", colors.sage, 3.5, 6.4, 7.1],
        [3, "M-8,-8 L158,108 M158,-8 L-8,108", ink, 3, 6.0, 6.9],
        [4, "M70,-22 C195,-28 195,128 72,126 C-42,132 -46,-14 88,-20", colors.amber, 3.2, 9.9, 10.9],
      ] as const;
      marks.filter((mark) => mark[0] === index).forEach((mark) => {
        const path = pen(group, mark[1], mark[2], mark[3]);
        actions.push((t) => draw(path, t, mark[4], mark[5]));
      });
      annotations.filter((annotation) => annotation[0] === index).forEach((annotation) => {
        const label = text(group, annotation[1], annotation[2], annotation[3], 22, annotation[4]);
        actions.push((t) => label.setAttribute("opacity", String(clamp(annotation[5], annotation[5] + .6, t))));
      });
      actions.push((t) => {
        const [x, y, rotation, opacity] = place(note.positions, t - .1 * index);
        const appears = clamp(.4 + .3 * index, 1.1 + .3 * index, t);
        group.setAttribute("transform", `translate(${x} ${y}) rotate(${rotation} 75 50)`);
        group.setAttribute("opacity", String(opacity * appears));
        decorations.forEach((decoration) => decoration.setAttribute("opacity", String(clamp(13.4, 14.2, t))));
      });
    });

    const plan = element("g", {});
    const planLink = pen(plan, "M552,345 C590,345 600,305 640,300", colors.amber, 2.4);
    const rails = [pen(plan, "M660,316 V376", ink, 1.8, .5), pen(plan, "M660,436 V496", ink, 1.8, .5)];
    const planText = ["1  Test the riskiest assumption", "2  Build the smallest useful solution", "3  Define how success is measured"];
    const rows = planText.map((label, index) => {
      const y = [270, 390, 510][index];
      const color = [colors.blue, colors.amber, colors.sage][index];
      const row: { t0: number; marker: SVGPathElement; label: SVGTextElement; underline: SVGPathElement; arrow?: SVGPathElement; start?: SVGTextElement; bars?: SVGPathElement } = {
        t0: [13.4, 14.2, 15][index],
        marker: pen(plan, `M674,${y + 30} a14,14 0 1 0 -.1,0`, color, 3),
        label: text(plan, label, 704, y + 38, 26),
        underline: pen(plan, squiggle(706, y + 58, 150), ink, 2.2, .4),
      };
      if (index === 0) {
        row.arrow = pen(plan, `M704,${y + 48} C780,${y + 54} 900,${y + 44} 1040,${y + 50}`, colors.amber, 2.6);
        row.start = text(plan, "start here", 1050, y + 70, 24, colors.amber);
      }
      if (index === 2) row.bars = pen(plan, `M1040,${y + 60} v-22 M1056,${y + 60} v-36 M1072,${y + 60} v-50`, colors.sage, 3.5);
      return row;
    });
    const loop = pen(root, "M980,628 C860,716 560,716 440,596 M440,596 l3,15 M440,596 l15,-5", ink, 2.2, .45);
    actions.push((t) => {
      arrows.forEach((path, index) => {
        draw(path, t, 1 + index * .6, 2.2 + index * .6);
        path.setAttribute("opacity", String(1 - clamp(4.4, 5.2, t)));
      });
      const fade = 1 - clamp(12.6, 13.2, t);
      draw(grouping, t, 9.6, 10.4);
      grouping.setAttribute("opacity", String(fade));
      connections.forEach((path) => { draw(path, t, 10.4, 11.6); path.setAttribute("opacity", String(fade)); });
      evidence.forEach((path, index) => { draw(path, t, 11.2 + index * .2, 12.2 + index * .2); path.setAttribute("opacity", String(fade)); });
      tradeoff.setAttribute("opacity", String(clamp(11.6, 12.2, t) * fade));
      draw(planLink, t, 13.2, 13.8);
      draw(rails[0], t, 14, 14.4);
      draw(rails[1], t, 14.8, 15.2);
      rows.forEach((row) => {
        draw(row.marker, t, row.t0, row.t0 + .4);
        row.label.setAttribute("opacity", String(clamp(row.t0 + .2, row.t0 + .8, t)));
        draw(row.underline, t, row.t0 + .4, row.t0 + 1);
        if (row.arrow) draw(row.arrow, t, row.t0 + .9, row.t0 + 1.5);
        if (row.start) row.start.setAttribute("opacity", String(clamp(row.t0 + 1.2, row.t0 + 1.8, t)));
        if (row.bars) draw(row.bars, t, row.t0 + .9, row.t0 + 1.5);
      });
      draw(loop, t, 16, 17.4);
    });

    const figure = (color: string, baseX: number, baseY: number) => {
      const group = element("g", {});
      const limb = (d: string) => element("path", { d, stroke: ink, "stroke-width": 2.6, fill: "none", "stroke-linecap": "round" }, group) as SVGPathElement;
      element("path", { d: "M-15,-98 Q0,-86 15,-98 L13,-54 L-13,-54Z", fill: color, "fill-opacity": .8, stroke: "none" }, group);
      element("circle", { cx: 0, cy: -122, r: 17, fill: paper, stroke: ink, "stroke-width": 2.4 }, group);
      limb("M0,-104 L0,-52 M0,-52 L-16,0 M0,-52 L16,0");
      return { group, arm: limb("M0,-94 L0,-62"), otherArm: limb("M0,-94 L0,-62"), baseX, baseY };
    };
    const consultant = figure(colors.blue, 470, 810);
    const founder = figure(colors.amber, 1180, 810);
    const rotate = (arm: SVGPathElement, degrees: number) => arm.setAttribute("transform", `rotate(${degrees} 0 -94)`);
    const bubble = (x: number, y: number, message: string, from: number, to: number) => {
      const group = element("g", {});
      const width = message.length * 10 + 34;
      element("rect", { x: -width / 2, y: -28, width, height: 40, rx: 16, fill: paper, stroke: ink, "stroke-width": 1.8 }, group);
      element("path", { d: "M-8,12 l-4,16 l16,-16", fill: paper, stroke: ink, "stroke-width": 1.8 }, group);
      text(group, message, 0, 0, 25, ink, "middle");
      actions.push((t) => {
        const visible = windowOf(from, to, t);
        group.setAttribute("opacity", String(visible));
        group.setAttribute("transform", `translate(${x} ${y + (1 - visible) * 8})`);
      });
    };
    bubble(520, 550, "Let’s find the real problem", 1.2, 3.8);
    bubble(1090, 550, "So many priorities…", .8, 3.6);
    bubble(520, 550, "What does the evidence say?", 5, 7.8);
    bubble(1090, 550, "We only heard it once…", 6.2, 8.6);
    bubble(520, 550, "Fix this one first", 9.4, 12.3);
    bubble(1090, 550, "Which one first?", 9.2, 11.4);
    bubble(1090, 550, "Clear next steps!", 13.6, 16.4);
    bubble(520, 550, "Learn. Adjust. Repeat.", 16.6, 18.5);
    actions.push((t) => {
      const activeWork = Math.max(windowOf(4.6, 7.8, t), windowOf(9.4, 12.3, t), windowOf(13.4, 16.2, t));
      const celebrate = windowOf(13.6, 16.6, t);
      const question = Math.max(windowOf(.8, 3.6, t), windowOf(9.2, 11.4, t));
      const wave = Math.sin(t * 3.4);
      const bob = Math.sin(t * 2.2) * 3;
      consultant.group.setAttribute("transform", `translate(${consultant.baseX + clamp(13, 15, t) * 40} ${consultant.baseY + bob}) scale(1.55)`);
      founder.group.setAttribute("transform", `translate(${founder.baseX - clamp(13, 15, t) * 40} ${founder.baseY - bob}) scale(1.55)`);
      rotate(consultant.arm, 8 + 5 * Math.sin(t * 1.8));
      rotate(consultant.otherArm, lerp(-8, -118, activeWork) + 10 * wave * activeWork);
      rotate(founder.arm, lerp(-8, -150, celebrate) + (celebrate ? 10 * wave : 0));
      rotate(founder.otherArm, lerp(lerp(8, 115, question) + 8 * wave * question, 150, celebrate) + (celebrate ? 10 * wave : 0));
    });

    const captions = [[.6, 4.2, "1 · The messy reality"], [5, 8.6, "2 · Understand & validate"], [9.2, 12.6, "3 · Prioritise"], [13.2, 16.4, "4 · Turn decisions into action"], [16.6, 18.6, "5 · Learn, adjust, repeat"]] as const;
    captions.forEach(([from, to, caption]) => {
      const label = text(root, caption, 800, 138, 40, ink, "middle");
      actions.push((t) => label.setAttribute("opacity", String(windowOf(from, to, t) * .85)));
    });

    let clock = 0;
    let last = 0;
    let frame = 0;
    let inView = false;
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const render = (time: number) => {
      actions.forEach((action) => action(time));
      root.setAttribute("opacity", String(clamp(0, .5, time) * (reduced ? 1 : 1 - clamp(18.7, 19.6, time))));
    };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const tick = (now: number) => {
      if (!inView || document.hidden || reduced) return;
      clock = (clock + (now - last) / 1000) % DURATION;
      last = now;
      render(clock);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      stop();
      resizeObserver?.disconnect();
      if (reduced) {
        render(15.9);
        setActive(true);
      } else if (inView && !document.hidden) {
        last = performance.now();
        render(clock);
        setActive(true);
        frame = requestAnimationFrame(tick);
      } else {
        setActive(false);
      }
    };
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: .08, rootMargin: "80px 0px" })
      : null;
    observer?.observe(stage);
    if (!observer) { inView = true; sync(); }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event: MediaQueryListEvent) => { reduced = event.matches; sync(); };
    const onVisibility = () => sync();
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer?.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
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
