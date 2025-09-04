import { query, getClient } from '../utils/db'

/**
 * 用户注册时，若未传邀请ID则直接注册，!! 主要是校验，合适就注册
 * 若有传邀请ID则判断邀请ID：不能为0，必须符合有效id规则，必须能在用户列表找到该邀请ID
 * @param inviteId 
 */
export async function userRegister(phone: string, inviteId?: number) {
    const isPhoneUnique = await uniquePhone(phone)
    if (!isPhoneUnique) throw new Error(`手机号已注册`);

    // 如果没有传邀请id，直接注册
    if (!inviteId) return await register(phone)
    // 3. 检测邀请id是否在用户表中
    if (inviteId && await uniqueId(inviteId)) {
        throw new Error(`邀请用户id对应用户不存在`);
    }
    return await register(phone, inviteId)
}

/**
 * 检测是否有有效ID
 * @param input 检测时内容必须要是字符串
 * @returns true 就是通过   false 就是不通过验证
 * 正则表达实例
 */
export function isValidId(input: number | string): boolean {
    const regex = /^[1-9]\d{5,10}$/;
    return regex.test(String(input))
}

/**
 * 生成符合规矩的随机id
 * @returns 用户ID
 */
export async function randomUserId() {
    const min = 100000
    const max = 999999999
    const count = 1000
    let valid = true
    let index = 0
    let userId = 0
    do {
        userId = min + Math.ceil(Math.random() * (max - min))
        valid = isValidId(userId) && await uniqueId(userId)
        index++
    } while (index < count && !valid);
    return userId
}

/**
 * 检测用户id是否存在userInfo表中
 * @param userId 
 * @returns true 用户不存在 false 用户存在
 */
export async function uniqueId(userId: number) {
    const { data, error } = await supabase
        .from('users')
        .select('userId')
        .eq('userId', userId)
        .maybeSingle()
    if (error) throw error
    return !data
}

/**
 * 检测手机号是否在users表中
 * @param phone 
 * @returns true 用户不存在 false 用户存在
 */
export async function uniquePhone(phone: string) {
    const { data, error } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', phone)
        .maybeSingle()
    if (error) throw error
    return !data
}

/**
 * 用户注册函数，可接受邀请ID
 * @param inviteId 可选的邀请人ID
 * 调用方式后面要接()
 */
export async function register(phone: string, inviteId?: number) {
    const userId = await randomUserId()

    if (!userId) {
        throw new Error('生成用户ID失败');
    }

    const { error } = await supabase
        .from('users')
        .insert({
            userId,
            phone
        })
    if (error) throw error
    if (!inviteId) {
        const { error: insertAgencyError } = await supabase
            .from('agencyRelation')
            .insert({
                userId,
                subId: 0,
                topId: userId,
                level: 0
            })
        if (insertAgencyError) throw insertAgencyError
    }

    if (inviteId) await addAgencyRelation(userId, inviteId)
    return userId
}

// 插入 一条数组 userId位置 插 邀请ID，  sub位置 插 注册id  ， topid不变 level= 1 
export async function addAgencyRelation(userId: number, inviteId: number) {
    const { data: inviteInfo, error: selectError } = await supabase
        .from('agencyRelation')
        .select('*')
        .eq('subId', inviteId)
    if (selectError) throw selectError

    const { error: insertFirstError } = await supabase
        .from(`agencyRelation`)
        .insert({
            userId: inviteId,
            subId: userId,
            topId: inviteInfo[0]?.topId || inviteId,
            level: 1
        })
    if (insertFirstError) throw insertFirstError

    for (let i = 0; i < inviteInfo.length; i++) {
        const item = inviteInfo[i];
        const { error: insertError } = await supabase
            .from(`agencyRelation`)
            .insert({
                userId: item.userId,
                subId: userId,
                topId: item.topId,
                level: item.level + 1
            })
        if (insertError) throw insertError
    }
}