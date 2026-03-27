import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scrapeInstagramProfile } from "@/lib/instagram-scraper";
import { generateAuditAnalysis } from "@/lib/audit-generator";
import { generateReportHtml } from "@/lib/report-template";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const body = await request.json();
    const { instagramUrl } = body;

    if (!instagramUrl) {
      return NextResponse.json(
        { error: "Instagram URL is verplicht." },
        { status: 400 }
      );
    }

    // Validate URL
    const urlPattern =
      /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    if (!urlPattern.test(instagramUrl.trim())) {
      return NextResponse.json(
        { error: "Ongeldige Instagram URL." },
        { status: 400 }
      );
    }

    // Check free audit quota (1 per user)
    const existingAudits = await prisma.audit.count({
      where: { userId: session.user.id },
    });

    if (existingAudits >= 1) {
      return NextResponse.json(
        { error: "Je hebt je gratis audit al gebruikt." },
        { status: 403 }
      );
    }

    // Extract handle from URL
    const handle = instagramUrl
      .trim()
      .replace(/\/$/, "")
      .split("/")
      .pop() as string;

    // Create audit record
    const audit = await prisma.audit.create({
      data: {
        userId: session.user.id,
        instagramHandle: handle,
        instagramUrl: instagramUrl.trim(),
        status: "PENDING",
      },
    });

    // Trigger async processing (don't await)
    processAudit(audit.id, instagramUrl.trim(), handle).catch(console.error);

    return NextResponse.json({ id: audit.id }, { status: 201 });
  } catch (error) {
    console.error("Audit POST error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    // If userId param, return count for quota check
    if (userId) {
      if (userId !== session.user.id) {
        return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
      }

      const count = await prisma.audit.count({
        where: { userId: session.user.id },
      });

      return NextResponse.json({ count });
    }

    // If id param, return specific audit
    if (id) {
      const audit = await prisma.audit.findUnique({
        where: { id },
      });

      if (!audit) {
        return NextResponse.json(
          { error: "Audit niet gevonden." },
          { status: 404 }
        );
      }

      if (audit.userId !== session.user.id) {
        return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
      }

      return NextResponse.json(audit);
    }

    return NextResponse.json(
      { error: "ID of userId parameter is verplicht." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Audit GET error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis." },
      { status: 500 }
    );
  }
}

async function processAudit(
  auditId: string,
  instagramUrl: string,
  handle: string
) {
  try {
    // Update status to PROCESSING
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: "PROCESSING" },
    });

    // Scrape profile
    const profileData = await scrapeInstagramProfile(instagramUrl);

    // Generate AI analysis
    const analysis = await generateAuditAnalysis(profileData);

    // Generate HTML report
    const reportHtml = generateReportHtml(analysis, profileData);

    // Update audit with results
    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "COMPLETED",
        reportHtml,
      },
    });
  } catch (error) {
    console.error("Audit processing error:", error);
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: "FAILED" },
    });
  }
}
