"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState("");
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [highlights, setHighlights] = useState("");
  const [contentStyle, setContentStyle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [postFrequency, setPostFrequency] = useState("");
  const [usesReels, setUsesReels] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<number | null>(null);

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
          if (data.credits !== undefined) {
            setCredits(data.credits);
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

    if (credits !== null && credits <= 0) {
      setError(
        "Je hebt geen audit-tegoed meer. Koop een bundel van 3 audits voor €9,95 in de shop."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagramUrl: url.trim(),
          manualData: {
            posts: parseInt(posts) || 0,
            followers: parseInt(followers) || 0,
            following: parseInt(following) || 0,
            bio: bio.trim(),
            category: category.trim(),
            highlights: highlights
              .split(",")
              .map((h) => h.trim())
              .filter(Boolean),
            contentStyle: contentStyle.trim(),
            targetAudience: targetAudience.trim(),
            postFrequency,
            usesReels,
          },
        }),
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
            Vul de gegevens van het Instagram profiel in.
          </p>
          {credits !== null && credits <= 0 ? (
            <div
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(232, 114, 74, 0.08)",
                border: "1px solid rgba(232, 114, 74, 0.2)",
                maxWidth: "400px",
                margin: "1rem auto 0",
              }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: "#E8724A" }}>
                Geen audit-tegoed meer
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Koop een bundel van 3 audits en analyseer meer profielen.
              </p>
              <a
                href="https://www.hansdemeyer.be/product/instagram-audit-instaaudit-by-hans-demeyer/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
                style={{ padding: "0.5rem 1.25rem", fontSize: "0.8125rem" }}
              >
                3 audits &mdash; &euro;9,95
              </a>
            </div>
          ) : credits !== null ? (
            <p className="mt-1 text-sm" style={{ color: "#22c55e" }}>
              Je hebt nog {credits} audit{credits !== 1 ? "s" : ""} tegoed
            </p>
          ) : null}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Instagram URL */}
            <div>
              <label
                htmlFor="instagram-url"
                className="block text-sm font-medium mb-1"
                style={{ color: "#1a2b3f" }}
              >
                Instagram Profiel URL *
              </label>
              <input
                id="instagram-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/gebruikersnaam"
                required
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="posts"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2b3f" }}
                >
                  Posts *
                </label>
                <input
                  id="posts"
                  type="number"
                  value={posts}
                  onChange={(e) => setPosts(e.target.value)}
                  placeholder="bijv. 85"
                  required
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="followers"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2b3f" }}
                >
                  Volgers *
                </label>
                <input
                  id="followers"
                  type="number"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  placeholder="bijv. 1200"
                  required
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="following"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2b3f" }}
                >
                  Volgend *
                </label>
                <input
                  id="following"
                  type="number"
                  value={following}
                  onChange={(e) => setFollowing(e.target.value)}
                  placeholder="bijv. 350"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium mb-1"
                style={{ color: "#1a2b3f" }}
              >
                Bio tekst
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kopieer hier je Instagram bio..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm resize-none"
              />
            </div>

            {/* Category & Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2b3f" }}
                >
                  Categorie
                </label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="bijv. Kinesitherapie"
                />
              </div>
              <div>
                <label
                  htmlFor="highlights"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2b3f" }}
                >
                  Highlights
                </label>
                <input
                  id="highlights"
                  type="text"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  placeholder="Team, Reviews, Tips"
                />
                <p className="text-xs text-gray-400 mt-0.5">
                  Gescheiden door komma&apos;s
                </p>
              </div>
            </div>

            {/* Content Style */}
            <div>
              <label
                htmlFor="content-style"
                className="block text-sm font-medium mb-1"
                style={{ color: "#1a2b3f" }}
              >
                Beschrijf je content stijl
              </label>
              <textarea
                id="content-style"
                value={contentStyle}
                onChange={(e) => setContentStyle(e.target.value)}
                placeholder="bijv. Mix van productfoto's, reels, behind-the-scenes"
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm resize-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label
                htmlFor="target-audience"
                className="block text-sm font-medium mb-1"
                style={{ color: "#1a2b3f" }}
              >
                Wat is je doelgroep?
              </label>
              <input
                id="target-audience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="bijv. Lokale klanten in Berlare"
              />
            </div>

            {/* Post Frequency & Reels */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="post-frequency"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2b3f" }}
                >
                  Hoe vaak post je?
                </label>
                <select
                  id="post-frequency"
                  value={postFrequency}
                  onChange={(e) => setPostFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm bg-white"
                >
                  <option value="">-- Kies --</option>
                  <option value="Dagelijks">Dagelijks</option>
                  <option value="3-5x per week">3-5x per week</option>
                  <option value="1-2x per week">1-2x per week</option>
                  <option value="Minder dan 1x per week">Minder dan 1x per week</option>
                  <option value="Weet ik niet">Weet ik niet</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="uses-reels"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#1a2b3f" }}
                >
                  Gebruik je Reels?
                </label>
                <select
                  id="uses-reels"
                  value={usesReels}
                  onChange={(e) => setUsesReels(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm bg-white"
                >
                  <option value="">-- Kies --</option>
                  <option value="Ja, regelmatig">Ja, regelmatig</option>
                  <option value="Soms">Soms</option>
                  <option value="Nee">Nee</option>
                  <option value="Weet ik niet">Weet ik niet</option>
                </select>
              </div>
            </div>

            <div
              className="p-3 rounded-lg text-sm text-gray-500"
              style={{ backgroundColor: "rgba(74, 127, 232, 0.05)" }}
            >
              <strong style={{ color: "#4A7FE8" }}>Tip:</strong> Je vindt deze
              gegevens bovenaan je Instagram profiel. Hoe meer je invult, hoe
              beter de analyse!
            </div>

            <button
              type="submit"
              disabled={loading || (credits !== null && credits <= 0)}
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
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Bezig met analyseren...
                </span>
              ) : (
                "Analyseer dit profiel \u2192"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
