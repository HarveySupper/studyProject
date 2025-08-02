import { getConnection } from '../utils/db'

/**
 * 需求：实现一个玩家下注接口，接口传入参数有两个，用户id和下注金额，要求做到以下三种情况：
 *  1. 用户id在表中已存在更新下注金额
 *  2. 用户id在表中不存在插入一条记录并更新下注金额
 *  3. 用户id非法：例如，用户id输入的是空或者空字符串等一系列不为数字的值不进行任何操作，并且返回一个错误
 *
 * 1. 需求的核心是对传入参数进行正确性校验，那么首先我们要确认哪些校验是直接可以在前端进行的，
 * 哪些校验是必须在后端进行的。
 * 前端可以进行的校验包括：
 *  - 用户id不能为空
 *  - 用户id必须为数字
 *  - 用户id必须为正数
 *  - 投注金额不能为空
 *  - 投注金额必须为数字
 *  - 投注金额必须为正数
 * 后端必须进行的校验包括：
 *  - 用户id是否存在
 * 2. 校验结束之后，我们需要进行两种操作:
 *  - 如果用户id已存在，则更新下注金额，更新下注金额需要调用数据库的更新操作 UPDATE
 *  - 如果用户id不存在，则插入一条记录并更新下注金额，插入记录需要调用数据库的插入操作 INSERT
 */
export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody(event)
    // 从请求体中提取 userId 和 betAmount
    const userId = body.userId
    const betAmount = body.betAmount
    // 链接数据库
    const connection = await getConnection()

    // 判断用户ID
    // 1. 用户ID不为空
    if (!userId) {
      return {
        success: false,
        error: '用户id必须输入'
      }
    }
    // 2. 用户ID不为数字
    if (typeof userId !== 'number' || isNaN(Number(userId))) {
      return {
        success: false,
        error: '用户id必须为数字'
      }
    }
    // 3. 用户ID为负数
    if (Number(userId) < 0) {
      return {
        success: false,
        error: '用户id必须为正数'
      }
    }
    // 4. 投注金额必须存在
    if (betAmount === undefined || betAmount === null) {
      return {
        success: false,
        error: '投注金额必须输入'
      }
    }
    // 5. 投注金额必须为数字
    if (typeof betAmount !== 'number' || isNaN(Number(betAmount))) {
      return {
        success: false,
        error: '投注金额必须为数字'
      }
    }
    // 6. 投注金额必须为正数
    if (Number(betAmount) <= 0) {
      return {
        success: false,
        error: '投注金额必须为正整数'
      }
    }
    // 获取用户信息
    const [user]: [any[], any] = await connection.query('SELECT * FROM gameRecord WHERE userId = ?', [userId])
    // 如果用户不存在
    if (!user || user.length <= 0) {
      await connection.execute('INSERT INTO gameRecord (userId, betAmount) VALUES (?, ?)', [userId, betAmount])
    }
    // 如果用户存在，更新投注金额
    else {
      await connection.execute('UPDATE gameRecord SET betAmount = betAmount + ? WHERE userId = ?', [betAmount, userId])
    }

    return {
      success: true,
      message: '投注金额更新成功'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})