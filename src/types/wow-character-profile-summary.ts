/**
 * Blizzard WoW Profile API — GET /profile/wow/character/{realm}/{character}
 * @see https://develop.battle.net/documentation/world-of-warcraft/profile-apis
 */

import type { WowGuildSummary, WowKeyHref, WowNamedRef } from "@/types/wow-guild-roster";

export type WowCharacterProfileSummary = {
  _links?: { self: WowKeyHref }
  id: number
  name: string
  gender: {
    type: string
    name: string
  }
  faction: {
    type: "HORDE" | "ALLIANCE" | string
    name: string
  }
  race: WowNamedRef
  character_class: WowNamedRef
  active_spec: WowNamedRef
  realm: WowNamedRef & { slug: string }
  guild?: WowGuildSummary
  level: number
  experience: number
  achievement_points: number
  achievements: WowKeyHref
  titles: WowKeyHref
  pvp_summary: WowKeyHref
  encounters: WowKeyHref
  media: WowKeyHref
  last_login_timestamp: number
  average_item_level: number
  equipped_item_level: number
  specializations: WowKeyHref
  statistics: WowKeyHref
  mythic_keystone_profile: WowKeyHref
  equipment: WowKeyHref
  appearance: WowKeyHref
  collections: WowKeyHref
  active_title?: WowNamedRef & { display_string: string }
  reputations: WowKeyHref
  quests: WowKeyHref
  achievements_statistics: WowKeyHref
  professions: WowKeyHref
  covenant_progress?: {
    chosen_covenant: WowNamedRef
    renown_level: number
    soulbinds: WowKeyHref
  }
  is_remix: boolean
  houses?: WowKeyHref[]
  name_search: string
}
