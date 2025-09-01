import z from "zod"

export default defineEventHandler(async (event) => {
    const param = await readValidatedBody(event, z.object({
        userId: z.string(),
        inviteId: z.string().optional()
    }).parse)

    const { data, error } = await supabase
        .from('users')
        .insert([
            { username: 'john_doe', email: 'john@example.com', password: 'hashed_password' }
        ])
        .select()
    return {
        data,
    }
})