"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  credits: number;
  createdAt: string;
  _count: { audits: number };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) {
        setError("Geen toegang tot admin panel.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
    } catch {
      setError("Fout bij ophalen van gebruikers.");
      setLoading(false);
    }
  };

  const updateCredits = async (userId: string, newCredits: number) => {
    setUpdating(userId);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, credits: newCredits }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, credits: newCredits } : u
          )
        );
      }
    } catch {
      // ignore
    }
    setUpdating(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1a2b3f" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          {users.length} gebruiker{users.length !== 1 ? "s" : ""} geregistreerd
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard label="Totaal gebruikers" value={users.length} color="#4A7FE8" />
        <StatCard
          label="Totaal audits"
          value={users.reduce((sum, u) => sum + u._count.audits, 0)}
          color="#E8724A"
        />
        <StatCard
          label="Openstaand tegoed"
          value={users.reduce((sum, u) => sum + u.credits, 0)}
          color="#22c55e"
        />
      </div>

      {/* Users Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "#1a2b3f", color: "#fff" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Gebruiker</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Email</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Audits</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Credits</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Geregistreerd</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Acties</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>
                  {user.name || "—"}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>
                  {user.email || "—"}
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                  {user._count.audits}
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "1rem",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      background: user.credits > 0 ? "#dcfce7" : "#fee2e2",
                      color: user.credits > 0 ? "#166534" : "#991b1b",
                    }}
                  >
                    {user.credits}
                  </span>
                </td>
                <td
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "0.8125rem",
                  }}
                >
                  {new Date(user.createdAt).toLocaleDateString("nl-BE")}
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: "0.375rem", justifyContent: "center" }}>
                    <button
                      onClick={() => updateCredits(user.id, user.credits + 3)}
                      disabled={updating === user.id}
                      style={{
                        padding: "0.25rem 0.625rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "#E8724A",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        opacity: updating === user.id ? 0.5 : 1,
                      }}
                    >
                      +3
                    </button>
                    <button
                      onClick={() => updateCredits(user.id, user.credits + 1)}
                      disabled={updating === user.id}
                      style={{
                        padding: "0.25rem 0.625rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "#4A7FE8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        opacity: updating === user.id ? 0.5 : 1,
                      }}
                    >
                      +1
                    </button>
                    {user.credits > 0 && (
                      <button
                        onClick={() => updateCredits(user.id, 0)}
                        disabled={updating === user.id}
                        style={{
                          padding: "0.25rem 0.625rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: "#f3f4f6",
                          color: "#6b7280",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          opacity: updating === user.id ? 0.5 : 1,
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: "1.75rem", fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}
