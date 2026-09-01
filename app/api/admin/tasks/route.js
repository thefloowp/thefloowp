import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createTaskHandoverItem,
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

    const item = await createTaskHandoverItem({
      title: payload.title.trim(),
      description: payload.description?.trim() || "",
      priority: payload.priority || "Normal",
      due_date: payload.due_date || null,
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
    if ("priority" in payload) updates.priority = payload.priority;
    if ("due_date" in payload) updates.due_date = payload.due_date || null;

    const item = await updateTaskHandoverItem(payload.id, updates);
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to update project." },
      { status: 500 }
    );
  }
}
