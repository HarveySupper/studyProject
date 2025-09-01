// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const connection = await getConnection()
    const [rows] = await connection.execute(
      'UPDATE gameRecord SET betAmount = betAmount + 10 WHERE userId = 183123133;'
    )
    return {
      success: true,
      message: '下注成功',
      result: rows
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})