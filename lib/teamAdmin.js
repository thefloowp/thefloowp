const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }
}

function headers(prefer) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export async function getTeamMember(slug) {
  assertConfig();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/team_members?slug=eq.${encodeURIComponent(
      slug
    )}&select=*&limit=1`,
    {
      headers: headers(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return rows[0] || null;
}

export async function getTeamMembers() {
  assertConfig();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/team_members?select=*&order=display_order.asc,name.asc`,
    {
      headers: headers(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function upsertTeamMember(slug, payload) {
  assertConfig();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/team_members?on_conflict=slug`,
    {
      method: "POST",
      headers: headers("resolution=merge-duplicates,return=representation"),
      body: JSON.stringify({
        slug,
        ...payload,
        is_deleted: false,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return rows[0] || null;
}

export async function softDeleteTeamMember(slug, fallback = {}) {
  assertConfig();

  const existing = await getTeamMember(slug);

  const record = existing
    ? {
        ...existing,
        is_deleted: true,
        updated_at: new Date().toISOString(),
      }
    : {
        slug,
        name: fallback.name || slug,
        role: fallback.role || "Team Member",
        photo_url: "",
        display_order: fallback.display_order || 999,
        bio: "",
        expertise: "",
        social_url: "",
        status: "Inactive",
        is_deleted: true,
        updated_at: new Date().toISOString(),
      };

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/team_members?on_conflict=slug`,
    {
      method: "POST",
      headers: headers("resolution=merge-duplicates,return=representation"),
      body: JSON.stringify(record),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}
