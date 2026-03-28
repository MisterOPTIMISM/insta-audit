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
  const cleaned = text.trim().toLowerCase().replace(/,/g, "").replace(/\./g, "");
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
  const profileUrl = `https://www.instagram.com/${handle}/`;

  try {
    // Fetch the Instagram page HTML with a browser-like user agent
    const response = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,nl;q=0.8",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(`Instagram fetch failed: ${response.status}`);
      return createEmptyProfile(handle, profileUrl);
    }

    let html = await response.text();
    // Decode common HTML entities
    html = html.replace(/&#064;/g, "@").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

    // Extract data from the page title
    // Format: "Name (@handle) • Instagram photos and videos"
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";
    let name = handle;
    if (title && title.includes("@")) {
      const nameMatch = title.match(/^(.*?)\s*\(@/);
      if (nameMatch) name = nameMatch[1].trim();
    }

    // Extract from meta tags (Instagram uses various formats)
    const descriptionMatch = html.match(
      /<meta\s+(?:name|property)="(?:description|og:description)"\s+content="(.*?)"/
    ) || html.match(
      /content="(.*?)"\s+(?:name|property)="(?:description|og:description)"/
    ) || html.match(
      /property="og:description"\s*[^>]*content="(.*?)"/
    ) || html.match(
      /content="(\d+\s*Followers.*?)"/i
    );
    const description = descriptionMatch ? descriptionMatch[1] : "";

    // Parse description: "X Followers, Y Following, Z Posts - Bio text"
    let postsCount = 0;
    let followers = 0;
    let following = 0;
    let bio = "";

    if (description) {
      // Try format: "1,234 Followers, 567 Following, 89 Posts - See Instagram..."
      const followersMatch = description.match(/([\d,.]+[kKmM]?)\s*Followers/i);
      const followingMatch = description.match(/([\d,.]+[kKmM]?)\s*Following/i);
      const postsMatch = description.match(/([\d,.]+[kKmM]?)\s*Posts/i);

      if (followersMatch) followers = parseCount(followersMatch[1]);
      if (followingMatch) following = parseCount(followingMatch[1]);
      if (postsMatch) postsCount = parseCount(postsMatch[1]);

      // Extract bio (after the stats part)
      const bioMatch = description.match(/Posts?\s*[-–—]\s*(.*)/i);
      if (bioMatch) {
        bio = bioMatch[1]
          .replace(/See Instagram photos and videos.*$/i, "")
          .replace(/on Instagram:.*$/i, "")
          .trim();
      }
    }

    // Try to extract stats from the HTML body (accessible text)
    if (followers === 0) {
      // Try: "1,234 followers" in various formats in the HTML
      const htmlFollowers = html.match(/"edge_followed_by":\s*{\s*"count":\s*(\d+)/);
      const htmlFollowing = html.match(/"edge_follow":\s*{\s*"count":\s*(\d+)/);
      const htmlPosts = html.match(/"edge_owner_to_timeline_media":\s*{\s*"count":\s*(\d+)/);

      if (htmlFollowers) followers = parseInt(htmlFollowers[1], 10);
      if (htmlFollowing) following = parseInt(htmlFollowing[1], 10);
      if (htmlPosts) postsCount = parseInt(htmlPosts[1], 10);
    }

    // Try extracting from accessible link text: "1,234 posts" "567 followers" "89 following"
    if (followers === 0) {
      const postsLinkMatch = html.match(/"([\d,]+)\s*posts?"/i);
      const followersLinkMatch = html.match(/"([\d,]+)\s*followers?"/i);
      const followingLinkMatch = html.match(/"([\d,]+)\s*following"/i);

      if (postsLinkMatch) postsCount = parseCount(postsLinkMatch[1]);
      if (followersLinkMatch) followers = parseCount(followersLinkMatch[1]);
      if (followingLinkMatch) following = parseCount(followingLinkMatch[1]);
    }

    // Extract bio from JSON in the page if available
    if (!bio) {
      const biographyMatch = html.match(/"biography":\s*"((?:[^"\\]|\\.)*)"/);
      if (biographyMatch) {
        bio = biographyMatch[1]
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
    }

    // Extract category
    let category = "";
    const categoryMatch = html.match(/"category_name":\s*"(.*?)"/);
    if (categoryMatch) category = categoryMatch[1];

    // Extract recent posts from alt text in the HTML
    const recentPosts: string[] = [];
    const altMatches = html.matchAll(/alt="((?:Photo|Video|Reel|Clip).*?)"/gi);
    for (const match of altMatches) {
      if (match[1].length > 10) {
        recentPosts.push(match[1]);
        if (recentPosts.length >= 12) break;
      }
    }

    // Also try to find posts from link descriptions
    if (recentPosts.length === 0) {
      const postAltMatches = html.matchAll(/alt="(.*?(?:May be|Photo by|Video by).*?)"/gi);
      for (const match of postAltMatches) {
        if (match[1].length > 10) {
          recentPosts.push(match[1]);
          if (recentPosts.length >= 12) break;
        }
      }
    }

    // Extract highlights
    const highlights: string[] = [];
    const highlightMatches = html.matchAll(/View\s+(.*?)\s+highlight/gi);
    for (const match of highlightMatches) {
      if (match[1].length < 50) {
        highlights.push(match[1]);
      }
    }

    // Check verification
    const isVerified = html.includes('"is_verified":true') || html.includes('Verified');

    // Check profile pic
    const hasProfilePic = !html.includes("instagram.com/static/images/anonymousUser");

    const profile: InstagramProfile = {
      handle,
      name: name || handle,
      bio,
      postsCount,
      followers,
      following,
      category,
      highlights: highlights.slice(0, 10),
      recentPosts: recentPosts.slice(0, 12),
      profileUrl,
      isVerified,
      hasProfilePic,
    };

    console.log("Scraped profile:", JSON.stringify({
      handle: profile.handle,
      name: profile.name,
      posts: profile.postsCount,
      followers: profile.followers,
      following: profile.following,
      bioLength: profile.bio.length,
      highlights: profile.highlights.length,
      recentPosts: profile.recentPosts.length,
    }));

    return profile;
  } catch (error) {
    console.error("Instagram scraping error:", error);
    return createEmptyProfile(handle, profileUrl);
  }
}

function createEmptyProfile(handle: string, profileUrl: string): InstagramProfile {
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
    profileUrl,
    isVerified: false,
    hasProfilePic: false,
  };
}
