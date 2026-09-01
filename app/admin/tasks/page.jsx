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
      title="Task Handover"
      subtitle="Open projects can be accepted by the team. Accepted work is organized below by person and status."
    >
      <TaskHandoverBoard
        initialItems={items}
        teamMembers={team.map((member) => member.name)}
        loadError={loadError}
      />
    </AdminShell>
  );
}
