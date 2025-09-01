import { query, getClient } from '../utils/db'

/**
 * 用户注册时，若未传邀请ID则直接注册，!! 主要是校验，合适就注册
 * 若有传邀请ID则判断邀请ID：不能为0，必须符合有效id规则，必须能在用户列表找到该邀请ID
 * @param inviteId 
 */
export async function userRegister(inviteId?: number) {
    // 如果没有传邀请id，直接注册
    if (!inviteId) await register()
    // 1. 校验参数
    if (inviteId === 0) {
        throw new Error(`邀请id不能为0`);
    }
    // 2. 检测邀请id是否合规
    if (inviteId && !isValidId(inviteId)) {
        throw new Error(`邀请id不符合6-11为正整数规则`);
    }
    // 3. 检测邀请id是否在用户表中
    if (inviteId && await uniqueId(inviteId)) {
        throw new Error(`邀请用户id对应用户不存在`);
    }
    await register(inviteId)
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
    const result = await query(
        'SELECT * FROM userInfo WHERE userId = $1',
        [userId]
    )
    return !result.rows || result.rows.length === 0
}

/**
 * 用户注册函数，可接受邀请ID
 * @param inviteId 可选的邀请人ID
 * 调用方式后面要接()
 */
export async function register(inviteId?: number) {
    const userId = await randomUserId()

    if (!userId) {
        throw new Error('生成用户ID失败');
    }
    try {
        await query(
            'INSERT INTO userInfo (userId, inviteId) VALUES($1, $2)',
            [userId, inviteId ?? null]
        )
    } catch (error) {
        console.error('注册用户失败：', error);
        throw new Error('注册用户失败')
    }
}

// 插入 一条数组 userId位置 插 邀请ID，  sub位置 插 注册id  ， topid不变 level= 1 
export async function addAgencyRelation(userId: number, inviteId: number) {
    const client = await getClient()
    try {
        await client.query('BEGIN')

        const subResult = await client.query(
            'SELECT * FROM agencyRelationLevel WHERE subId = $1',
            [inviteId]
        )

        await client.query(
            'INSERT INTO agencyRelationLevel (userId, subId, topId, level) VALUES($1, $2, $3, $4)',
            [inviteId, userId, subResult.rows[0].topId, 1]
        )

        for (let i = 0; i < subResult.rows.length; i++) {
            const item = subResult.rows[i];
            await client.query(
                'INSERT INTO agencyRelationLevel (userId, subId, topId, level) VALUES($1, $2, $3, $4)',
                [item.userId, userId, item.topId, item.level]
            )
        }

        await client.query('COMMIT')
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('注册用户失败：', error);
        throw new Error('注册用户失败')
    } finally {
        client.release()
    }
}