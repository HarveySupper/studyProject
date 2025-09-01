// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const connection = await getConnection()
    const [rows] = await connection.execute(
      'DELETE FROM messages WHERE id = 11',
    )
    return {
      success: true,
      messages: rows
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})