/**
 * Blizzard WoW Game Data API — GET /data/wow/guild/{realm}/{guild}/roster
 * @see https://develop.battle.net/documentation/world-of-warcraft/game-data-apis
 *
 * Extend this file as you use more fields; unknown/extra keys are still allowed at runtime.
 */

export type WowKeyHref = {
  href: string
}

export type WowNamedRef = {
  key: WowKeyHref
  name: string
  id: number
}

export type WowGuildSummary = {
  key: WowKeyHref
  name: string
  id: number
  realm: WowNamedRef & { slug: string }
  faction: {
    type: 'HORDE' | 'ALLIANCE' | string
    name: string
  }
}

export type WowGuildRosterMember = {
  character: {
    name: string
    id: number
    realm: WowNamedRef & { slug: string }
  }
  playable_class: WowNamedRef
  race: WowNamedRef
  level: number
  rank: number
  protected_character?: { href: string }
}

export type GuildRosterResponse = {
  _links?: { self: WowKeyHref }
  guild: WowGuildSummary
  members: WowGuildRosterMember[]
}
