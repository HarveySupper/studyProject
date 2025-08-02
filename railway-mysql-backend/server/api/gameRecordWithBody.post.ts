import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userId = body.userId
    const betAmount = body.betAmount
    const connection = await getConnection()
    await connection.execute(
      ` UPDATE gameRecord SET betAmount = betAmount + '${betAmount}' WHERE userId = '${userId}';`
    )
    return {
      success: true,
      message: '下注成功',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})