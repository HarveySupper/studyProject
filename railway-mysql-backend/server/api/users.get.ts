// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const connection = await getConnection()

    // Example query - adjust table name and columns as needed
    const [rows] = await connection.execute('SELECT * FROM users LIMIT 10')

    return {
      success: true,
      data: rows
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})