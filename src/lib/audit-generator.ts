import Anthropic from "@anthropic-ai/sdk";
import { InstagramProfile } from "./instagram-scraper";

export interface AuditAnalysis {
  overallScore: number;
  goodPoints: string[];
  improvementPoints: string[];
  actionPlan: { priority: string; action: string; impact: string }[];
  ffRatio: number;
  followerPerPost: number;
  summary: string;
}

export async function generateAuditAnalysis(
  profile: InstagramProfile
): Promise<AuditAnalysis> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const ffRatio =
    profile.following > 0
      ? Math.round((profile.followers / profile.following) * 100) / 100
      : 0;
  const followerPerPost =
    profile.postsCount > 0
      ? Math.round((profile.followers / profile.postsCount) * 100) / 100
      : 0;

  const prompt = `Je bent een Instagram marketing expert. Analyseer het volgende Instagram profiel en geef een gedetailleerde audit.

Profielgegevens:
- Handle: @${profile.handle}
- Naam: ${profile.name}
- Bio: ${profile.bio || "(geen bio)"}
- Aantal posts: ${profile.postsCount}
- Volgers: ${profile.followers}
- Volgend: ${profile.following}
- Volger/volgend ratio: ${ffRatio}
- Volgers per post: ${followerPerPost}
- Categorie: ${profile.category || "(niet ingesteld)"}
- Aantal highlights: ${profile.highlights.length}
- Highlights: ${profile.highlights.join(", ") || "(geen)"}
- Geverifieerd: ${profile.isVerified ? "Ja" : "Nee"}
- Profielfoto: ${profile.hasProfilePic ? "Ja" : "Niet gedetecteerd"}
- Recente posts (beschrijvingen): ${profile.recentPosts.slice(0, 6).join(" | ") || "(niet beschikbaar)"}

Geef je analyse als JSON met exact dit formaat:
{
  "overallScore": <nummer van 1 tot 10>,
  "summary": "<korte samenvatting in het Nederlands, max 2 zinnen>",
  "goodPoints": ["<punt 1>", "<punt 2>", "<punt 3>", ...],
  "improvementPoints": ["<punt 1>", "<punt 2>", "<punt 3>", ...],
  "actionPlan": [
    {"priority": "Hoog", "action": "<actie>", "impact": "<verwacht resultaat>"},
    {"priority": "Middel", "action": "<actie>", "impact": "<verwacht resultaat>"},
    ...
  ]
}

Richtlijnen:
- Score streng maar eerlijk (5 = gemiddeld, 7 = goed, 9+ = uitstekend)
- Minimaal 3 goede punten en 3 verbeterpunten
- Minimaal 5 actiepunten in het actieplan
- Alles in het Nederlands
- Wees specifiek en actionable
- Houd rekening met de volger/volgend ratio (>1 is goed, >3 is uitstekend)
- Beoordeel of de bio compleet is (CTA, keywords, emoji's)
- Kijk of highlights goed zijn ingericht

Antwoord ALLEEN met valid JSON, geen extra tekst.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    // Try to parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      overallScore: Math.min(10, Math.max(1, analysis.overallScore || 5)),
      goodPoints: analysis.goodPoints || [],
      improvementPoints: analysis.improvementPoints || [],
      actionPlan: analysis.actionPlan || [],
      ffRatio,
      followerPerPost,
      summary: analysis.summary || "",
    };
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);
    // Return a fallback analysis
    return {
      overallScore: 5,
      goodPoints: [
        "Profiel is actief op Instagram",
        `${profile.postsCount} posts gepubliceerd`,
        "Profiel is publiek toegankelijk",
      ],
      improvementPoints: [
        "Analyse kon niet volledig worden uitgevoerd",
        "Controleer of je bio volledig is ingevuld",
        "Zorg voor consistent posten",
      ],
      actionPlan: [
        {
          priority: "Hoog",
          action: "Optimaliseer je bio met een duidelijke CTA",
          impact: "Meer profielbezoekers converteren naar volgers",
        },
        {
          priority: "Hoog",
          action: "Post minimaal 3x per week",
          impact: "Betere zichtbaarheid in het algoritme",
        },
        {
          priority: "Middel",
          action: "Maak highlight covers aan",
          impact: "Professionelere uitstraling",
        },
      ],
      ffRatio,
      followerPerPost,
      summary:
        "We konden een basisanalyse maken van je profiel. Voor een vollediger beeld, probeer het later opnieuw.",
    };
  }
}
