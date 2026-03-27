"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auditsUsed, setAuditsUsed] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/audit?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.count !== undefined) {
            setAuditsUsed(data.count);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  const validateInstagramUrl = (input: string): boolean => {
    const pattern = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    return pattern.test(input.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateInstagramUrl(url)) {
      setError(
        "Voer een geldige Instagram URL in (bv. https://www.instagram.com/gebruikersnaam)"
      );
      return;
    }

    if (auditsUsed !== null && auditsUsed >= 1) {
      setError(
        "Je hebt je gratis audit al gebruikt. Neem contact op met Hans voor meer audits."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagramUrl: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Er ging iets mis. Probeer het opnieuw.");
        setLoading(false);
        return;
      }

      router.push(`/audit/results?id=${data.id}`);
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#E8724A", borderTopColor: "transparent" }}
          ></div>
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#1a2b3f" }}>
            Start je Instagram Audit
          </h1>
          <p className="mt-2 text-gray-500">
            Voer de Instagram URL in die je wilt analyseren.
          </p>
          {auditsUsed !== null && (
            <p className="mt-1 text-sm" style={{ color: auditsUsed >= 1 ? "#ef4444" : "#22c55e" }}>
              {auditsUsed >= 1
                ? "Je gratis audit is gebruikt"
                : "Je hebt nog 1 gratis audit"}
            </p>
          )}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="instagram-url"
                className="block text-sm font-medium mb-2"
                style={{ color: "#1a2b3f" }}
              >
                Instagram Profiel URL
              </label>
              <input
                id="instagram-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/gebruikersnaam"
                required
                className="text-base"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Plak de volledige URL van het Instagram profiel
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || (auditsUsed !== null && auditsUsed >= 1)}
              className="btn-primary w-full justify-center text-base py-3"
              style={{
                opacity:
                  loading || (auditsUsed !== null && auditsUsed >= 1)
                    ? 0.6
                    : 1,
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></span>
                  Bezig met analyseren...
                </span>
              ) : (
                "Analyseer dit profiel"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "rgba(74, 127, 232, 0.05)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#4A7FE8" }}>
              Wat wordt er geanalyseerd?
            </h3>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center gap-2">
                <span style={{ color: "#22c55e" }}>&#10003;</span> Profielgegevens & bio
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "#22c55e" }}>&#10003;</span> Volgers/volgend ratio
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "#22c55e" }}>&#10003;</span> Recente posts & content
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "#22c55e" }}>&#10003;</span> Highlights & categorie
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
