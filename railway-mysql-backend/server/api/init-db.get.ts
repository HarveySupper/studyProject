// import { getConnection } from '../utils/db'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const connection = await getConnection()

    // 读取SQL文件
    const sqlPath = path.join(process.cwd(), 'server/sql/init.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // 执行SQL语句（分割多个语句）
    const statements = sql.split(';').filter(s => s.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement)
      }
    }

    return {
      success: true,
      message: 'Database initialized successfully',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})