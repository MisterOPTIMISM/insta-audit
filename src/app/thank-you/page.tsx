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
        <p className="text-lg text-gray-500 mb-8">
          Je Instagram audit is afgerond. We hopen dat de inzichten je helpen om
          je profiel naar het volgende niveau te tillen!
        </p>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-3" style={{ color: "#1a2b3f" }}>
            Wil je nog meer resultaat?
          </h2>
          <p className="text-gray-500 mb-4">
            Boek een 1-op-1 sessie met Hans Demeyer en krijg persoonlijk
            advies voor jouw Instagram strategie.
          </p>
          <a
            href="https://www.hansdemeyer.be"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Boek een sessie met Hans
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/audit" className="btn-secondary">
            Nog een audit starten
          </Link>
          <Link
            href="/"
            className="text-sm font-medium"
            style={{ color: "#6b7280" }}
          >
            Terug naar home
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <a
            href="https://www.instagram.com/hans.demeyer/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium"
            style={{ color: "#4A7FE8" }}
          >
            Volg Hans op Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/hansdemeyer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium"
            style={{ color: "#4A7FE8" }}
          >
            Connect op LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
