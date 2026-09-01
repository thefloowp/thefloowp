"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Unable to sign in.");
        return;
      }

      router.replace("/admin/tasks");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="admin-login-eyebrow">Floowp CMS</p>
        <h1>Admin Login</h1>
        <p className="admin-login-copy">
          Sign in to manage the website and task handover board.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="admin-login-error">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>

      <style jsx>{`
        .admin-login-page {
          min-height: calc(100vh - 68px);
          display: grid;
          place-items: center;
          padding: 40px 20px;
          background: #f3f2ef;
        }
        .admin-login-card {
          width: min(100%, 430px);
          background: #fff;
          border: 1px solid #ddd9d2;
          border-radius: 18px;
          padding: 34px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.06);
        }
        .admin-login-eyebrow {
          margin: 0 0 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6d6a65;
        }
        h1 { margin: 0; font-size: 42px; letter-spacing: -0.045em; }
        .admin-login-copy { margin: 12px 0 28px; color: #6b6761; line-height: 1.5; }
        form, label { display: flex; flex-direction: column; }
        form { gap: 18px; }
        label { gap: 8px; font-size: 13px; font-weight: 700; }
        input {
          min-height: 46px;
          border: 1px solid #d8d4cd;
          border-radius: 10px;
          padding: 0 13px;
          font: inherit;
          outline: none;
          background: #fff;
        }
        input:focus { border-color: #111; }
        button {
          min-height: 46px;
          border: 0;
          border-radius: 999px;
          background: #080808;
          color: #fff;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }
        button:disabled { opacity: 0.55; cursor: wait; }
        .admin-login-error { margin: -4px 0 0; color: #a92d2d; font-size: 13px; }
      `}</style>
    </main>
  );
}
