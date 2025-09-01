import { createClient } from '@supabase/supabase-js'
import { query, getClient, getPool } from '../utils/db'
import dotenv from 'dotenv'

dotenv.config()

// Supabase客户端初始化
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Supabase操作示例集合
 * 包含了常用的数据库操作、认证、实时订阅、存储等功能
 */

// ==================== 1. 基础数据库操作 ====================

/**
 * 插入数据示例
 */
export async function insertExample() {
  // 方法1: 使用Supabase客户端
  const { data, error } = await supabase
    .from('users')
    .insert([
      { username: 'john_doe', email: 'john@example.com', password: 'hashed_password' }
    ])
    .select()

  if (error) throw error
  return data

  // 方法2: 使用原生PostgreSQL
  const result = await query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    ['john_doe', 'john@example.com', 'hashed_password']
  )
  return result.rows[0]
}

/**
 * 查询数据示例
 */
export async function selectExample() {
  // 简单查询
  const { data: allUsers } = await supabase
    .from('users')
    .select('*')

  // 条件查询
  const { data: specificUser } = await supabase
    .from('users')
    .select('id, username, email')
    .eq('username', 'john_doe')
    .single()

  // 复杂查询：关联查询
  const { data: usersWithPosts } = await supabase
    .from('users')
    .select(`
      id,
      username,
      posts (
        id,
        title,
        content
      )
    `)

  // 分页查询
  const { data: paginatedUsers } = await supabase
    .from('users')
    .select('*')
    .range(0, 9) // 获取前10条
    .order('created_at', { ascending: false })

  return { allUsers, specificUser, usersWithPosts, paginatedUsers }
}

/**
 * 更新数据示例
 */
export async function updateExample() {
  // 更新单条记录
  const { data, error } = await supabase
    .from('users')
    .update({ email: 'newemail@example.com' })
    .eq('username', 'john_doe')
    .select()

  // 批量更新
  const { data: batchUpdate } = await supabase
    .from('posts')
    .update({ status: 'published' })
    .in('id', [1, 2, 3])
    .select()

  return { data, batchUpdate }
}

/**
 * 删除数据示例
 */
export async function deleteExample() {
  // 删除单条
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', 1)

  // 条件删除
  const { error: conditionalDelete } = await supabase
    .from('posts')
    .delete()
    .lt('created_at', new Date('2024-01-01').toISOString())

  return { error, conditionalDelete }
}

/**
 * Upsert操作示例（插入或更新）
 */
export async function upsertExample() {
  const { data, error } = await supabase
    .from('users')
    .upsert([
      { id: 1, username: 'updated_user', email: 'updated@example.com' },
      { username: 'new_user', email: 'new@example.com' }
    ])
    .select()

  return data
}

// ==================== 2. 高级查询操作 ====================

/**
 * 过滤器示例
 */
export async function filterExample() {
  // 等于
  const { data: eq } = await supabase
    .from('users')
    .select('*')
    .eq('username', 'john_doe')

  // 不等于
  const { data: neq } = await supabase
    .from('users')
    .select('*')
    .neq('status', 'inactive')

  // 大于/小于
  const { data: gt } = await supabase
    .from('posts')
    .select('*')
    .gt('views', 100)
    .lt('views', 1000)

  // IN 查询
  const { data: inQuery } = await supabase
    .from('users')
    .select('*')
    .in('id', [1, 2, 3])

  // LIKE 查询
  const { data: like } = await supabase
    .from('users')
    .select('*')
    .like('email', '%@gmail.com')

  // IS NULL
  const { data: isNull } = await supabase
    .from('users')
    .select('*')
    .is('deleted_at', null)

  return { eq, neq, gt, inQuery, like, isNull }
}

/**
 * 聚合函数示例
 */
export async function aggregateExample() {
  // COUNT
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // 使用原生SQL进行复杂聚合
  const result = await query(`
    SELECT 
      COUNT(*) as total_users,
      COUNT(DISTINCT email) as unique_emails,
      MAX(created_at) as latest_user,
      MIN(created_at) as first_user
    FROM users
  `)

  return { count, aggregates: result.rows[0] }
}

// ==================== 3. 事务处理 ====================

/**
 * 事务示例
 */
export async function transactionExample() {
  const client = await getClient()

  try {
    await client.query('BEGIN')

    // 创建用户
    const userResult = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      ['transaction_user', 'trans@example.com', 'password']
    )
    const userId = userResult.rows[0].id

    // 创建相关的profile
    await client.query(
      'INSERT INTO profiles (user_id, full_name, bio) VALUES ($1, $2, $3)',
      [userId, 'Transaction User', 'Created in transaction']
    )

    // 记录日志
    await client.query(
      'INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)',
      [userId, 'user_created']
    )

    await client.query('COMMIT')
    return { success: true, userId }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// ==================== 4. 实时订阅 ====================

/**
 * 实时订阅示例
 */
export function realtimeExample() {
  // 订阅所有变化
  const allChanges = supabase
    .channel('all-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      (payload) => {
        console.log('Change received:', payload)
      }
    )
    .subscribe()

  // 订阅特定事件
  const insertOnly = supabase
    .channel('insert-only')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'users' },
      (payload) => {
        console.log('New user:', payload.new)
      }
    )
    .subscribe()

  // 带过滤条件的订阅
  const filteredSub = supabase
    .channel('filtered-posts')
    .on('postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts',
        filter: 'status=eq.published'
      },
      (payload) => {
        console.log('Published post updated:', payload)
      }
    )
    .subscribe()

  // 取消订阅
  // allChanges.unsubscribe()

  return { allChanges, insertOnly, filteredSub }
}

