// server/api/lianxi3.post.ts
import { getConnection } from '../utils/db'
import { vendorReturnRateMap, generateGameResult } from '../utils/rtp'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { betAmount = 100, gameVendor = 'PG' } = body

  const returnRate = vendorReturnRateMap[gameVendor] || 0.98
  const gameResult = generateGameResult(betAmount, returnRate)

  return {
    success: true,
    gameVendor,
    returnRate,
    betAmount,
    gameResult
  }
})
