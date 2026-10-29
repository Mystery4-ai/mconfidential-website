import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mconfidential.ma";

const AI_CRAWLERS = [
  "GPTBot", // OpenAI — training
  "OAI-SearchBot", // OpenAI — ChatGPT search
  "ChatGPT-User", // OpenAI — live browsing on a user's behalf
  "ClaudeBot", // Anthropic — training
  "Claude-User", // Anthropic — live browsing on a user's behalf
  "Claude-SearchBot", // Anthropic — search indexing
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini training/grounding
  "Amazonbot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Explicitly allowed (not just covered by the wildcard above) so
      // AI assistants/answer engines can read and cite listings directly.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/admin", "/api"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
