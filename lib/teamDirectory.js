import { team as fallbackTeam } from "@/data/team";
import { getTeamMember, getTeamMembers } from "@/lib/teamAdmin";

export async function getMergedTeamMembers({ includeInactive = false } = {}) {
  let savedMembers = [];
  try {
    savedMembers = await getTeamMembers();
  } catch {
    savedMembers = [];
  }

  const savedBySlug = new Map(savedMembers.map((m) => [m.slug, m]));

  const mergedFallback = fallbackTeam.map((member, index) =>
    mergeMember(member, savedBySlug.get(member.slug), index + 1)
  );

  const fallbackSlugs = new Set(fallbackTeam.map((m) => m.slug));
  const savedOnly = savedMembers
    .filter((m) => !fallbackSlugs.has(m.slug))
    .map((m) => mergeMember(null, m, 999));

  return [...mergedFallback, ...savedOnly]
    .filter((m) => includeInactive || m.status !== "Inactive")
    .sort(
      (a, b) =>
        Number(a.display_order || 999) - Number(b.display_order || 999) ||
        a.name.localeCompare(b.name)
    );
}

export async function getMergedTeamMember(slug, { includeInactive = false } = {}) {
  const fallback = fallbackTeam.find((m) => m.slug === slug) || null;

  let saved = null;
  try {
    saved = await getTeamMember(slug);
  } catch {
    saved = null;
  }

  if (!fallback && !saved) return null;

  const fallbackIndex = fallback
    ? fallbackTeam.findIndex((m) => m.slug === fallback.slug) + 1
    : 999;

  const merged = mergeMember(fallback, saved, fallbackIndex);

  if (!includeInactive && merged.status === "Inactive") return null;
  return merged;
}

function mergeMember(fallback, saved, fallbackOrder) {
  const name = saved?.name || fallback?.name || "";

  return {
    slug: saved?.slug || fallback?.slug || "",
    initials: initialsFor(name),
    name,
    role: saved?.role || fallback?.role || "",
    photo_url: saved?.photo_url || "",
    display_order: saved?.display_order ?? fallbackOrder,
    bio: saved?.bio || fallback?.bio || "",
    expertise: saved
      ? parseExpertise(saved.expertise)
      : Array.isArray(fallback?.expertise)
      ? fallback.expertise
      : [],
    social_url: saved?.social_url || "",
    status: saved?.status || "Active",
    projects: Array.isArray(fallback?.projects) ? fallback.projects : [],
  };
}

function parseExpertise(value) {
  return String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function initialsFor(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
