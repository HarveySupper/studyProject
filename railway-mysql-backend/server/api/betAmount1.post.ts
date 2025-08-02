import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userId = body.userId
    const inviteId = body.inviteId

    // return {
    //   userId, inviteId, betAmount
    // }

    const betAmount = body.betAmount
    const connection = await getConnection()

    if (!userId || userId === " ") {
      return {
        success: false,
        message: '用户ID必须输入'
      }
    }

    if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
      return {
        success: false,
        message: '用户ID必须是正整数（数字类型）'
      }
    }

    const [user]: [any[], any] = await connection.query(
      ` SELECT * FROM gameRecord
      WHERE userID = ? `,
      [userId])
    if (!user || user.length === 0) {

      if (inviteId !== undefined && inviteId !== null) {
        await connection.query(
          ` INSERT INTO gameRecord (userId, inviteId, betAmount) VALUES (?, ?, ?) `,
          [userId, inviteId, betAmount])
      } else {
        await connection.query(
          ` INSERT INTO gameRecord (userId, betAmount) VALUES (?, ?, ?) `,
          [userId, betAmount])
      }
      return {
        success: true,
        message: '查找不到数据，已插入新纪录',
        instead: true
      }

    } else {
      // await connection.query(
      //   ` UPDATE gameRecord
      //     SET betAmount = betAmount + ? 
      //     WHERE userId = ? `,
      //   [betAmount, userId])
      return {
        success: true,
        message: '查找到数据，已更新投注纪录',
        update: true,
        date: user
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})