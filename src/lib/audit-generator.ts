import Anthropic from "@anthropic-ai/sdk";
import { InstagramProfile } from "./instagram-scraper";

export interface GoodPoint {
  title: string;
  detail: string;
}

export interface ContentPillar {
  name: string;
  percentage: number;
  description: string;
}

export interface Improvement {
  title: string;
  observations: string[];
  advice: string;
  suggestedBio?: string;
  suggestedHighlights?: string[];
  contentPillars?: ContentPillar[];
}

export interface ActionPlanItem {
  priority: string;
  action: string;
  impact: string;
  effort: string;
}

export interface AuditAnalysis {
  overallScore: number;
  summary: string;
  goodPoints: GoodPoint[];
  improvements: Improvement[];
  actionPlan: ActionPlanItem[];
  conclusion: string;
  ffRatio: number;
  followerPerPost: number;
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

  const prompt = `Je bent een ervaren Instagram marketing expert en social media strateeg. Je maakt professionele Instagram audits voor kleine ondernemers en lokale bedrijven in Vlaanderen. Analyseer het volgende Instagram profiel grondig en geef een gedetailleerd rapport.

Profielgegevens:
- Handle: @${profile.handle}
- Naam: ${profile.name}
- Bio: ${profile.bio || "(geen bio ingevuld)"}
- Aantal posts: ${profile.postsCount}
- Volgers: ${profile.followers}
- Volgend: ${profile.following}
- Volger/volgend ratio: ${ffRatio}
- Volgers per post: ${followerPerPost}
- Categorie: ${profile.category || "(niet ingesteld)"}
- Aantal highlights: ${profile.highlights.length}
- Highlight namen: ${profile.highlights.join(", ") || "(geen highlights)"}
- Geverifieerd: ${profile.isVerified ? "Ja" : "Nee"}
- Profielfoto: ${profile.hasProfilePic ? "Ja" : "Niet gedetecteerd"}
- Recente posts (beschrijvingen): ${profile.recentPosts.slice(0, 6).join(" | ") || "(niet beschikbaar)"}
- Content stijl: ${profile.contentStyle || "(niet opgegeven)"}
- Doelgroep: ${profile.targetAudience || "(niet opgegeven)"}
- Post frequentie: ${profile.postFrequency || "(niet opgegeven)"}
- Gebruikt Reels: ${profile.usesReels || "(niet opgegeven)"}

Geef je analyse als JSON met EXACT dit formaat (geen extra tekst, alleen valid JSON):
{
  "overallScore": <nummer van 1 tot 10>,
  "summary": "<samenvatting in 2 zinnen die de belangrijkste sterkte en het belangrijkste verbeterpunt benoemt>",
  "goodPoints": [
    {"title": "<korte titel, max 6 woorden>", "detail": "<uitgebreide uitleg van 2-3 zinnen waarom dit goed is en wat het effect is>"},
    {"title": "<korte titel>", "detail": "<uitgebreide uitleg>"},
    {"title": "<korte titel>", "detail": "<uitgebreide uitleg>"},
    {"title": "<korte titel>", "detail": "<uitgebreide uitleg>"}
  ],
  "improvements": [
    {
      "title": "1. <duidelijke titel die het probleem benoemt>",
      "observations": ["<specifieke observatie 1>", "<specifieke observatie 2>"],
      "advice": "<concreet advies van 2-4 zinnen over wat ze moeten doen>",
      "suggestedBio": "<als bio-gerelateerd: schrijf een complete verbeterde bio met emoji's, CTA, en keywords. Anders laat dit veld weg>",
      "suggestedHighlights": ["<als highlight-gerelateerd: lijst van voorgestelde highlight namen. Anders laat dit veld weg>"],
      "contentPillars": [{"name": "<pilaar naam>", "percentage": <percentage>, "description": "<korte beschrijving>"}, ...]
    }
  ],
  "actionPlan": [
    {"priority": "Hoog", "action": "<concrete actie>", "impact": "<verwacht resultaat>", "effort": "Laag"},
    {"priority": "Hoog", "action": "<concrete actie>", "impact": "<verwacht resultaat>", "effort": "Middel"},
    {"priority": "Middel", "action": "<concrete actie>", "impact": "<verwacht resultaat>", "effort": "Laag"}
  ],
  "conclusion": "<slotparagraaf van 3-4 zinnen die het profiel samenvat, de belangrijkste quick wins benoemt, en een positieve noot slaat>"
}

BELANGRIJK - Richtlijnen voor de analyse:

SCORE:
- Wees streng maar eerlijk (5 = gemiddeld, 7 = goed, 9+ = uitstekend)
- De meeste kleine bedrijven scoren tussen 4-7

GOEDE PUNTEN (4-6 stuks):
- Wees specifiek over WAT er goed gaat, niet generiek
- Verwijs naar concrete elementen (bijv. "De bio bevat een duidelijke CTA" of "Het gebruik van lokale hashtags")
- Als iets niet goed is, noem het niet als goed punt

VERBETERPUNTEN (4-6 stuks, genummerd):
- Elke verbetering moet een duidelijk genummerde titel hebben (bijv. "1. De bio verkoopt niet", "2. Content heeft geen focus")
- Geef bij elk punt specifieke observaties (wat je ziet) en concreet advies (wat ze moeten doen)
- Als de bio niet goed is: schrijf een COMPLETE verbeterde bio met emoji's, keywords, en CTA in het "suggestedBio" veld
- Als de highlights niet goed zijn: stel betere highlight namen voor in "suggestedHighlights"
- Als de content geen focus heeft: stel content pijlers voor met percentages in "contentPillars" (bijv. [{"name": "Educatief", "percentage": 40, "description": "Tips en tricks over je vakgebied"}, {"name": "Behind the scenes", "percentage": 25, "description": "Laat je werkproces zien"}, ...])
- Niet elk verbeterpunt heeft suggestedBio/suggestedHighlights/contentPillars nodig - gebruik ze alleen waar relevant

ACTIEPLAN (5-7 acties):
- Prioriteit: "Hoog" of "Middel" (max 3x Hoog)
- Effort/Moeite: "Laag", "Middel", of "Hoog"
- Acties moeten concreet en uitvoerbaar zijn (bijv. "Herschrijf je bio met een CTA naar je website" niet "Verbeter je bio")
- Sorteer op prioriteit (Hoog eerst)

CONCLUSIE:
- Persoonlijk en motiverend
- Benoem de 2 belangrijkste quick wins
- Eindig positief

Alles moet in het NEDERLANDS (Vlaams) zijn. Antwoord ALLEEN met valid JSON.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
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
      summary: analysis.summary || "",
      goodPoints: (analysis.goodPoints || []).map((p: GoodPoint | string) =>
        typeof p === "string" ? { title: p, detail: "" } : { title: p.title || "", detail: p.detail || "" }
      ),
      improvements: (analysis.improvements || []).map((imp: Improvement) => ({
        title: imp.title || "",
        observations: imp.observations || [],
        advice: imp.advice || "",
        suggestedBio: imp.suggestedBio || undefined,
        suggestedHighlights: imp.suggestedHighlights || undefined,
        contentPillars: imp.contentPillars || undefined,
      })),
      actionPlan: (analysis.actionPlan || []).map((item: ActionPlanItem) => ({
        priority: item.priority || "Middel",
        action: item.action || "",
        impact: item.impact || "",
        effort: item.effort || "Middel",
      })),
      conclusion: analysis.conclusion || "",
      ffRatio,
      followerPerPost,
    };
  } catch (parseError) {
    console.error("Failed to parse AI response:", parseError);
    console.error("Raw response:", responseText.substring(0, 500));
    // Return a fallback analysis
    return {
      overallScore: 5,
      summary:
        "We konden een basisanalyse maken van je profiel. Voor een vollediger beeld, probeer het later opnieuw.",
      goodPoints: [
        { title: "Actief op Instagram", detail: "Je hebt een profiel aangemaakt en bent actief bezig met content plaatsen." },
        { title: `${profile.postsCount} posts gepubliceerd`, detail: "Je hebt al een basis gelegd met je content." },
        { title: "Profiel is publiek", detail: "Je profiel is publiek toegankelijk, wat belangrijk is voor bereik." },
      ],
      improvements: [
        {
          title: "1. Analyse kon niet volledig worden uitgevoerd",
          observations: ["Er was een technisch probleem bij het analyseren"],
          advice: "Probeer het later opnieuw of neem contact op met Hans voor een handmatige audit.",
        },
        {
          title: "2. Bio optimalisatie",
          observations: ["Controleer of je bio volledig is ingevuld"],
          advice: "Zorg voor een bio met keywords, emoji's en een duidelijke CTA.",
        },
        {
          title: "3. Consistent posten",
          observations: ["Regelmatig posten is essentieel voor groei"],
          advice: "Maak een contentkalender en post minimaal 3x per week.",
        },
      ],
      actionPlan: [
        {
          priority: "Hoog",
          action: "Optimaliseer je bio met een duidelijke CTA",
          impact: "Meer profielbezoekers converteren naar volgers",
          effort: "Laag",
        },
        {
          priority: "Hoog",
          action: "Post minimaal 3x per week",
          impact: "Betere zichtbaarheid in het algoritme",
          effort: "Middel",
        },
        {
          priority: "Middel",
          action: "Maak highlight covers aan",
          impact: "Professionelere uitstraling",
          effort: "Laag",
        },
      ],
      conclusion:
        "We konden helaas geen volledige analyse uitvoeren. Probeer het later opnieuw of neem contact op met Hans Demeyer voor een persoonlijke audit.",
      ffRatio,
      followerPerPost,
    };
  }
}
