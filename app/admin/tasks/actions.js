"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateTaskHandoverItem } from "@/lib/taskHandover";

async function isAuthorized() {
  const store = await cookies();
  const session = store.get("floowp_admin_session")?.value;

  return (
    Boolean(process.env.ADMIN_SESSION_TOKEN) &&
    session === process.env.ADMIN_SESSION_TOKEN
  );
}

export async function saveWorkItem(payload) {
  if (!(await isAuthorized())) {
    return {
      ok: false,
      error: "Your admin session has expired. Please sign in again.",
    };
  }

  try {
    if (!payload?.id) {
      return { ok: false, error: "Work item ID is missing." };
    }

    const turnaround =
      payload.turnaround_days === "" ||
      payload.turnaround_days === null ||
      payload.turnaround_days === undefined
        ? null
        : Number(payload.turnaround_days);

    const rateAmount =
      payload.rate_amount === "" ||
      payload.rate_amount === null ||
      payload.rate_amount === undefined
        ? null
        : Number(payload.rate_amount);

    const updates = {
      title: String(payload.title || "").trim(),
      description: String(payload.description || "").trim(),
      work_type: String(payload.work_type || "").trim(),
      priority: payload.priority || "Normal",
      start_date: payload.start_date || null,
      due_date: payload.due_date || null,
      turnaround_days:
        Number.isFinite(turnaround) && turnaround >= 0 ? turnaround : null,
      required_file_type: String(payload.required_file_type || ""),
      work_from: Array.isArray(payload.work_from)
        ? payload.work_from.filter(Boolean)
        : [],
      rate_currency: payload.rate_currency === "USD" ? "USD" : "PHP",
      rate_amount:
        Number.isFinite(rateAmount) && rateAmount >= 0 ? rateAmount : null,
      attachment_links: String(payload.attachment_links || ""),
      client_message_text: String(payload.client_message_text || ""),
      client_message_images: String(payload.client_message_images || ""),
      notes: String(payload.notes || ""),
    };

    if (!updates.title) {
      return { ok: false, error: "Project / work title is required." };
    }

    const item = await updateTaskHandoverItem(payload.id, updates);

    revalidatePath("/admin/tasks");
    revalidatePath(`/admin/tasks/${payload.id}`);

    return {
      ok: true,
      item: item
        ? {
            id: item.id,
            title: item.title,
            status: item.status,
          }
        : null,
    };
  } catch (error) {
    const raw = String(error?.message || error || "");

    if (
      raw.includes("work_from") &&
      (raw.includes("column") ||
        raw.includes("schema cache") ||
        raw.includes("PGRST"))
    ) {
      return {
        ok: false,
        error:
          "The Work From database field is not available yet. Run the latest Supabase Work From migration once, then try saving again.",
      };
    }

    if (raw.includes("task_handover_items")) {
      return {
        ok: false,
        error:
          "Supabase could not update this work item. Please check the task_handover_items table and try again.",
      };
    }

    return {
      ok: false,
      error: raw || "Unable to save changes.",
    };
  }
}
