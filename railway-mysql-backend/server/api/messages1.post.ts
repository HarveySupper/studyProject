// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    // 直接插入两条固定数据
    const connection = await getConnection()
    const [result] = await connection.execute(
      'INSERT INTO messages (content, author) VALUES (?, ?), (?, ?)',
      ['哈维', '老师好腻害', '哈维哥哥', '太帅啦']
    )
    return {
      success: true,
      message: '两条消息发送成功',
      result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})