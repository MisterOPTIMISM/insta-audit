import puppeteer from "puppeteer-core";
import chromium from "chromium";

export interface InstagramProfile {
  handle: string;
  name: string;
  bio: string;
  postsCount: number;
  followers: number;
  following: number;
  category: string;
  highlights: string[];
  recentPosts: string[];
  profileUrl: string;
  isVerified: boolean;
  hasProfilePic: boolean;
}

function parseCount(text: string): number {
  if (!text) return 0;
  const cleaned = text.trim().toLowerCase().replace(/,/g, "");
  if (cleaned.endsWith("k")) {
    return Math.round(parseFloat(cleaned.replace("k", "")) * 1000);
  }
  if (cleaned.endsWith("m")) {
    return Math.round(parseFloat(cleaned.replace("m", "")) * 1000000);
  }
  return parseInt(cleaned, 10) || 0;
}

export async function scrapeInstagramProfile(
  url: string
): Promise<InstagramProfile> {
  const handle = url.replace(/\/$/, "").split("/").pop() || "";

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: chromium.path,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--single-process",
      ],
    });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.setViewport({ width: 1280, height: 900 });

    // Navigate to profile
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Handle cookie/login popups
    try {
      const declineButton = await page.$(
        'button[class*="decline"], button:has-text("Decline"), button:has-text("Not Now"), button:has-text("Niet nu")'
      );
      if (declineButton) await declineButton.click();
    } catch {
      // Popup might not appear
    }

    // Wait for content to load
    await page.waitForSelector("header", { timeout: 10000 }).catch(() => {});

    // Extract profile data
    const profileData = await page.evaluate(() => {
      const getText = (selector: string): string => {
        const el = document.querySelector(selector);
        return el?.textContent?.trim() || "";
      };

      // Try to get name
      let name = "";
      const headerSection = document.querySelector("header");
      if (headerSection) {
        const nameEl = headerSection.querySelector("span[class*='html-span']");
        if (nameEl) name = nameEl.textContent?.trim() || "";
      }

      // Bio
      let bio = "";
      const bioEl = document.querySelector('div[class*="QGPIr"], header section > div > span, header div > span:not([class*="count"])');
      if (bioEl) bio = bioEl.textContent?.trim() || "";

      // Stats (posts, followers, following)
      const statElements = document.querySelectorAll(
        'header section ul li span, header section ul li a span'
      );
      const stats: string[] = [];
      statElements.forEach((el) => {
        const text = el.getAttribute("title") || el.textContent || "";
        if (text) stats.push(text.trim());
      });

      // Category
      let category = "";
      const categoryEl = document.querySelector(
        'div[class*="category"], header div[class*="html-div"] a[class*="category"]'
      );
      if (categoryEl) category = categoryEl.textContent?.trim() || "";

      // Highlights
      const highlights: string[] = [];
      document.querySelectorAll('div[class*="highlight"] span, canvas + div span').forEach((el) => {
        const text = el.textContent?.trim();
        if (text && text.length < 50) highlights.push(text);
      });

      // Recent posts (from img alt text)
      const recentPosts: string[] = [];
      document.querySelectorAll("article img, main img[alt]").forEach((img) => {
        const alt = img.getAttribute("alt");
        if (alt && alt.length > 10) {
          recentPosts.push(alt);
        }
      });

      // Verified badge
      const isVerified = !!document.querySelector(
        'span[title="Verified"], svg[aria-label="Verified"]'
      );

      // Profile picture
      const hasProfilePic = !!document.querySelector(
        'header img[alt*="profile"], header img[data-testid="user-avatar"]'
      );

      return {
        name,
        bio,
        stats,
        category,
        highlights: highlights.slice(0, 10),
        recentPosts: recentPosts.slice(0, 12),
        isVerified,
        hasProfilePic,
      };
    });

    // Parse stats
    const postsCount = profileData.stats.length > 0 ? parseCount(profileData.stats[0]) : 0;
    const followers = profileData.stats.length > 1 ? parseCount(profileData.stats[1]) : 0;
    const following = profileData.stats.length > 2 ? parseCount(profileData.stats[2]) : 0;

    return {
      handle,
      name: profileData.name || handle,
      bio: profileData.bio,
      postsCount,
      followers,
      following,
      category: profileData.category,
      highlights: profileData.highlights,
      recentPosts: profileData.recentPosts,
      profileUrl: url,
      isVerified: profileData.isVerified,
      hasProfilePic: profileData.hasProfilePic,
    };
  } catch (error) {
    console.error("Instagram scraping error:", error);

    // Return partial data so the audit can still proceed
    return {
      handle,
      name: handle,
      bio: "",
      postsCount: 0,
      followers: 0,
      following: 0,
      category: "",
      highlights: [],
      recentPosts: [],
      profileUrl: url,
      isVerified: false,
      hasProfilePic: false,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
