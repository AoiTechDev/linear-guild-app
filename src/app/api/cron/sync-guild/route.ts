import { getGuildRoster } from "@/actions/guild/get-guild-roster";
import { getProfileSummary } from "@/actions/profile/get-profile-summary";
import type { WowCharacterProfileSummary } from "@/types/wow-character-profile-summary";
import type { WowGuildRosterMember } from "@/types/wow-guild-roster";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roster = await getGuildRoster();
  const { profiles, errors } = await fetchAllMembersInBatches({
    members: roster.members,
  });

  await redis.set(
    "guild:linear:all",
    JSON.stringify({
      lastUpdated: Date.now(),
      members: profiles,
      errorCount: errors.length,
      errors: errors.slice(0, 50),
    }),
    { ex: 7200 },
  );

  return Response.json({
    ok: true,
    synced: profiles.length,
    failed: errors.length,
  });
}

async function fetchAllMembersInBatches({
  members,
}: {
  members: WowGuildRosterMember[];
}): Promise<{
  profiles: WowCharacterProfileSummary[];
  errors: { name: string; realm: string; message: string }[];
}> {
  const BATCH_SIZE = 10;
  const profiles: WowCharacterProfileSummary[] = [];
  const errors: { name: string; realm: string; message: string }[] = [];

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE);

    const settled = await Promise.allSettled(
      batch.map((member) =>
        getProfileSummary({
          realmSlug: member.character.realm.slug,
          characterName: member.character.name.toLowerCase(),
        }),
      ),
    );

    settled.forEach((result, j) => {
      const member = batch[j]!;
      const name = member.character.name;
      const realm = member.character.realm.slug;
      if (result.status === "fulfilled") {
        profiles.push(result.value);
      } else {
        const message =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        errors.push({ name, realm, message });
      }
    });

    if (i + BATCH_SIZE < members.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { profiles, errors };
}
