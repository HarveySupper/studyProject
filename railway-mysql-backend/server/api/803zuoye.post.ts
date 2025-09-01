// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { inviteId, topId, userId, gameType } = body

        const connection = await getConnection()

        // 统计某个用户对应游戏类型的团队业绩、直属业绩和总业绩。 
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