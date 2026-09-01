import AdminShell from "@/components/AdminShell";
import TaskHandoverBoard from "@/components/TaskHandoverBoard";
import { team } from "@/data/team";
import { getTaskHandoverItems } from "@/lib/taskHandover";

export const dynamic = "force-dynamic";

export default async function TaskHandoverPage() {
  let items = [];
  let loadError = "";

  try {
    items = await getTaskHandoverItems();
  } catch (error) {
    loadError = error.message || "Unable to load task handover items.";
  }

  return (
    <AdminShell
      title="Work Intake"
      subtitle="Manage incoming client requests, assign ownership, and track delivery status."
    >
      <TaskHandoverBoard
        initialItems={items}
        teamMembers={team.map((member) => member.name)}
        loadError={loadError}
      />
    </AdminShell>
  );
}
