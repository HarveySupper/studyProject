import { userRegister } from "../dao/register.dao"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { inviteId } = body
        const userId = await userRegister(inviteId)
        return {
            success: true,
            message: `用户${userId}注册成功`
        }
    } catch (error) {
        return {
            success: false,
            message: (error as any).message
        }
    }
})