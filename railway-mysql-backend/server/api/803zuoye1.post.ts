// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { inviteId, topId, userId, gameType } = body

        const connection = await getConnection()

        // 统计某个用户对应游戏类型的团队业绩、直属业绩和总业绩。
        // 直属业绩（WHERE ar.inviteId = ?）
        // const [direct]: [any[], any] = await connection.query(
        //     `SELECT gr.gameType, SUM(gr.validBetAmount) AS total
        //     FROM agencyRelation ar
        //     LEFT JOIN gameRecord gr ON gr.userId = ar.userId
        //     WHERE ar.inviteId = ?
        //     GROUP BY gr.gameType`,
        //     [inviteId],
        // )
        // return {
        //     success: true,
        //     direct // 电子 210
        // }

        // 团队业绩（WHERE ar.topId = ? AND ar.inviteId != ?）
        // const [indirect]: [any[], any] = await connection.query(
        //     `SELECT gr.gameType, SUM(gr.validBetAmount) AS total
        //     FROM agencyRelation ar
        //     LEFT JOIN gameRecord gr ON gr.userId = ar.userId
        //     WHERE ar.topId = ? AND ar.inviteId != ?
        //     GROUP BY gr.gameType`,
        //     [topId, inviteId],
        // )
        // return {
        //     success: true,
        //     indirect // 电子 10
        // }

        // 总业绩 
        const [total]: [any[], any] = await connection.query(
            ` SELECT gr.gameType,
            SUM(CASE WHEN ar.inviteId = ar.topId THEN gr.validBetAmount ELSE 0 END) AS direct_total,
            SUM(CASE WHEN ar.inviteId != ar.topId THEN gr.validBetAmount ELSE 0 END) AS indirect_total,
            SUM(gr.validBetAmount) AS total
            FROM agencyRelation ar
            LEFT JOIN gameRecord gr ON gr.userId = ar.userId
            WHERE ar.topId = ?
            GROUP BY gr.gameType `,
            [topId]
        )

        return {
            success: true,
            total // 220
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})