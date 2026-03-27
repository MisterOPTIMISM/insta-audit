import { AuditAnalysis } from "./audit-generator";
import { InstagramProfile } from "./instagram-scraper";

export function generateReportHtml(
  analysis: AuditAnalysis,
  profile: InstagramProfile
): string {
  const scoreColor =
    analysis.overallScore >= 7
      ? "#22c55e"
      : analysis.overallScore >= 5
        ? "#f59e0b"
        : "#ef4444";

  const scoreLabel =
    analysis.overallScore >= 8
      ? "Uitstekend"
      : analysis.overallScore >= 7
        ? "Goed"
        : analysis.overallScore >= 5
          ? "Gemiddeld"
          : analysis.overallScore >= 3
            ? "Onder gemiddeld"
            : "Kritiek";

  const goodPointsHtml = analysis.goodPoints
    .map(
      (point) =>
        `<div style="padding: 12px 16px; margin-bottom: 8px; background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 8px 8px 0; font-size: 14px; color: #1a2b3f;">&#10003; ${point}</div>`
    )
    .join("");

  const improvementPointsHtml = analysis.improvementPoints
    .map(
      (point) =>
        `<div style="padding: 12px 16px; margin-bottom: 8px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; font-size: 14px; color: #1a2b3f;">&#9888; ${point}</div>`
    )
    .join("");

  const actionPlanRowsHtml = analysis.actionPlan
    .map(
      (item, index) =>
        `<tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 16px; font-weight: 600; color: #1a2b3f; font-size: 14px;">${index + 1}</td>
          <td style="padding: 12px 16px; font-size: 14px;"><span style="display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${item.priority === "Hoog" ? "#fef2f2" : item.priority === "Middel" ? "#fffbeb" : "#f0fdf4"}; color: ${item.priority === "Hoog" ? "#ef4444" : item.priority === "Middel" ? "#f59e0b" : "#22c55e"};">${item.priority}</span></td>
          <td style="padding: 12px 16px; color: #1a2b3f; font-size: 14px;">${item.action}</td>
          <td style="padding: 12px 16px; color: #6b7280; font-size: 14px;">${item.impact}</td>
        </tr>`
    )
    .join("");

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; color: #1a2b3f;">
  <style>
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; }
      div { break-inside: avoid; }
    }
  </style>

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1a2b3f 0%, #4A7FE8 100%); padding: 40px 32px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
    <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">Instagram Audit Rapport</h1>
    <p style="margin: 0; font-size: 16px; opacity: 0.9;">@${profile.handle} &bull; ${profile.name}</p>
    <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.7;">${new Date().toLocaleDateString("nl-BE", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <!-- Score Box -->
  <div style="background: white; padding: 32px; text-align: center; border-bottom: 1px solid #f3f4f6;">
    <div style="display: inline-block; width: 100px; height: 100px; border-radius: 50%; border: 6px solid ${scoreColor}; line-height: 88px; font-size: 36px; font-weight: 800; color: ${scoreColor}; margin-bottom: 12px;">
      ${analysis.overallScore}
    </div>
    <p style="margin: 0; font-size: 18px; font-weight: 600; color: ${scoreColor};">${scoreLabel}</p>
    <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280; max-width: 500px; margin-left: auto; margin-right: auto;">${analysis.summary}</p>
  </div>

  <!-- Stats Bar -->
  <div style="background: #f8f8f8; padding: 24px 32px; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid #f3f4f6;">
    <div style="text-align: center; min-width: 100px;">
      <div style="font-size: 24px; font-weight: 700; color: #1a2b3f;">${profile.postsCount.toLocaleString("nl-BE")}</div>
      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Posts</div>
    </div>
    <div style="text-align: center; min-width: 100px;">
      <div style="font-size: 24px; font-weight: 700; color: #1a2b3f;">${profile.followers.toLocaleString("nl-BE")}</div>
      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Volgers</div>
    </div>
    <div style="text-align: center; min-width: 100px;">
      <div style="font-size: 24px; font-weight: 700; color: #1a2b3f;">${profile.following.toLocaleString("nl-BE")}</div>
      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Volgend</div>
    </div>
    <div style="text-align: center; min-width: 100px;">
      <div style="font-size: 24px; font-weight: 700; color: ${analysis.ffRatio >= 1 ? "#22c55e" : "#f59e0b"};">${analysis.ffRatio}</div>
      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">V/V Ratio</div>
    </div>
  </div>

  <!-- Good Points -->
  <div style="background: white; padding: 32px;">
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1a2b3f; display: flex; align-items: center; gap: 8px;">
      <span style="color: #22c55e;">&#9679;</span> Wat gaat er goed
    </h2>
    ${goodPointsHtml}
  </div>

  <!-- Improvement Points -->
  <div style="background: white; padding: 32px; border-top: 1px solid #f3f4f6;">
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1a2b3f; display: flex; align-items: center; gap: 8px;">
      <span style="color: #ef4444;">&#9679;</span> Verbeterpunten
    </h2>
    ${improvementPointsHtml}
  </div>

  <!-- Action Plan -->
  <div style="background: white; padding: 32px; border-top: 1px solid #f3f4f6;">
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1a2b3f; display: flex; align-items: center; gap: 8px;">
      <span style="color: #4A7FE8;">&#9679;</span> Actieplan
    </h2>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">#</th>
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Prioriteit</th>
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Actie</th>
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Verwacht resultaat</th>
          </tr>
        </thead>
        <tbody>
          ${actionPlanRowsHtml}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Print Button -->
  <div class="no-print" style="background: white; padding: 24px 32px; text-align: center; border-top: 1px solid #f3f4f6;">
    <button onclick="window.print()" style="padding: 12px 32px; background: #4A7FE8; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
      Print / Opslaan als PDF
    </button>
  </div>

  <!-- Footer -->
  <div style="background: #1a2b3f; padding: 24px 32px; border-radius: 0 0 16px 16px; text-align: center; color: white;">
    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
      InstaAudit<span style="color: #E8724A;">.</span> by Hans Demeyer
    </p>
    <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 8px;">
      <a href="https://www.hansdemeyer.be" style="color: #93c5fd; text-decoration: none; font-size: 13px;">hansdemeyer.be</a>
      <a href="https://www.instagram.com/hans.demeyer/" style="color: #93c5fd; text-decoration: none; font-size: 13px;">Instagram</a>
      <a href="https://www.linkedin.com/in/hansdemeyer" style="color: #93c5fd; text-decoration: none; font-size: 13px;">LinkedIn</a>
    </div>
    <p style="margin: 0; font-size: 11px; color: #9ca3af;">&copy; 2026 InstaAudit by Hans Demeyer &bull; Powered by AI</p>
  </div>
</div>
`;
}
