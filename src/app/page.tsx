import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-sm uppercase tracking-widest text-blue-200 mb-4">
            AI-Powered Instagram Analyse
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Ontdek hoe goed jouw
            <br />
            Instagram{" "}
            <span style={{ color: "#E8724A" }}>echt</span> presteert
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Krijg een professionele audit met concrete tips om je bereik,
            engagement en volgers te laten groeien.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="btn-primary text-lg px-10 py-4"
            >
              Start je gratis audit &rarr;
            </Link>
          </div>
          <p className="mt-5 text-sm text-blue-200/70">
            Geen creditcard nodig &bull; Resultaat binnen 2 minuten
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#1a2b3f" }}
            >
              Wat je krijgt
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Een complete doorlichting van je Instagram profiel, aangedreven
              door kunstmatige intelligentie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              }
              iconColor="#E8724A"
              title="Profiel Analyse"
              description="Bio, profielfoto, highlights en algemene indruk worden grondig beoordeeld."
            />
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              }
              iconColor="#4A7FE8"
              title="Content Review"
              description="Je recente posts worden geanalyseerd op kwaliteit, consistentie en engagement."
            />
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              }
              iconColor="#E8724A"
              title="Concrete Tips"
              description="Ontvang een gepersonaliseerd actieplan met stappen die je meteen kunt toepassen."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#1a2b3f" }}
            >
              Hoe werkt het?
            </h2>
            <p className="text-gray-500">In drie simpele stappen.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              color="#E8724A"
              title="Maak een account"
              description="Log in met Google of maak snel een account aan met je e-mailadres."
            />
            <StepCard
              number="2"
              color="#4A7FE8"
              title="Vul je gegevens in"
              description="Voer je Instagram URL en profielgegevens in. Hoe meer data, hoe beter de analyse."
            />
            <StepCard
              number="3"
              color="#E8724A"
              title="Ontvang je rapport"
              description="Binnen 2 minuten krijg je een uitgebreid rapport met score, tips en actieplan."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div
          className="max-w-3xl mx-auto text-center rounded-2xl py-16 px-8"
          style={{
            background: "linear-gradient(135deg, #1a2b3f 0%, #2d4a6f 100%)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-blue-200 mb-8 max-w-md mx-auto">
            Je eerste audit is helemaal gratis. Ontdek vandaag nog hoe je jouw
            Instagram naar het volgende niveau tilt.
          </p>
          <Link
            href="/login"
            className="btn-primary text-lg px-10 py-4"
          >
            Start je gratis audit &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  iconColor,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card text-center p-8">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: `${iconColor}10` }}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke={iconColor}
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "#1a2b3f" }}
      >
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  color,
  title,
  description,
}: {
  number: string;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "#1a2b3f" }}
      >
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
