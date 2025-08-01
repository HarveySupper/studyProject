# Railway MySQL Backend Study Project

这是一个使用 Nuxt 服务器框架连接 Railway MySQL 数据库的学习项目。

## 项目结构

```
railway-mysql-backend/
├── server/
│   ├── api/
│   │   ├── test-connection.get.ts  # 测试数据库连接
│   │   └── users.get.ts           # 用户查询示例
│   └── utils/
│       └── db.ts                   # 数据库连接工具
├── .env                            # 环境变量配置
├── nuxt.config.ts                  # Nuxt 配置文件
└── package.json                    # 项目依赖

```

## 设置步骤

1. 配置 Railway MySQL 数据库连接信息，编辑 `.env` 文件：

```env
DATABASE_HOST=your-railway-mysql-host
DATABASE_PORT=your-port
DATABASE_NAME=your-database-name
DATABASE_USER=your-username
DATABASE_PASSWORD=your-password
```

2. 安装依赖：
```bash
bun install
```

3. 运行开发服务器：
```bash
bun run dev
```

## API 端点

- `GET /api/test-connection` - 测试数据库连接
- `GET /api/users` - 获取用户列表（需要创建 users 表）

## 技术栈

- Nuxt 4 - 全栈框架
- MySQL2 - MySQL 数据库驱动
- Bun - JavaScript 运行时和包管理器

jhhhhhh