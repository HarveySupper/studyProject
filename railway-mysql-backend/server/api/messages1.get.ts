// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const connection = await getConnection()
    const [rows] = await connection.execute(
      'SELECT * FROM messages WHERE id = ? OR id = ?',
      [14, 15]
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