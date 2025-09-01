// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const connection = await getConnection()
    const [rows] = await connection.execute('SELECT 1 as test')

    return {
      success: true,
      message: 'Database connection successful',
      result: rows
    }
  } catch (error) {
    return {
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})