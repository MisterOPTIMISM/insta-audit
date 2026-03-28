import { AuditAnalysis } from "./audit-generator";
import { InstagramProfile } from "./instagram-scraper";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generateReportHtml(
  analysis: AuditAnalysis,
  profile: InstagramProfile
): string {
  const scoreColor =
    analysis.overallScore > 7
      ? "#38a169"
      : analysis.overallScore >= 5
        ? "#dd6b20"
        : "#e53e3e";

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

  const ratioColor = analysis.ffRatio >= 3 ? "#38a169" : analysis.ffRatio >= 1 ? "#dd6b20" : "#e53e3e";
  const followerPerPostColor = analysis.followerPerPost >= 20 ? "#38a169" : analysis.followerPerPost >= 10 ? "#dd6b20" : "#e53e3e";

  // Good points HTML
  const goodPointsHtml = analysis.goodPoints
    .map(
      (point) => `
      <div class="good-card">
        <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #1a2b3f;">${escapeHtml(point.title)}</h4>
        <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.5;">${escapeHtml(point.detail)}</p>
      </div>`
    )
    .join("");

  // Improvements HTML
  const improvementsHtml = analysis.improvements
    .map((imp) => {
      const observationsHtml = imp.observations
        .map((obs) => `<li style="margin-bottom: 6px; color: #4a5568; font-size: 14px; line-height: 1.5;">${escapeHtml(obs)}</li>`)
        .join("");

      let extraHtml = "";

      // Bio comparison box
      if (imp.suggestedBio) {
        extraHtml += `
        <div class="bio-comparison">
          <div class="bio-box bio-current">
            <div class="bio-label">Huidige bio</div>
            <div class="bio-text">${escapeHtml(profile.bio || "(geen bio)")}</div>
          </div>
          <div class="bio-arrow">&#8594;</div>
          <div class="bio-box bio-suggested">
            <div class="bio-label">Voorgestelde bio</div>
            <div class="bio-text">${escapeHtml(imp.suggestedBio)}</div>
          </div>
        </div>`;
      }

      // Highlight tags
      if (imp.suggestedHighlights && imp.suggestedHighlights.length > 0) {
        const currentHighlightsHtml = profile.highlights.length > 0
          ? profile.highlights.map((h) => `<span class="highlight-tag highlight-current">${escapeHtml(h)}</span>`).join("")
          : '<span class="highlight-tag highlight-current" style="opacity: 0.5;">Geen highlights</span>';
        const suggestedHighlightsHtml = imp.suggestedHighlights
          .map((h) => `<span class="highlight-tag highlight-suggested">${escapeHtml(h)}</span>`)
          .join("");

        extraHtml += `
        <div class="highlight-comparison">
          <div class="highlight-group">
            <div class="highlight-label">Huidige highlights</div>
            <div class="highlight-tags">${currentHighlightsHtml}</div>
          </div>
          <div class="bio-arrow">&#8594;</div>
          <div class="highlight-group">
            <div class="highlight-label">Voorgestelde highlights</div>
            <div class="highlight-tags">${suggestedHighlightsHtml}</div>
          </div>
        </div>`;
      }

      // Content pillars
      if (imp.contentPillars && imp.contentPillars.length > 0) {
        const pillarsHtml = imp.contentPillars
          .map(
            (pillar) => `
          <div class="pillar-card">
            <div class="pillar-percentage">${pillar.percentage}%</div>
            <div class="pillar-name">${escapeHtml(pillar.name)}</div>
            <div class="pillar-desc">${escapeHtml(pillar.description)}</div>
          </div>`
          )
          .join("");
        extraHtml += `
        <div class="content-pillars">
          <div class="pillars-label">Voorgestelde content pijlers:</div>
          <div class="pillars-grid">${pillarsHtml}</div>
        </div>`;
      }

      return `
      <div class="improvement-card">
        <h3 class="improvement-title">${escapeHtml(imp.title)}</h3>
        <div class="improvement-section improvement-observations">
          <div class="improvement-section-label">Wat we zien</div>
          <ul style="margin: 0; padding-left: 20px;">${observationsHtml}</ul>
        </div>
        <div class="improvement-section improvement-advice">
          <div class="improvement-section-label">Tip / Advies</div>
          <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.6;">${escapeHtml(imp.advice)}</p>
        </div>
        ${extraHtml}
      </div>`;
    })
    .join("");

  // Action plan rows
  const actionPlanRowsHtml = analysis.actionPlan
    .map(
      (item, index) => {
        const priorityBg = item.priority === "Hoog" ? "#fef2f2" : item.priority === "Middel" ? "#fffbeb" : "#f0fdf4";
        const priorityColor = item.priority === "Hoog" ? "#e53e3e" : item.priority === "Middel" ? "#dd6b20" : "#38a169";
        const effortBg = item.effort === "Hoog" ? "#fef2f2" : item.effort === "Middel" ? "#fffbeb" : "#f0fdf4";
        const effortColor = item.effort === "Hoog" ? "#e53e3e" : item.effort === "Middel" ? "#dd6b20" : "#38a169";

        return `
        <tr>
          <td class="ap-cell ap-num">${index + 1}</td>
          <td class="ap-cell"><span class="badge" style="background: ${priorityBg}; color: ${priorityColor};">${escapeHtml(item.priority)}</span></td>
          <td class="ap-cell ap-action">${escapeHtml(item.action)}</td>
          <td class="ap-cell ap-impact">${escapeHtml(item.impact)}</td>
          <td class="ap-cell"><span class="badge" style="background: ${effortBg}; color: ${effortColor};">${escapeHtml(item.effort)}</span></td>
        </tr>`;
      }
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instagram Audit - @${escapeHtml(profile.handle)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1a2b3f; background: #f5f5f5; line-height: 1.6; }
    .report { max-width: 820px; margin: 0 auto; background: #fff; }

    /* Header */
    .header { background: linear-gradient(135deg, #1a2b3f 0%, #2d4a6f 50%, #4A7FE8 100%); padding: 48px 40px; text-align: center; color: #fff; }
    .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.5px; }
    .header .handle { font-size: 18px; opacity: 0.9; margin-bottom: 2px; }
    .header .name { font-size: 15px; opacity: 0.75; }
    .header .date { font-size: 13px; opacity: 0.6; margin-top: 8px; }

    /* Score box */
    .score-box { padding: 40px; text-align: center; background: #fff; border-bottom: 1px solid #edf2f7; }
    .score-circle { display: inline-flex; align-items: center; justify-content: center; width: 110px; height: 110px; border-radius: 50%; font-size: 42px; font-weight: 800; margin-bottom: 12px; }
    .score-label { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    .score-summary { font-size: 15px; color: #718096; max-width: 550px; margin: 0 auto; line-height: 1.6; }

    /* Stats bar */
    .stats-bar { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 12px; padding: 28px 24px; background: #f7fafc; border-bottom: 1px solid #edf2f7; }
    .stat-card { text-align: center; min-width: 110px; padding: 16px 12px; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); flex: 1; }
    .stat-value { font-size: 26px; font-weight: 800; }
    .stat-label { font-size: 11px; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 4px; font-weight: 600; }

    /* Section headers */
    .section { padding: 36px 40px; }
    .section-title { font-size: 22px; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .section-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }

    /* Good points */
    .good-card { padding: 16px 20px; margin-bottom: 12px; background: #f0fff4; border-left: 4px solid #38a169; border-radius: 0 10px 10px 0; }

    /* Improvement cards */
    .improvement-card { margin-bottom: 24px; border: 1px solid #edf2f7; border-radius: 12px; overflow: hidden; }
    .improvement-title { padding: 18px 24px; font-size: 17px; font-weight: 700; color: #1a2b3f; background: #f7fafc; border-bottom: 1px solid #edf2f7; }
    .improvement-section { padding: 18px 24px; }
    .improvement-observations { border-left: 4px solid #e53e3e; margin: 16px; border-radius: 0 8px 8px 0; background: #fff5f5; padding: 16px 20px; }
    .improvement-advice { border-left: 4px solid #805ad5; margin: 0 16px 16px; border-radius: 0 8px 8px 0; background: #faf5ff; padding: 16px 20px; }
    .improvement-section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #a0aec0; margin-bottom: 10px; }

    /* Bio comparison */
    .bio-comparison { display: flex; align-items: stretch; gap: 12px; margin: 0 16px 16px; flex-wrap: wrap; }
    .bio-box { flex: 1; min-width: 200px; padding: 16px; border-radius: 10px; }
    .bio-current { background: #fff5f5; border: 1px solid #fed7d7; }
    .bio-suggested { background: #f0fff4; border: 1px solid #c6f6d5; }
    .bio-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #a0aec0; margin-bottom: 8px; }
    .bio-text { font-size: 14px; color: #2d3748; line-height: 1.6; white-space: pre-line; }
    .bio-arrow { display: flex; align-items: center; font-size: 24px; color: #a0aec0; font-weight: bold; }

    /* Highlight comparison */
    .highlight-comparison { display: flex; align-items: flex-start; gap: 12px; margin: 0 16px 16px; flex-wrap: wrap; }
    .highlight-group { flex: 1; min-width: 200px; }
    .highlight-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #a0aec0; margin-bottom: 8px; }
    .highlight-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .highlight-tag { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .highlight-current { background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7; }
    .highlight-suggested { background: #f0fff4; color: #38a169; border: 1px solid #c6f6d5; }

    /* Content pillars */
    .content-pillars { margin: 0 16px 16px; }
    .pillars-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #a0aec0; margin-bottom: 12px; }
    .pillars-grid { display: flex; flex-wrap: wrap; gap: 12px; }
    .pillar-card { flex: 1; min-width: 140px; padding: 16px; background: #f7fafc; border-radius: 10px; border: 1px solid #edf2f7; text-align: center; }
    .pillar-percentage { font-size: 28px; font-weight: 800; color: #4A7FE8; }
    .pillar-name { font-size: 14px; font-weight: 700; color: #1a2b3f; margin-top: 4px; }
    .pillar-desc { font-size: 12px; color: #718096; margin-top: 4px; line-height: 1.4; }

    /* Action plan table */
    .ap-table { width: 100%; border-collapse: collapse; }
    .ap-table thead th { padding: 12px 14px; text-align: left; font-size: 11px; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.8px; background: #f7fafc; border-bottom: 2px solid #edf2f7; }
    .ap-cell { padding: 14px; font-size: 14px; border-bottom: 1px solid #edf2f7; vertical-align: middle; }
    .ap-num { font-weight: 700; color: #1a2b3f; width: 40px; }
    .ap-action { color: #1a2b3f; font-weight: 500; }
    .ap-impact { color: #718096; }
    .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; white-space: nowrap; }

    /* Conclusion */
    .conclusion { background: linear-gradient(135deg, #1a2b3f 0%, #2d4a6f 100%); padding: 36px 40px; color: #fff; }
    .conclusion h2 { font-size: 20px; font-weight: 800; margin-bottom: 12px; }
    .conclusion p { font-size: 15px; line-height: 1.7; opacity: 0.9; }

    /* Footer */
    .footer { background: #0f1923; padding: 28px 40px; text-align: center; color: #fff; }
    .footer .brand { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
    .footer .brand .dot { color: #E8724A; }
    .footer .links { display: flex; justify-content: center; gap: 24px; margin-bottom: 8px; }
    .footer .links a { color: #93c5fd; text-decoration: none; font-size: 13px; }
    .footer .links a:hover { text-decoration: underline; }
    .footer .copyright { font-size: 11px; color: #9ca3af; }

    /* Print button */
    .print-bar { padding: 20px 40px; text-align: center; background: #fff; border-top: 1px solid #edf2f7; }
    .print-btn { padding: 12px 36px; background: #4A7FE8; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .print-btn:hover { background: #3a6fd8; }

    /* Responsive */
    @media (max-width: 640px) {
      .header { padding: 32px 20px; }
      .section { padding: 24px 20px; }
      .stats-bar { padding: 16px 12px; gap: 8px; }
      .stat-card { min-width: 80px; padding: 12px 8px; }
      .stat-value { font-size: 20px; }
      .bio-comparison { flex-direction: column; }
      .bio-arrow { justify-content: center; transform: rotate(90deg); }
      .highlight-comparison { flex-direction: column; }
      .improvement-observations, .improvement-advice { margin: 12px 8px; }
      .ap-table { font-size: 12px; }
      .ap-cell { padding: 10px 8px; }
      .conclusion { padding: 28px 20px; }
      .footer { padding: 24px 20px; }
    }

    /* Print styles */
    @media print {
      .no-print { display: none !important; }
      body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .report { max-width: 100%; box-shadow: none; }
      .header, .conclusion, .footer { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .improvement-card { break-inside: avoid; }
      .good-card { break-inside: avoid; }
      .section { break-inside: avoid; }
      .stats-bar { break-inside: avoid; }
      .score-box { break-inside: avoid; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
<div class="report">

  <!-- Header -->
  <div class="header">
    <h1>Instagram Audit Rapport</h1>
    <div class="handle">@${escapeHtml(profile.handle)}</div>
    <div class="name">${escapeHtml(profile.name)}</div>
    <div class="date">${new Date().toLocaleDateString("nl-BE", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>

  <!-- Score Box -->
  <div class="score-box">
    <div class="score-circle" style="border: 6px solid ${scoreColor}; color: ${scoreColor};">
      ${analysis.overallScore}
    </div>
    <div class="score-label" style="color: ${scoreColor};">${scoreLabel}</div>
    <div class="score-summary">${escapeHtml(analysis.summary)}</div>
  </div>

  <!-- Stats Bar -->
  <div class="stats-bar">
    <div class="stat-card">
      <div class="stat-value" style="color: #1a2b3f;">${profile.postsCount.toLocaleString("nl-BE")}</div>
      <div class="stat-label">Posts</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: #1a2b3f;">${profile.followers.toLocaleString("nl-BE")}</div>
      <div class="stat-label">Volgers</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: #1a2b3f;">${profile.following.toLocaleString("nl-BE")}</div>
      <div class="stat-label">Volgend</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: ${ratioColor};">${analysis.ffRatio}</div>
      <div class="stat-label">Ratio V/V</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: ${followerPerPostColor};">${analysis.followerPerPost}</div>
      <div class="stat-label">Volgers/Post</div>
    </div>
  </div>

  <!-- Wat goed gaat -->
  <div class="section">
    <div class="section-title">
      <span class="section-dot" style="background: #38a169;"></span>
      Wat goed gaat
    </div>
    ${goodPointsHtml}
  </div>

  <!-- Wat beter kan -->
  <div class="section" style="border-top: 1px solid #edf2f7;">
    <div class="section-title">
      <span class="section-dot" style="background: #e53e3e;"></span>
      Wat beter kan
    </div>
    ${improvementsHtml}
  </div>

  <!-- Action Plan -->
  <div class="section" style="border-top: 1px solid #edf2f7;">
    <div class="section-title">
      <span class="section-dot" style="background: #4A7FE8;"></span>
      Actieplan
    </div>
    <div style="overflow-x: auto;">
      <table class="ap-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Prioriteit</th>
            <th>Actie</th>
            <th>Impact</th>
            <th>Moeite</th>
          </tr>
        </thead>
        <tbody>
          ${actionPlanRowsHtml}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Conclusion -->
  <div class="conclusion">
    <h2>Conclusie</h2>
    <p>${escapeHtml(analysis.conclusion)}</p>
  </div>

  <!-- Print Button -->
  <div class="print-bar no-print">
    <button class="print-btn" onclick="window.print()">Print / Opslaan als PDF</button>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="brand">InstaAudit<span class="dot">.</span> by Hans Demeyer</div>
    <div class="links">
      <a href="https://www.hansdemeyer.be" target="_blank" rel="noopener noreferrer">hansdemeyer.be</a>
      <a href="https://www.instagram.com/hans.demeyer/" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="https://www.linkedin.com/in/hansdemeyer" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
    <div class="copyright">&copy; 2026 InstaAudit by Hans Demeyer &bull; Powered by AI</div>
  </div>

</div>
</body>
</html>`;
}
