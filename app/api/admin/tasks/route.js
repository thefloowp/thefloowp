import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createTaskHandoverItem,
  deleteTaskHandoverItem,
  getTaskHandoverItems,
  updateTaskHandoverItem,
} from "@/lib/taskHandover";

async function isAuthorized() {
  const store = await cookies();
  const session = store.get("floowp_admin_session")?.value;

  return (
    Boolean(process.env.ADMIN_SESSION_TOKEN) &&
    session === process.env.ADMIN_SESSION_TOKEN
  );
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getTaskHandoverItems();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load tasks." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();

    if (!payload.title?.trim()) {
      return NextResponse.json(
        { error: "Project title is required." },
        { status: 400 }
      );
    }

    if (!payload.description?.trim()) {
      return NextResponse.json(
        { error: "Project brief / description is required." },
        { status: 400 }
      );
    }

    if (!payload.due_date) {
      return NextResponse.json(
        { error: "Target / submission date is required." },
        { status: 400 }
      );
    }

    const turnaround =
      payload.turnaround_days === "" ||
      payload.turnaround_days === null ||
      payload.turnaround_days === undefined
        ? null
        : Number(payload.turnaround_days);

    const item = await createTaskHandoverItem({
      title: payload.title.trim(),
      description: payload.description.trim(),
      work_type: payload.work_type?.trim() || "",
      priority: payload.priority || "Normal",
      start_date: payload.start_date || null,
      due_date: payload.due_date || null,
      turnaround_days:
        Number.isFinite(turnaround) && turnaround >= 0 ? turnaround : null,
      required_file_type: payload.required_file_type?.trim() || "",
      attachment_links: payload.attachment_links?.trim() || "",
      notes: payload.notes?.trim() || "",
      assignee: null,
      status: "Open",
    });

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to create project." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();

    if (!payload.id) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    const updates = {};

    if ("assignee" in payload) updates.assignee = payload.assignee || null;
    if ("status" in payload) updates.status = payload.status;
    if ("title" in payload) updates.title = payload.title;
    if ("description" in payload) updates.description = payload.description;
    if ("work_type" in payload) updates.work_type = payload.work_type || "";
    if ("priority" in payload) updates.priority = payload.priority;
    if ("start_date" in payload) updates.start_date = payload.start_date || null;
    if ("due_date" in payload) updates.due_date = payload.due_date || null;

    if ("turnaround_days" in payload) {
      const turnaround =
        payload.turnaround_days === "" ||
        payload.turnaround_days === null ||
        payload.turnaround_days === undefined
          ? null
          : Number(payload.turnaround_days);

      updates.turnaround_days =
        Number.isFinite(turnaround) && turnaround >= 0 ? turnaround : null;
    }

    if ("required_file_type" in payload) {
      updates.required_file_type = payload.required_file_type || "";
    }

    if ("attachment_links" in payload) {
      updates.attachment_links = payload.attachment_links || "";
    }

    if ("notes" in payload) {
      updates.notes = payload.notes || "";
    }

    const item = await updateTaskHandoverItem(payload.id, updates);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to update project." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();

    if (!payload.id) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    await deleteTaskHandoverItem(payload.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to delete project." },
      { status: 500 }
    );
  }
}
