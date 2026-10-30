export type AudienceNeed = {
  number: string;
  icon: "discover" | "direction" | "workflow";
  title: string;
  audience: string;
  problem: string;
  approach: string;
  output: string;
};

export type EngagementOption = {
  number: string;
  icon: AudienceNeed["icon"];
  title: string;
  fit: string;
  focus: string;
  outputs: string[];
};

export type CaseStudy = {
  title: string;
  label?: string;
  context: string;
  whatIDid: string;
  result: string;
  notYetProven?: string;
};

export const portfolioContent = {
  brand: "Vijayebhava",
  hero: {
    eyebrow: "Product discovery · Product management · Business transformation",
    titleLead: "Make the complex",
    titleAccent: "clear.",
    titleEnd: "Build what matters.",
    summary:
      "I help founders and small product teams understand the problem, choose what to build next, and turn good decisions into practical solutions.",
    audienceNote: "For early-stage digital products and AI-enabled SaaS",
    primaryCta: "Discuss your product",
    secondaryCta: "Explore my approach",
  },
  audience: {
    eyebrow: "A clear next step starts with the right problem",
    title: "What are you working through?",
    intro:
      "Come in at the point where you need clarity. The work can focus on one question or connect to a wider product journey.",
    needs: [
      {
        number: "01",
        icon: "discover",
        title: "Validate a product idea",
        audience: "For founders with an idea, prototype or early product.",
        problem: "You need to know whose problem it solves and what evidence is worth gathering before investing further.",
        approach: "Clarify the customer, map the alternatives and make the riskiest assumptions testable.",
        output: "A problem statement, validation plan and prioritised assumptions.",
      },
      {
        number: "02",
        icon: "direction",
        title: "Choose what to build next",
        audience: "For teams with a product or MVP and too many possible priorities.",
        problem: "Customer feedback, business goals and engineering constraints are pulling the roadmap in different directions.",
        approach: "Review the opportunities, surface trade-offs and shape a focused, feasible product scope.",
        output: "Prioritised opportunities, a near-term plan and actionable requirements.",
      },
      {
        number: "03",
        icon: "workflow",
        title: "Improve a working process",
        audience: "For businesses with repetitive, fragmented or manual workflows.",
        problem: "You want to reduce friction and are exploring automation or AI, but need to understand the actual opportunity.",
        approach: "Map how work happens today, then compare process, software, automation and AI options.",
        output: "A workflow view, opportunity assessment and practical solution requirements.",
      },
    ] satisfies AudienceNeed[],
  },
  experience: {
    eyebrow: "Experience across teams and industries",
    title: "Good work happens in good company.",
    intro:
      "A selection of organisations and teams I have worked with. Project details are shared only where they can be supported and disclosed.",
    companies: [
      { name: "Eurofins", logo: "/companies/eurofins.png" },
      { name: "Tekenlight", logo: "/companies/tekenlight.png" },
      { name: "SCMCentral", logo: "/companies/scmcentral.png" },
      { name: "Focaloid", logo: "/companies/focaloid.svg" },
      { name: "Vyturr", logo: null },
    ],
  },
  approach: {
    eyebrow: "How I work",
    title: "From a real problem to useful progress.",
    intro:
      "A practical sequence for making decisions with the people closest to the work. Start with the problem you need to solve; each engagement can be scoped around your current needs, with the wider process available when it adds value.",
  },
  caseStudies: [
    {
      title: "Eurofins · Annual Review Process platform",
      context: "Internal annual review process for 3,000+ managers across 50+ countries, run on Excel.",
      whatIDid: "As Senior Business Analyst and the sole BA, moved the Excel-based process onto a digital platform.",
      result: "The process went from 4 months to 2 months.",
    },
    {
      title: "SCMCentral · Implementation Intelligence",
      label: "Prototype",
      context: "Supply chain and shopfloor ERP for SME manufacturers (SCMCentral).",
      whatIDid: "Framed the product and built a deterministic enterprise data-readiness MVP with validation rules, a pilot protocol, safety boundaries, and implementation-readiness decisions.",
      result: "A working prototype and a defined pilot protocol.",
      notYetProven: "No implementation-team pilot has run yet, there is no measured time or quality outcome, and user validation is incomplete.",
    },
    {
      title: "Prototypes",
      label: "Prototype",
      context: "Quotation Comparison and BOM Extraction.",
      whatIDid: "Two working prototypes I have built.",
      result: "Two working prototypes.",
      notYetProven: "Not yet validated with real users.",
    },
  ] satisfies CaseStudy[],
  about: {
    eyebrow: "A product partner for the messy middle",
    title: "I make space for clear decisions.",
    paragraphs: [
      "I help founders and small product teams make sense of complex business and customer problems, choose what to build next, and carry those decisions into delivery.",
    ],
    note: "Product discovery · Product management · Business transformation",
  },
  engagements: {
    eyebrow: "Flexible ways to work together",
    title: "Start with the question in front of you.",
    intro:
      "The scope can be focused on a particular decision or continue through planning and delivery. We can discuss what fits your context before defining the work.",
    options: [
      {
        number: "01",
        icon: "discover",
        title: "Focused product discovery",
        fit: "When the customer, problem or product idea still needs clarity.",
        focus: "Understand the problem, examine assumptions and identify the most useful evidence to gather.",
        outputs: ["Problem framing", "Validation priorities", "Evidence-based next steps"],
      },
      {
        number: "02",
        icon: "direction",
        title: "Product direction & planning",
        fit: "When you need to make a confident choice about what comes next.",
        focus: "Review opportunities and constraints, prioritise the work, and define an actionable scope.",
        outputs: ["Opportunity priorities", "Near-term product plan", "Requirements where useful"],
      },
      {
        number: "03",
        icon: "workflow",
        title: "Ongoing product support",
        fit: "When the team needs continued product thinking and coordination.",
        focus: "Support product decisions, work across product and engineering, and review progress against the objective.",
        outputs: ["Clearer decisions", "Connected delivery priorities", "Outcome review and next steps"],
      },
    ] satisfies EngagementOption[],
  },
  testimonials: [] as { quote: string; name: string; role: string }[],
  writingSamples: [] as { title: string; url: string }[],
  contact: {
    whatsappUrl:
      "https://wa.me/919164488088?text=Hi%20Vijay%2C%20I%27d%20like%20to%20discuss%20a%20product%20or%20business%20challenge%20with%20you.",
    linkedinUrl: "https://www.linkedin.com/in/vijaykumarbs/",
  },
};
