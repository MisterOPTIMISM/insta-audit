"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

interface AuditData {
  id: string;
  instagramHandle: string;
  instagramUrl: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  reportHtml: string | null;
  createdAt: string;
}

function ResultsContent() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auditId = searchParams.get("id");

  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (!auditId) {
      setError("Geen audit ID gevonden.");
      setLoading(false);
      return;
    }

    const fetchAudit = async () => {
      try {
        const res = await fetch(`/api/audit?id=${auditId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Audit niet gevonden.");
          setLoading(false);
          return;
        }

        setAudit(data);
        setLoading(false);

        // Poll if still processing
        if (data.status === "PENDING" || data.status === "PROCESSING") {
          setTimeout(fetchAudit, 3000);
        }
      } catch {
        setError("Er ging iets mis bij het ophalen van de resultaten.");
        setLoading(false);
      }
    };

    fetchAudit();
  }, [auditId]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#E8724A", borderTopColor: "transparent" }}
          ></div>
          <p className="text-gray-500 text-lg">Resultaten laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-4xl mb-4">&#9888;</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a2b3f" }}>
            Oeps!
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link href="/audit" className="btn-primary">
            Probeer opnieuw
          </Link>
        </div>
      </div>
    );
  }

  if (!audit) return null;

  if (audit.status === "PENDING" || audit.status === "PROCESSING") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            style={{ borderColor: "#4A7FE8", borderTopColor: "transparent" }}
          ></div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a2b3f" }}>
            Je audit wordt gegenereerd...
          </h2>
          <p className="text-gray-500 mb-2">
            We analyseren het profiel{" "}
            <strong>@{audit.instagramHandle}</strong>
          </p>
          <p className="text-sm text-gray-400">
            Dit kan 1-2 minuten duren. De pagina wordt automatisch bijgewerkt.
          </p>
        </div>
      </div>
    );
  }

  if (audit.status === "FAILED") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="text-4xl mb-4">&#10060;</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1a2b3f" }}>
            Analyse mislukt
          </h2>
          <p className="text-gray-500 mb-4">
            We konden het profiel niet analyseren. Mogelijk is het profiel
            privaat of bestaat het niet.
          </p>
          <Link href="/audit" className="btn-primary">
            Probeer een ander profiel
          </Link>
        </div>
      </div>
    );
  }

  // COMPLETED
  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1a2b3f" }}>
              Audit Rapport
            </h1>
            <p className="text-gray-500">
              @{audit.instagramHandle} &bull;{" "}
              {new Date(audit.createdAt).toLocaleDateString("nl-BE")}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-sm px-4 py-2"
            >
              Print / PDF
            </button>
            <Link href="/thank-you" className="btn-primary text-sm px-4 py-2">
              Klaar? Ga verder
            </Link>
          </div>
        </div>

        {audit.reportHtml && (
          <div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            dangerouslySetInnerHTML={{ __html: audit.reportHtml }}
          />
        )}

        {/* Upsell Section */}
        <div
          className="mt-10 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a2b3f 0%, #2d4a6f 100%)",
          }}
        >
          <div
            style={{
              padding: "2.5rem 2rem",
              textAlign: "center",
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "0.75rem",
              }}
            >
              Meer audits nodig?
            </p>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "0.75rem",
              }}
            >
              Koop extra Instagram Audits
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Wil je nog een profiel analyseren of een follow-up audit doen?
              Voor slechts &euro;9,90 per audit krijg je opnieuw een volledig
              rapport.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://www.hansdemeyer.be/product/instagram-audit-instaaudit-by-hans-demeyer/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}
              >
                Koop een audit &mdash; &euro;9,90
              </a>
              <a
                href="https://www.hansdemeyer.be"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.75rem 1.5rem",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "0.5rem",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                }}
              >
                Boek een sessie met Hans
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "#E8724A", borderTopColor: "transparent" }}
            ></div>
            <p className="text-gray-500 text-lg">Laden...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
