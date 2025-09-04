import z from "zod"
import { isValidId, userRegister } from "~~/server/dao/register.dao"

export default defineEventHandler(async (event) => {
    const param = await readValidatedBody(event, z.object({
        phone: z.string().regex(/^(?!52)\d{2}9[1-9]\d{7}$/, "巴西手机号格式不正确"),
        inviteId: z.number().optional().refine(val => {
            if (val === undefined) return true;
            if (val === 0) throw new Error('邀请id不能为0');
            if (!isValidId(val.toString())) throw new Error('邀请id不符合6-11为正整数规则');
            return true;
        }, { message: '邀请id校验失败' }),
        password: z.string().min(6).max(12)
    }).parse)

    const userId = await userRegister(param.phone, param.inviteId)

    return {
        userId
    }
})