import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InstagramProfile } from "@/lib/instagram-scraper";
import { generateAuditAnalysis } from "@/lib/audit-generator";
import { generateReportHtml } from "@/lib/report-template";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const body = await request.json();
    const { instagramUrl, manualData } = body;

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

    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "Je hebt geen audit-tegoed meer. Koop extra audits in de shop." },
        { status: 403 }
      );
    }

    // Deduct 1 credit
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    });

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

    // Trigger async processing with manual data
    processAudit(audit.id, instagramUrl.trim(), handle, manualData).catch(
      console.error
    );

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

    if (userId) {
      if (userId !== session.user.id) {
        return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
      }
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });
      return NextResponse.json({ credits: user?.credits ?? 0 });
    }

    if (id) {
      const audit = await prisma.audit.findUnique({ where: { id } });
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

interface ManualData {
  posts: number;
  followers: number;
  following: number;
  bio: string;
  category: string;
  highlights: string[];
  contentStyle: string;
  targetAudience: string;
  postFrequency: string;
  usesReels: string;
}

async function processAudit(
  auditId: string,
  instagramUrl: string,
  handle: string,
  manualData?: ManualData
) {
  try {
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: "PROCESSING" },
    });

    // Build profile from manual data (user input is the source of truth)
    const profileData: InstagramProfile = {
      handle,
      name: handle,
      bio: manualData?.bio || "",
      postsCount: manualData?.posts || 0,
      followers: manualData?.followers || 0,
      following: manualData?.following || 0,
      category: manualData?.category || "",
      highlights: manualData?.highlights || [],
      recentPosts: [],
      profileUrl: instagramUrl,
      isVerified: false,
      hasProfilePic: true,
      contentStyle: manualData?.contentStyle || "",
      targetAudience: manualData?.targetAudience || "",
      postFrequency: manualData?.postFrequency || "",
      usesReels: manualData?.usesReels || "",
    };

    // Try to extract name from Instagram page title
    try {
      const res = await fetch(instagramUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (res.ok) {
        let html = await res.text();
        html = html.replace(/&#064;/g, "@");
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleMatch && titleMatch[1].includes("@")) {
          const nameMatch = titleMatch[1].match(/^(.*?)\s*\(@/);
          if (nameMatch) profileData.name = nameMatch[1].trim();
        }
        // Try to get bio from page if not provided manually
        if (!profileData.bio) {
          const bioMatch = html.match(/"biography":\s*"((?:[^"\\]|\\.)*)"/);
          if (bioMatch) {
            profileData.bio = bioMatch[1]
              .replace(/\\n/g, "\n")
              .replace(/\\"/g, '"');
          }
        }
      }
    } catch {
      // Scraping is optional, manual data is primary
    }

    console.log("Processing audit with profile:", {
      handle: profileData.handle,
      name: profileData.name,
      posts: profileData.postsCount,
      followers: profileData.followers,
      following: profileData.following,
      contentStyle: profileData.contentStyle,
      targetAudience: profileData.targetAudience,
      postFrequency: profileData.postFrequency,
      usesReels: profileData.usesReels,
    });

    // Generate AI analysis
    const analysis = await generateAuditAnalysis(profileData);

    // Generate HTML report
    const reportHtml = generateReportHtml(analysis, profileData);

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
