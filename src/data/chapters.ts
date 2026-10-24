export type Chapter = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  deliverable: string;
};

export const chapters: Chapter[] = [
  {
    id: "understand",
    number: "01",
    eyebrow: "Understand",
    title: "Make the real problem visible.",
    description: "Clarify the customer, business objective, existing workflow and the moments where work gets stuck.",
    deliverable: "A shared problem statement and current-state view.",
  },
  {
    id: "validate",
    number: "02",
    eyebrow: "Validate",
    title: "Test what is still an assumption.",
    description: "Separate what the team knows from what it believes, then identify the most useful evidence to gather.",
    deliverable: "Prioritised assumptions, evidence and open questions.",
  },
  {
    id: "prioritise",
    number: "03",
    eyebrow: "Prioritise",
    title: "Choose where attention can matter most.",
    description: "Compare opportunities against customer value, business intent, feasibility and risk; agree how progress will be recognised.",
    deliverable: "A focused opportunity list and agreed success measures.",
  },
  {
    id: "design",
    number: "04",
    eyebrow: "Design",
    title: "Turn direction into a usable first scope.",
    description: "Shape the future workflow, key decisions and exceptions with the people who will use and build the solution.",
    deliverable: "A workflow, solution outline or requirements for the agreed scope.",
  },
  {
    id: "deliver",
    number: "05",
    eyebrow: "Deliver",
    title: "Keep product intent connected to the build.",
    description: "Work through trade-offs with engineering and stakeholders, clarify decisions, and refine the solution as it takes shape.",
    deliverable: "Clear decisions, delivery priorities and a supportable release.",
  },
  {
    id: "measure",
    number: "06",
    eyebrow: "Measure & improve",
    title: "Learn from what changed in practice.",
    description: "Review the result against the agreed objective and use real signals to decide what should happen next.",
    deliverable: "An outcome review, lessons and recommended next actions.",
  },
];
