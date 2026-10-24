export type Chapter = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  deliverable: string;
  detail: string;
};

export const chapters: Chapter[] = [
  {
    id: "discovery",
    number: "01",
    eyebrow: "Start with the customer",
    title: "Understand what is really getting in the way.",
    description:
      "Before choosing a solution, we listen to the people doing the work and trace how the process actually moves.",
    deliverable: "Current-state workflow · Problem statement · Opportunity map",
    detail:
      "Illustrative scenario: order updates are repeatedly chased across teams. We map the order journey, find where information gets lost, and agree which friction matters most.",
  },
  {
    id: "strategy",
    number: "02",
    eyebrow: "Align on what matters",
    title: "Put effort behind the right opportunity.",
    description:
      "Bring business priorities, customer needs and delivery realities into one practical decision about what to do next.",
    deliverable: "Prioritised opportunities · Success measures · Agreed scope",
    detail:
      "The output is a clear direction, shaped around expected impact, feasibility and risk. A focused engagement can begin here without requiring a larger programme.",
  },
  {
    id: "design",
    number: "03",
    eyebrow: "Make the future tangible",
    title: "Turn a problem into a workflow people can use.",
    description:
      "Shape the future process with the people who will depend on it. Make handoffs, decisions and exceptions visible before implementation.",
    deliverable: "Future-state workflow · Prototype direction · Delivery-ready requirements",
    detail:
      "A shared model helps business and engineering test assumptions early, resolve edge cases, and understand what a useful first release needs to do.",
  },
  {
    id: "engineering",
    number: "04",
    eyebrow: "Build with the team",
    title: "Keep the solution grounded in real constraints.",
    description:
      "Work alongside product and engineering to turn the agreed workflow into a sound, appropriately sized solution.",
    deliverable: "Validated requirements · Delivery plan · Decision record",
    detail:
      "Technical choices stay connected to the business need. Trade-offs are surfaced clearly so the team can make progress without overbuilding.",
  },
  {
    id: "delivery",
    number: "05",
    eyebrow: "Put change into practice",
    title: "Help the change land in the day-to-day.",
    description:
      "Coordinate the details across stakeholders, delivery teams and users so the new way of working is understandable and supportable.",
    deliverable: "Release readiness · Adoption plan · Ownership and next steps",
    detail:
      "Implementation includes the people and operating routines around the technology. The aim is a usable change, not a handover that leaves teams guessing.",
  },
  {
    id: "outcomes",
    number: "06",
    eyebrow: "Learn from the result",
    title: "Measure what changed for the business.",
    description:
      "Agree how progress will be observed, review the signal with the team, and use what you learn to decide what comes next.",
    deliverable: "Outcome measures · Review cadence · Next-step recommendation",
    detail:
      "Potential outcomes depend on the problem and implementation. Measures are agreed with each team; no client results or performance gains are assumed here.",
  },
];
