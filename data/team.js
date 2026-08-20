export const team = [
  {
    slug: "francesca-navarro",
    initials: "FN",
    name: "Francesca Navarro",
    role: "Creative Direction & Marketing",
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
];

export function getMember(slug) {
  return team.find((member) => member.slug === slug);
}
