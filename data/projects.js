export const projects = [
  {
    slug: "crysalis-growth",
    number: "01",
    client: "CRYSALIS",
    title: "Building a stronger lifestyle brand system",
    category: "Brand · Creative · E-Commerce",
    services: [
      "Creative Direction",
      "Campaign Strategy",
      "E-Commerce",
      "Content Systems",
    ],
    team: ["francesca-navarro", "alex-rivera"],
    summary:
      "A connected brand and commerce approach designed to make product launches clearer, stronger, and easier to scale across channels.",
    challenge:
      "Create a more cohesive brand experience while supporting fast-moving product launches, content production, and e-commerce execution.",
    response:
      "Floowp connected creative direction, campaign planning, content systems, and e-commerce execution into one repeatable growth loop.",
    result:
      "A clearer visual system, stronger launch consistency, and a more scalable framework for ongoing brand activity.",
  },
  {
    slug: "scrubz-shield",
    number: "02",
    client: "SCRUBZ",
    title: "Turning product education into campaign attention",
    category: "Campaign · Content · Social",
    services: [
      "Campaign Strategy",
      "Creative Direction",
      "Social Content",
      "Performance Creative",
    ],
    team: ["francesca-navarro", "sam-lee"],
    summary:
      "A rainy-season content direction combining product education, social interaction, and visual storytelling.",
    challenge:
      "Communicate functional product value while keeping the campaign engaging enough for social media discovery.",
    response:
      "Floowp developed interactive content concepts, visual-search formats, product-led storytelling, and platform-ready creative.",
    result:
      "A campaign direction that turns education into participation rather than relying on hard-selling product communication.",
  },
  {
    slug: "quencha-kids",
    number: "03",
    client: "QUENCHA",
    title: "Making everyday products feel launch-worthy",
    category: "Launch · Creative · Commerce",
    services: [
      "Product Launch",
      "Creative Direction",
      "Content",
      "Marketplace Execution",
    ],
    team: ["alex-rivera", "sam-lee"],
    summary:
      "A product launch framework designed to make functional kids' essentials feel cohesive, useful, and visually distinct.",
    challenge:
      "Build a launch story that balances product function, parent relevance, visual consistency, and marketplace conversion.",
    response:
      "Floowp translated product features into campaign stories, creative assets, and e-commerce-ready communication.",
    result:
      "A clearer launch structure connecting brand storytelling with practical product communication.",
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
