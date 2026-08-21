export const team = [
  {
    slug: "francesca-navarro",
    initials: "CN",
    name: "Che Navarro",
    role: "Creative Direction and Brand Systems",
    bio:
      "Works across brand strategy, creative direction, campaign planning, e-commerce, and connected marketing execution.",
    expertise: [
      "Creative Direction",
      "Brand Strategy",
      "Campaign Strategy",
      "E-Commerce",
      "Growth Marketing",
    ],
    projects: ["crysalis-growth", "scrubz-shield"],
  },
  {
    slug: "alex-rivera",
    initials: "AR",
    name: "Alex Rivera",
    role: "Design & Brand Systems",
    bio:
      "Builds visual systems and campaign identities that keep brands clear, consistent, and adaptable across touchpoints.",
    expertise: [
      "Brand Identity",
      "Graphic Design",
      "Campaign Design",
      "Art Direction",
      "Visual Systems",
    ],
    projects: ["crysalis-growth", "quencha-kids"],
  },
  {
    slug: "sam-lee",
    initials: "SL",
    name: "Sam Lee",
    role: "Content & Digital",
    bio:
      "Shapes content into platform-ready stories designed for attention, relevance, and continuous iteration.",
    expertise: [
      "Content Strategy",
      "Social Media",
      "Performance Creative",
      "Video Direction",
      "Digital Campaigns",
    ],
    projects: ["scrubz-shield", "quencha-kids"],
  },

  {
    slug: "mika-reyes",
    initials: "MR",
    name: "Mika Reyes",
    role: "Visual Design and Art Direction",
    bio:
      "Develops visual identities, campaign systems, and design executions that keep brand expression cohesive across channels.",
    expertise: [
      "Visual Design",
      "Art Direction",
      "Brand Identity",
      "Campaign Design",
      "Graphic Systems",
    ],
    projects: [],
  },
  {
    slug: "nico-santos",
    initials: "NS",
    name: "Nico Santos",
    role: "Content Strategy and Social",
    bio:
      "Shapes content systems, platform ideas, and social storytelling designed to stay relevant, clear, and adaptable.",
    expertise: [
      "Content Strategy",
      "Social Media",
      "Campaign Concepts",
      "Copy Direction",
      "Content Systems",
    ],
    projects: [],
  },
  {
    slug: "bea-lim",
    initials: "BL",
    name: "Bea Lim",
    role: "Digital Experience and Creative Technology",
    bio:
      "Connects creative thinking with digital execution, building experiences and systems that make brand interactions more seamless.",
    expertise: [
      "Digital Experience",
      "Creative Technology",
      "Web Design",
      "UX Direction",
      "Interactive Systems",
    ],
    projects: [],
  },
];

export function getMember(slug) {
  return team.find((member) => member.slug === slug);
}
