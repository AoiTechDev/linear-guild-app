"use server";

import type { GuildRosterResponse } from "@/types/wow-guild-roster";
import { getBlizzardToken } from "../get-blizzard-token";
import { constructFetchRequest } from "@/lib/utils";

export async function getGuildRoster(
  realmSlug = "burning-legion",
  guildSlug = "linear",
): Promise<GuildRosterResponse> {
  const token = await getBlizzardToken();

  const path = `/data/wow/guild/${encodeURIComponent(realmSlug)}/${encodeURIComponent(guildSlug)}/roster`;

  const { input, init } = constructFetchRequest({ path, token });
  const response = await fetch(input, init);
  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(
      `Guild roster failed (${response.status}): ${bodyText || response.statusText}`,
    );
  }

  return JSON.parse(bodyText) as GuildRosterResponse;
}
