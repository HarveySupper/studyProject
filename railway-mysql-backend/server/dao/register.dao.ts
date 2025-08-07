/**
 * 用户注册时，若未传邀请ID则直接注册，
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
    // if (inviteId && !isValidId(inviteId.toString())) {
    //     throw new Error(`邀请id不符合6-11为正整数规则`);
    // }
    if (inviteId && !isValidId(inviteId)) {
        throw new Error(`邀请id不符合6-11为正整数规则`);
    }
    // 3. 检测邀请id是否在用户表中
    if(inviteId && await uniqueId(inviteId)) {
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
export function isValidId(input: number): boolean {
    const regex = /^[1-9]\d{5,10}$/;
    return regex.test(String(input))
}
// export function isValidId(input: string | number): boolean {
//     const regex = /^[1-9]\d{5,10}$/;
//     return regex.test(input);
// }

/**
 * 生成符合规矩的随机id
 * @returns 用户ID
 */
// export async function randomUserId() {
//     const min = 100000
//     const max = 999999999
//     const count = 1000
//     let valid = true
//     let index = 0
//     let userId = 0
//     do {
//         userId = min + Math.ceil(Math.random() * (max - min))
//         valid = isValidId(userId.toString()) && await uniqueId(userId)
//         index++
//     } while (index < count && !valid);
//     return userId
// }
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
export async function uniqueId(userId:number) {
    const connection = await getConnection()
    const [user]: [any[], any] = await connection.query(
        ` SELECT * FROM userInfo WHERE userId = ?`,
        [userId]
    )
    return !user || user.length === 0
}

/**
 * 用户注册函数，可接受邀请ID
 * @param inviteId 可选的邀请人ID
 * 调用方式后面要接()
 */
export async function register(inviteId?: number) {
    const connection = await getConnection()
    const userId = await randomUserId()

    if(!userId) {
        throw new Error('生成用户ID失败');
    }
    try {
        await connection.execute(
           `INSERT INTO userInfo (userId, inviteId) VALUES(?,?)`,
           [userId, inviteId ?? null] 
        )
    } catch (error) {
        console.error('注册用户失败：', error);
        throw new Error('注册用户失败')
    }
}
