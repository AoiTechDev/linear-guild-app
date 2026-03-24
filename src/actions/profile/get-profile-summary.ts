"use server";

import type { WowCharacterProfileSummary } from "@/types/wow-character-profile-summary";
import { getBlizzardToken } from "../get-blizzard-token";
import { constructFetchRequest } from "@/lib/utils";

export async function getProfileSummary({
  realmSlug = "burning-legion",
  characterName,
}: {
  realmSlug?: string;
  characterName: string;
}): Promise<WowCharacterProfileSummary> {  const token = await getBlizzardToken();

  const path = `/profile/wow/character/${encodeURIComponent(realmSlug)}/${encodeURIComponent(characterName)}`;

  const { input, init } = constructFetchRequest({ path, token });
  const response = await fetch(input, init);

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(
      `Profile summary failed (${response.status}): ${bodyText || response.statusText}`,
    );
  }

  return JSON.parse(bodyText) as WowCharacterProfileSummary;
}