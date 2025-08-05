import { getConnection } from '../utils/db'
import { vendorReturnRateMap, generateGameResult } from '../utils/rtp'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { userId, inviteId, betAmount, gameVendor } = body
        // return {
        //     userId, inviteId, betAmount, gameVendor
        // }
        const connection = await getConnection()
        // const returnRate = vendorReturnRateMap[gameVendor] || 0.98
        // const gameResult = generateGameResult(betAmount, returnRate)

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

        if (!Number.isInteger(betAmount) || typeof betAmount !== 'number' || betAmount <= 0) {
            return {
                success: false,
                message: '金额必须是正整数（数字类型）'
            }
        }

        const [user]: [any[], any] = await connection.query(
            ` SELECT * FROM gameRecord
              WHERE userId = ?`,
            [userId]
        )
        console.log('查询结果：', user)
        if (!user || user.length === 0) {
            // 用户不存在
            if (inviteId !== null && inviteId !== undefined) {
                const [inviteUser]: [any[], any] = await connection.query(
                    'SELECT userId FROM gameRecord WHERE userId = ? LIMIT 1',
                    [inviteId]
                )
                if (!inviteUser || inviteUser.length === 0) {
                    // ❌ 邀请人不存在
                    return {
                        success: false,
                        erro: `邀请ID ${inviteUser} 不存在于数据库中，插入失败}`,
                    }
                }

                // 邀请人存在，插入新数据带邀请ID
                await connection.query(
                    ` INSERT INTO gameRecord (userId, inviteId, betAmount, gameVendor) VALUES (?, ?, ?, ?)`,
                    [userId, inviteId, betAmount, gameVendor]
                )
                return {
                    success: true,
                    message: '未找到用户，有传邀请id,已插入新数据带邀请ID',
                }

            } else {
                // 没有邀请人，插入不带 inviteId 的记录
                await connection.query(
                    ` INSERT INTO gameRecord (userId, betAmount, gameVendor) VALUES (?, ?, ?)`,
                    [userId, betAmount, gameVendor]
                )
                return {
                    success: true,
                    message: '未找到用户且未传邀请id,已插入新数据不带邀请ID',
                }
            }
        } else {
            // 用户已存在，更新投注金额
            await connection.query(
                ` UPDATE gameRecord SET betAmount = betAmount + ? WHERE userId = ?`,
                [betAmount, userId]
            )
            return {
                success: true,
                message: '已找到用户，投注记录已更新',
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