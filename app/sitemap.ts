import type { MetadataRoute } from "next";
import { TEAMS } from "@/lib/teams";
import { GROUP_LIST } from "@/lib/groups";
import { getAllMatches } from "@/lib/fixtures";

const SITE_URL = "https://worldcupchart.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const matches = await getAllMatches().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/fixtures",
    "/groups",
    "/knockout",
    "/teams",
    "/cities",
    "/news",
    "/predictions",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/news" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  const groupRoutes: MetadataRoute.Sitemap = GROUP_LIST.map((g) => ({
    url: `${SITE_URL}/groups/${g}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const teamRoutes: MetadataRoute.Sitemap = TEAMS.filter((t) => t.qualified).map((t) => ({
    url: `${SITE_URL}/teams/${t.code}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const matchRoutes: MetadataRoute.Sitemap = matches.map((m) => ({
    url: `${SITE_URL}/match/${m.id}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...groupRoutes, ...teamRoutes, ...matchRoutes];
}
