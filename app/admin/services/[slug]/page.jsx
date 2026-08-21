import Link from "next/link";
import AdminShell from "@/components/AdminShell";

const groups = {
  "brand-strategy": {
    number: "01",
    name: "Brand & Strategy",
    services:
      "Brand Strategy\nPositioning\nBrand Identity\nCampaign Strategy\nGo-to-Market Strategy\nCreative Direction",
  },
  creative: {
    number: "02",
    name: "Creative",
    services:
      "Graphic Design\nSocial Creatives\nPhotography\nVideo Production\nMotion Graphics\nPackaging Design",
  },
  "digital-social": {
    number: "03",
    name: "Digital & Social",
    services:
      "Social Media Management\nContent Strategy\nContent Production\nCommunity Management\nCreator Marketing",
  },
  "performance-growth": {
    number: "04",
    name: "Performance & Growth",
    services:
      "Meta Ads\nTikTok Ads\nGoogle Ads\nPerformance Creative\nCampaign Optimization\nAnalytics",
  },
  ecommerce: {
    number: "05",
    name: "E-Commerce",
    services:
      "Shopee\nLazada\nTikTok Shop\nShopify\nStore Design\nMarketplace Optimization",
  },
  technology: {
    number: "06",
    name: "Technology",
    services:
      "Web Design\nWeb Development\nLanding Pages\nInternal Systems\nAutomation\nAI Workflows",
  },
};

export default async function AdminServiceEditor({ params }) {
  const { slug } = await params;
  const isNew = slug === "new";

  const group = isNew
    ? { number: "", name: "", services: "" }
    : groups[slug] || { number: "", name: "", services: "" };

  return (
    <AdminShell
      title={isNew ? "New Service Group" : `Edit ${group.name}`}
      subtitle="Manage the group name, order, and services shown on the public site."
    >
      <div className="admin-toolbar">
        <Link className="admin-btn admin-btn-secondary" href="/admin/services">
          ← Back to Services
        </Link>
      </div>

      <section className="admin-panel">
        <div className="admin-form-grid">
          <label>
            <span>Display number</span>
            <input defaultValue={group.number} placeholder="01" />
          </label>

          <label>
            <span>Group name</span>
            <input defaultValue={group.name} placeholder="Service group" />
          </label>

          <label className="admin-full-field">
            <span>Services</span>
            <textarea
              defaultValue={group.services}
              placeholder="One service per line"
              rows="10"
            />
          </label>

          <label>
            <span>Visibility</span>
            <select defaultValue="visible">
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
        </div>
      </section>
    </AdminShell>
  );
}
