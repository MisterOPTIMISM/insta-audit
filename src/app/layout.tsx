import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "InstaAudit by Hans Demeyer | Instagram Profiel Audit",
  description:
    "Ontdek hoe goed jouw Instagram echt presteert. Krijg een AI-gedreven audit met concrete tips om je profiel te verbeteren.",
  keywords: "Instagram audit, social media analyse, Instagram tips, Hans Demeyer",
  authors: [{ name: "Hans Demeyer", url: "https://www.hansdemeyer.be" }],
  openGraph: {
    title: "InstaAudit by Hans Demeyer",
    description: "Ontdek hoe goed jouw Instagram echt presteert.",
    type: "website",
    siteName: "InstaAudit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
