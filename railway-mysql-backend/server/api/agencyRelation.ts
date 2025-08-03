import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { userId, inviteId, topId } = body

        const connection = await getConnection()
        const [user]: [any[], any] = await connection.query(
            ` SELECT * FROM agencyRelation
              WHERE userId = ?`,
            [userId]
        )
        await connection.query(
            `SELECT SUM("betAmount") AS totalBetAmount
            FROM gameRecord
            WHERE agencyRelation.inviteid = ?
            AND gameRecord.gameType = slot,
            [inviteId]`
        )
        return {
            success: true,
            message: "totalBetAmount"
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})