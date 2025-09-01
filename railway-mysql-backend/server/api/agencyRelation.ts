// import { getConnection } from '../utils/db'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { inviteId, topId } = body

        const connection = await getConnection()
        // 查询整条代理线所有用户(=顶级ID是他查出来的会员)
        const [agency]: [any[], any] = await connection.query(
            ` SELECT * FROM agencyRelation
            WHERE topId = ? `,
            [topId]
        )
        // return {
        //     success: true,
        //     agency
        // }


        // 查询某个用户的所有直属(=邀请ID是他查出来的会员)
        const [direct]: [any[], any] = await connection.query(
            ` SELECT * FROM agencyRelation
              WHERE inviteId = ? `,
            [inviteId]
        )
        // return {
        //     success: true,
        //     direct
        // }

        // 查询用户的搜有团队下级，除直属(=顶级ID是他但不等于查出来的会员)
        const [indirect]: [any[], any] = await connection.query(
            ` SELECT * FROM agencyRelation
              WHERE topId = ? AND inviteId != ?`,
            [topId, inviteId]
        )
        return {
            success: true,
            agency,
            direct,
            indirect
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})