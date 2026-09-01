import Link from "next/link";

export default function TeamCard({ member }) {
  return (
    <Link className="team-card" href={`/team/${member.slug}`}>
      <div className="team-photo-placeholder">
        {member.photo_url ? (
          <img
            className="team-photo-image"
            src={member.photo_url}
            alt={member.name}
          />
        ) : (
          <span>{member.initials}</span>
        )}
      </div>

      <div className="team-meta">
        <div>
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
        <span className="arrow">↗</span>
      </div>

      <style jsx>{`
        .team-photo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </Link>
  );
}
