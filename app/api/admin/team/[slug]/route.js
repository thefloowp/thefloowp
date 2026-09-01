import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTeamMember, upsertTeamMember } from "@/lib/teamAdmin";

async function isAuthorized() {
  const store = await cookies();
  const session = store.get("floowp_admin_session")?.value;

  return (
    Boolean(process.env.ADMIN_SESSION_TOKEN) &&
    session === process.env.ADMIN_SESSION_TOKEN
  );
}

export async function GET(_request, { params }) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const member = await getTeamMember(slug);
    return NextResponse.json({ member });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load team member." },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const payload = await request.json();

    if (!payload.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!payload.role?.trim()) {
      return NextResponse.json(
        { error: "Role is required." },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug === "new"
        ? makeSlug(payload.name)
        : slug;

    const member = await upsertTeamMember(cleanSlug, {
      name: payload.name.trim(),
      role: payload.role.trim(),
      photo_url: payload.photo_url?.trim() || "",
      display_order: Number(payload.display_order) || 1,
      bio: payload.bio?.trim() || "",
      expertise: payload.expertise?.trim() || "",
      social_url: payload.social_url?.trim() || "",
      status: payload.status === "Inactive" ? "Inactive" : "Active",
    });

    return NextResponse.json({ member, slug: cleanSlug });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to save team member." },
      { status: 500 }
    );
  }
}

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
