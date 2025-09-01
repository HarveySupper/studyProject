// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, gameVendor, gameType, betAmount, winAmount } = body
    const connection = await getConnection()
    if (!userId || userId === ' ') {
      return {
        success: false,
        message: '用户ID必须输入'
      }
    }

    if (!Number.isInteger(userId) || typeof userId !== 'number' || userId <= 0) {
      return {
        success: false,
        message: '用户ID必须是正整数（数字类型）'
      }
    }

    if (!Number.isInteger(betAmount) || typeof betAmount !== 'number' || betAmount <= 0) {
      return {
        success: false,
        message: '金额必须是正整数（数字类型）'
      }
    }

    let validBetAmount = 0

    if (gameVendor === 'Spribe') {
      validBetAmount = Math.abs(winAmount)
    } else {
      validBetAmount = betAmount
    }

    await connection.query(
      ` INSERT INTO gameRecordNew (userId, betAmount, gameVendor, gameType, validBetAmount, winAmount) VALUES (?, ?, ?,?,?, ?)`,
      [userId, betAmount, gameVendor, gameType, validBetAmount, winAmount]
    )
    return {
      success: true,
      message: '投注记录已更新',
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})