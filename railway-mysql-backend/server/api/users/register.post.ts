import z from "zod"

export default defineEventHandler(async (event) => {
    const param = await readValidatedBody(event, z.object({
        userId: z.number().transform((val) => {
            if (val === 0) {
                throw new Error(`用户id不能为0`);
            }
            return val
        }),
        inviteId: z.string().optional()
    }).parse)

    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                username: "john_doe", password: 'hashed_password', email: "john@example.com"
            }
        ])
        .select()

    return {
        data,
        error
    }
})