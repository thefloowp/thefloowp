import AdminShell from "@/components/AdminShell";
import TaskHandoverBoard from "@/components/TaskHandoverBoard";
import { getMergedTeamMembers } from "@/lib/teamDirectory";
import {
  getTaskHandoverItems,
  updateTaskHandoverItem,
} from "@/lib/taskHandover";

export const dynamic = "force-dynamic";

export default async function WorkIntakePage() {
  let items = [];
  let members = [];
  let loadError = "";

  try {
    [items, members] = await Promise.all([
      getTaskHandoverItems(),
      getMergedTeamMembers(),
    ]);

    const activeNames = new Set(members.map((member) => member.name));

    const staleAssignments = items.filter(
      (item) => item.assignee && !activeNames.has(item.assignee)
    );

    if (staleAssignments.length) {
      const cleaned = await Promise.all(
        staleAssignments.map((item) =>
          updateTaskHandoverItem(item.id, {
            assignee: null,
            status: "Unassigned",
          })
        )
      );

      const cleanedById = new Map(cleaned.map((item) => [item.id, item]));
      items = items.map((item) => cleanedById.get(item.id) || item);
    }
  } catch (error) {
    loadError = error.message || "Unable to load Work Intake.";
  }

  return (
    <AdminShell
      title="Work Intake"
      subtitle="Manage incoming client requests, assign ownership, and track delivery status."
    >
      <TaskHandoverBoard
        initialItems={items}
        teamMembers={members.map((member) => member.name)}
        loadError={loadError}
      />
    </AdminShell>
  );
}
