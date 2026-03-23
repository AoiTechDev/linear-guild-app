"use server";

import type { WowCharacterProfileSummary } from "@/types/wow-character-profile-summary";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export type GuildLinearCache = {
  lastUpdated: number;
  members: WowCharacterProfileSummary[];
  errorCount: number;
  errors: unknown[];
};

export async function getGuildMembers(): Promise<GuildLinearCache | null> {
  const raw = await redis.get<GuildLinearCache | string>("guild:linear:all");
  if (raw == null) return null;
  if (typeof raw === "string") {
    return JSON.parse(raw) as GuildLinearCache;
  }
  return raw;
}
