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

export async function getTaskHandoverItems() {
  assertConfig();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/task_handover_items?select=*&order=created_at.desc`,
    { headers: headers(), cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function createTaskHandoverItem(payload) {
  assertConfig();

  const response = await fetch(`${SUPABASE_URL}/rest/v1/task_handover_items`, {
    method: "POST",
    headers: headers("return=representation"),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return rows[0];
}

export async function updateTaskHandoverItem(id, payload) {
  assertConfig();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/task_handover_items?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: headers("return=representation"),
      body: JSON.stringify({
        ...payload,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return rows[0];
}

export async function deleteTaskHandoverItem(id) {
  assertConfig();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/task_handover_items?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: headers(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}
