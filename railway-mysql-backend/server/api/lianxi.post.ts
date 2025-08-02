import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const userId = body.userId
        const inviteId = body.inviteId
        const betAmount = body.betAmount
        // return {
        //     userId, inviteId, betAmount
        // }
        const connection = await getConnection()

        if (!userId || userId === ' ') {
            return {
                success: false,
                message: '用户ID必须输入'
            }
        }

        if (!Number.isInteger(userId) || typeof userId !== 'number' || userId <= 0) {
            return {
                success: false,
                message: '用户ID必须是正整数（数字类型）'
            }
        }

        const [user]: [any[], any] = await connection.query(
            ` SELECT * FROM gameRecord
              WHERE userId = ?`,
            [userId]
        )
        console.log('查询结果：', user)
        if (!user || user.length === 0) {

            if (inviteId !== null && inviteId !== undefined) {
                await connection.query(` INSERT INTO gameRecord (userId, inviteId, betAmount) VALUES (?, ?, ?)`,
                    [userId, inviteId, betAmount]
                )
                return {
                    message: '未找到数据，有传邀请id,已插入新数据带邀请ID',
                }
            } else {
                await connection.query(` INSERT INTO gameRecord (userId, betAmount) VALUES (?, ?)`,
                    [userId, betAmount])
                return {
                    message: '未找到数据且未传邀请id,已插入新数据不带邀请ID',
                }
            }
            return {
                success: true,
                message: '未找到数据，已插入新数据',
                instead: true
            }

        } else {
            await connection.query(
                ` UPDATE gameRecord SET betAmount = betAmount + ? WHERE userId = ?`,
                [betAmount, userId]
            )
            return {
                success: true,
                message: '找到数据，已更新投注记录',
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