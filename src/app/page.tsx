import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg text-white">
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "5rem 1.5rem 4.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "1.25rem",
            }}
          >
            AI-Powered Instagram Analyse
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            Ontdek hoe goed jouw Instagram{" "}
            <span style={{ color: "#E8724A" }}>echt</span> presteert
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.75)",
              marginBottom: "2.5rem",
              maxWidth: "540px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Krijg een professionele audit met concrete tips om je bereik,
            engagement en volgers te laten groeien.
          </p>
          <Link href="/login" className="btn-primary" style={{ fontSize: "1.0625rem", padding: "0.875rem 2.5rem" }}>
            Start je gratis audit &rarr;
          </Link>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Geen creditcard nodig &bull; Resultaat binnen 2 minuten
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#1a2b3f",
                marginBottom: "0.75rem",
              }}
            >
              Wat je krijgt
            </h2>
            <p style={{ color: "#6b7280", maxWidth: "420px", margin: "0 auto", fontSize: "0.9375rem" }}>
              Een complete doorlichting van je profiel, aangedreven door AI.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <FeatureCard
              emoji="&#128100;"
              title="Profiel Analyse"
              text="Bio, profielfoto, highlights en algemene indruk worden grondig beoordeeld."
              color="#E8724A"
            />
            <FeatureCard
              emoji="&#128248;"
              title="Content Review"
              text="Je recente posts geanalyseerd op kwaliteit, consistentie en engagement."
              color="#4A7FE8"
            />
            <FeatureCard
              emoji="&#9989;"
              title="Concrete Tips"
              text="Een gepersonaliseerd actieplan met stappen die je meteen kunt toepassen."
              color="#E8724A"
            />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1.5rem" }}>
        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />
      </div>

      {/* How It Works */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#1a2b3f",
                marginBottom: "0.75rem",
              }}
            >
              Hoe werkt het?
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.9375rem" }}>
              In drie simpele stappen.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <StepRow number="1" color="#E8724A" title="Maak een account" text="Log in met Google of maak een account aan met je e-mail. Kost 30 seconden." />
            <StepRow number="2" color="#4A7FE8" title="Vul je profielgegevens in" text="Voer je Instagram URL in samen met je aantal posts, volgers en volgend. Hoe meer info, hoe beter de analyse." />
            <StepRow number="3" color="#E8724A" title="Ontvang je rapport" text="Binnen 2 minuten krijg je een uitgebreid rapport met score, sterke punten, verbeterpunten en een concreet actieplan." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "2rem 1.5rem 5rem" }}>
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #1a2b3f 0%, #2d4a6f 100%)",
            borderRadius: "1rem",
            padding: "3.5rem 2.5rem",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "0.75rem",
            }}
          >
            Klaar om te beginnen?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: "2rem",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
            }}
          >
            Je eerste audit is helemaal gratis. Ontdek vandaag nog hoe je jouw
            Instagram naar het volgende niveau tilt.
          </p>
          <Link href="/login" className="btn-primary" style={{ fontSize: "1.0625rem", padding: "0.875rem 2.5rem" }}>
            Start je gratis audit &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  text,
  color,
}: {
  emoji: string;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "0.75rem",
        padding: "2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        border: "1px solid #f0f0f0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem",
          backgroundColor: `${color}12`,
          fontSize: "1.25rem",
        }}
        dangerouslySetInnerHTML={{ __html: emoji }}
      />
      <h3
        style={{
          fontSize: "1.0625rem",
          fontWeight: 600,
          color: "#1a2b3f",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <p style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  );
}

function StepRow({
  number,
  color,
  title,
  text,
}: {
  number: string;
  color: string;
  title: string;
  text: string;
}) {
  return (
    <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          minWidth: "2.5rem",
          borderRadius: "50%",
          backgroundColor: color,
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0.125rem",
        }}
      >
        {number}
      </div>
      <div>
        <h3
          style={{
            fontSize: "1.0625rem",
            fontWeight: 600,
            color: "#1a2b3f",
            marginBottom: "0.25rem",
          }}
        >
          {title}
        </h3>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
          {text}
        </p>
      </div>
    </div>
  );
}
