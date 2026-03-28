import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="#22c55e"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4" style={{ color: "#1a2b3f" }}>
          Bedankt!
        </h1>
        <p className="text-lg text-gray-500 mb-10">
          Je Instagram audit is afgerond. We hopen dat de inzichten je helpen
          om je profiel naar het volgende niveau te tillen!
        </p>

        {/* Extra Audits CTA */}
        <div
          className="card mb-6"
          style={{ border: "2px solid #E8724A", padding: "2rem" }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#E8724A",
              marginBottom: "0.25rem",
            }}
          >
            &euro;9,90
          </div>
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "#1a2b3f" }}
          >
            Nog een profiel analyseren?
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Koop extra audits voor jezelf of voor klanten. Elk rapport bevat
            een volledige analyse met score, tips en actieplan.
          </p>
          <a
            href="https://www.hansdemeyer.be/product/instagram-audit-instaaudit-by-hans-demeyer/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Koop een extra audit
          </a>
        </div>

        {/* Personal Session CTA */}
        <div className="card mb-8" style={{ padding: "1.5rem" }}>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "#1a2b3f" }}
          >
            Liever persoonlijke begeleiding?
          </h2>
          <p className="text-gray-500 mb-3 text-sm">
            Boek een 1-op-1 sessie met Hans Demeyer en krijg persoonlijk
            advies voor jouw Instagram strategie.
          </p>
          <a
            href="https://www.hansdemeyer.be"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            Boek een sessie met Hans
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            style={{ color: "#6b7280" }}
          >
            Terug naar home
          </Link>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <a
            href="https://www.instagram.com/hans.demeyer/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4A7FE8" }}
          >
            Volg Hans op Instagram
          </a>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <a
            href="https://www.linkedin.com/in/hansdemeyer"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4A7FE8" }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
