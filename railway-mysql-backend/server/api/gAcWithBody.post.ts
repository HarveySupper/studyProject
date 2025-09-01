// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userId = body.userId
    const inviteId = body.inviteId
    const connection = await getConnection()
    // 插入数据到 gameRecord 表
    await connection.execute(
      ` INSERT INTO gameRecord (userId, inviteId) VALUES (?, ?) `,
      // 使用参数化查询防止 SQL 注入
      [userId, inviteId]
    )
    // 插入数据到 commission 表
    await connection.execute(
      ` INSERT INTO commission (userId, inviteId) VALUES (?, ?) `,
      // 使用参数化查询防止 SQL 注入
      [userId, inviteId]
    )
    return {
      success: true,
      message: '玩家注册成功，数据已插入 gameRecord 和 commission 表'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})