"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminTeamList({ initialMembers }) {
  const [members, setMembers] = useState(initialMembers || []);
  const [deletingSlug, setDeletingSlug] = useState("");
  const [error, setError] = useState("");

  async function deleteMember(member) {
    const confirmed = window.confirm(
      `Delete ${member.name}? This will remove the member from the admin list and public website.`
    );

    if (!confirmed) return;

    setDeletingSlug(member.slug);
    setError("");

    try {
      const response = await fetch(`/api/admin/team/${member.slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to delete team member.");
      }

      setMembers((current) =>
        current.filter((item) => item.slug !== member.slug)
      );
    } catch (err) {
      setError(err.message || "Unable to delete team member.");
    } finally {
      setDeletingSlug("");
    }
  }

  return (
    <>
      {error ? <div className="team-delete-error">{error}</div> : null}

      <div className="admin-list">
        {members.map((member) => (
          <div className="admin-list-row" key={member.slug}>
            <div>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </div>

            <div className="admin-row-actions team-row-actions">
              <span className="admin-pill">{member.status}</span>

              <Link
                className="admin-text-button"
                href={`/admin/team/${member.slug}`}
              >
                Edit →
              </Link>

              <button
                type="button"
                className="team-delete-button"
                disabled={deletingSlug === member.slug}
                onClick={() => deleteMember(member)}
              >
                {deletingSlug === member.slug ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .team-row-actions {
          flex-wrap: wrap;
        }

        .team-delete-button {
          border: 0;
          background: transparent;
          color: #a12f26;
          padding: 0;
          font: inherit;
          text-decoration: underline;
          cursor: pointer;
        }

        .team-delete-button:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        .team-delete-error {
          margin-bottom: 14px;
          padding: 12px 14px;
          border: 1px solid #e2b6ae;
          border-radius: 10px;
          background: #fff1ee;
          color: #912d24;
          font-size: 13px;
        }

        @media (max-width: 700px) {
          .team-row-actions {
            gap: 14px;
          }
        }
      `}</style>
    </>
  );
}
