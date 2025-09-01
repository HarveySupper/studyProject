// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.content || !body.author) {
      return {
        success: false,
        error: '内容和作者不能为空'
      }
    }

    const connection = await getConnection()
    const [result] = await connection.execute(
      'INSERT INTO messages (content, author) VALUES (?, ?)',
      [body.content, body.author]
    )

    return {
      success: true,
      message: '消息发送成功',
      result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})