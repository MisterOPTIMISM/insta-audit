import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ontdek hoe goed jouw Instagram{" "}
            <span style={{ color: "#E8724A" }}>echt</span> presteert
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Krijg een AI-gedreven audit van je Instagram profiel met concrete
            tips om je bereik, engagement en volgers te laten groeien.
          </p>
          <Link
            href="/login"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            Start je gratis audit
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <p className="mt-4 text-sm text-blue-200">
            Geen creditcard nodig &bull; Resultaat binnen 2 minuten
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-4"
            style={{ color: "#1a2b3f" }}
          >
            Wat je krijgt
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Een complete doorlichting van je Instagram profiel, aangedreven door
            kunstmatige intelligentie.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(232, 114, 74, 0.1)" }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="#E8724A"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#1a2b3f" }}>
                Profiel Analyse
              </h3>
              <p className="text-gray-500">
                Je bio, profielfoto, highlights en algemene indruk worden onder
                de loep genomen.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(74, 127, 232, 0.1)" }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="#4A7FE8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#1a2b3f" }}>
                Content Review
              </h3>
              <p className="text-gray-500">
                Je recente posts worden geanalyseerd op kwaliteit, consistentie
                en engagement-potentieel.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(232, 114, 74, 0.1)" }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="#E8724A"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#1a2b3f" }}>
                Concrete Tips
              </h3>
              <p className="text-gray-500">
                Ontvang een gepersonaliseerd actieplan met stappen die je
                meteen kan toepassen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: "#1a2b3f" }}
          >
            Hoe werkt het?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                style={{ backgroundColor: "#E8724A" }}
              >
                1
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a2b3f" }}>
                Log in
              </h3>
              <p className="text-gray-500">
                Maak een account aan met Google, Facebook of je e-mail.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                style={{ backgroundColor: "#4A7FE8" }}
              >
                2
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a2b3f" }}>
                Voer je Instagram URL in
              </h3>
              <p className="text-gray-500">
                Plak de link naar het Instagram profiel dat je wilt laten
                analyseren.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                style={{ backgroundColor: "#E8724A" }}
              >
                3
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a2b3f" }}>
                Ontvang je rapport
              </h3>
              <p className="text-gray-500">
                Binnen 2 minuten krijg je een uitgebreid rapport met score,
                tips en actieplan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "#1a2b3f" }}
          >
            Klaar om te beginnen?
          </h2>
          <p className="text-gray-500 mb-8">
            Je eerste audit is helemaal gratis. Ontdek vandaag nog hoe je jouw
            Instagram naar het volgende niveau tilt.
          </p>
          <Link
            href="/login"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            Start je gratis audit
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
