'use server'


import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getBlizzardToken(): Promise<string> {
  const cached = await redis.get<string>('blizzard_token')
  if (cached) return cached

  const response = await fetch('https://oauth.battle.net/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      )
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Blizzard token')
  }

  const data = await response.json()
  
  await redis.set('blizzard_token', data.access_token, {
    ex: data.expires_in - 300
  })

  return data.access_token
}