// ==================== 5. 存储操作 ====================

/**
 * 文件存储示例
 */
export async function storageExample() {
  // 上传文件
  const file = new File(['Hello World'], 'hello.txt', { type: 'text/plain' })

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload('public/hello.txt', file)

  // 获取公开URL
  const { data: publicUrl } = supabase.storage
    .from('avatars')
    .getPublicUrl('public/hello.txt')

  // 下载文件
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from('avatars')
    .download('public/hello.txt')

  // 列出文件
  const { data: files, error: listError } = await supabase.storage
    .from('avatars')
    .list('public', {
      limit: 100,
      offset: 0
    })

  // 删除文件
  const { data: deleteData, error: deleteError } = await supabase.storage
    .from('avatars')
    .remove(['public/hello.txt'])

  return { uploadData, publicUrl, files }
}

// ==================== 6. RPC调用 ====================

/**
 * RPC函数调用示例
 */
export async function rpcExample() {
  // 调用存储过程或函数
  const { data, error } = await supabase
    .rpc('get_user_stats', { user_id: 1 })

  // 带参数的RPC调用
  const { data: searchResults } = await supabase
    .rpc('search_posts', {
      search_query: 'typescript',
      limit_count: 10
    })

  return { data, searchResults }
}

// ==================== 7. 批量操作优化 ====================

/**
 * 批量插入优化示例
 */
export async function bulkInsertExample() {
  const users = Array.from({ length: 1000 }, (_, i) => ({
    username: `user_${i}`,
    email: `user${i}@example.com`,
    password: 'hashed_password'
  }))

  // 方法1: Supabase批量插入
  const { data, error } = await supabase
    .from('users')
    .insert(users)
    .select()

  // 方法2: 使用原生PostgreSQL COPY命令（最快）
  const client = await getClient()
  try {
    const values = users.map(u =>
      `('${u.username}', '${u.email}', '${u.password}')`
    ).join(',')

    await client.query(`
      INSERT INTO users (username, email, password) 
      VALUES ${values}
    `)
  } finally {
    client.release()
  }

  return { inserted: users.length }
}

// ==================== 8. 错误处理示例 ====================

/**
 * 错误处理最佳实践
 */
export async function errorHandlingExample() {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ username: 'test' }]) // 缺少必需字段
      .select()

    if (error) {
      // Supabase错误处理
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })

      // 根据错误类型处理
      if (error.code === '23505') {
        throw new Error('用户名已存在')
      } else if (error.code === '23502') {
        throw new Error('缺少必填字段')
      } else {
        throw error
      }
    }

    return data
  } catch (err) {
    // 全局错误处理
    console.error('Operation failed:', err)
    throw err
  }
}

// ==================== 9. 性能优化示例 ====================

/**
 * 查询优化示例
 */
export async function performanceExample() {
  // 1. 只选择需要的字段
  const { data: optimizedSelect } = await supabase
    .from('users')
    .select('id, username') // 不要用 select('*')

  // 2. 使用索引提示
  const indexedQuery = await query(`
    SELECT * FROM users 
    WHERE email = $1 
    -- 确保email字段有索引
  `, ['test@example.com'])

  // 3. 连接池复用
  const pool = getPool()
  const results = await Promise.all([
    pool.query('SELECT COUNT(*) FROM users'),
    pool.query('SELECT COUNT(*) FROM posts'),
    pool.query('SELECT COUNT(*) FROM comments')
  ])

  // 4. 使用EXPLAIN分析查询
  const explainResult = await query(`
    EXPLAIN ANALYZE 
    SELECT u.*, p.* 
    FROM users u 
    JOIN posts p ON u.id = p.user_id 
    WHERE u.created_at > '2024-01-01'
  `)

  return {
    optimizedSelect,
    indexedQuery: indexedQuery.rows,
    counts: results.map(r => r.rows[0].count),
    queryPlan: explainResult.rows
  }
}

// ==================== 10. 数据验证示例 ====================

/**
 * 数据验证和清理
 */
export async function validationExample() {
  // 输入验证
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function sanitizeInput(input: string): string {
    // 防止SQL注入（虽然参数化查询已经安全）
    return input.replace(/[';\\]/g, '')
  }

  // 使用验证
  const email = 'user@example.com'
  const username = "user'; DROP TABLE users;--"

  if (!validateEmail(email)) {
    throw new Error('Invalid email format')
  }

  const safeUsername = sanitizeInput(username)

  // 安全插入
  const { data, error } = await supabase
    .from('users')
    .insert([{
      username: safeUsername,
      email: email,
      password: 'hashed_password'
    }])
    .select()

  return data
}

// 导出所有示例函数
export default {
  insertExample,
  selectExample,
  updateExample,
  deleteExample,
  upsertExample,
  filterExample,
  aggregateExample,
  transactionExample,
  realtimeExample,
  storageExample,
  rpcExample,
  bulkInsertExample,
  errorHandlingExample,
  performanceExample,
  validationExample
}