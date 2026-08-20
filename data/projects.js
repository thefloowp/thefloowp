export const projects = [
  {
    slug: "crysalis-growth",
    number: "01",
    client: "NOVA STUDIO",
    title: "Building a brand system designed to scale",
    category: "Brand · Creative · Digital",
    services: [
      "Creative Direction",
      "Brand Strategy",
      "Campaign Strategy",
      "Content Systems",
    ],
    team: ["francesca-navarro", "alex-rivera"],
    summary:
      "A connected brand system designed to create a clearer identity, stronger communication, and a more scalable creative foundation.",
    challenge:
      "Build a cohesive brand direction that could remain consistent while adapting across campaigns, digital platforms, and future growth.",
    response:
      "Floowp developed a connected approach across strategy, creative direction, visual communication, and repeatable content systems.",
    result:
      "A clearer brand foundation with a flexible system designed to support ongoing campaigns and future expansion.",
  },
  {
    slug: "scrubz-shield",
    number: "02",
    client: "FORME",
    title: "Turning a simple idea into campaign attention",
    category: "Campaign · Content · Social",
    services: [
      "Campaign Strategy",
      "Creative Direction",
      "Social Content",
      "Performance Creative",
    ],
    team: ["francesca-navarro", "sam-lee"],
    summary:
      "A social-first campaign direction built around strong visual storytelling, clear communication, and audience interaction.",
    challenge:
      "Translate a straightforward product or service message into content that feels relevant, engaging, and native to digital platforms.",
    response:
      "Floowp developed a campaign system combining visual storytelling, interactive formats, creative direction, and platform-ready content.",
    result:
      "A more engaging campaign framework designed to turn passive viewing into stronger audience attention and interaction.",
  },
  {
    slug: "quencha-kids",
    number: "03",
    client: "KIN",
    title: "Making everyday products feel launch-worthy",
    category: "Launch · Creative · Commerce",
    services: [
      "Product Launch",
      "Creative Direction",
      "Content",
      "Digital Commerce",
    ],
    team: ["alex-rivera", "sam-lee"],
    summary:
      "A launch framework designed to transform an everyday product into a clearer, more cohesive, and more compelling brand experience.",
    challenge:
      "Develop a launch story that could communicate practical value while still feeling visually distinctive and campaign-ready.",
    response:
      "Floowp connected product positioning, creative direction, launch communication, and digital execution into one cohesive system.",
    result:
      "A clearer launch direction that connects brand storytelling with practical communication and commercial objectives.",
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
