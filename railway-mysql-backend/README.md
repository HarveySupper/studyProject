# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

在资源管理器 RAILWAY-MYSQL-BACKEND server api server 下的 TS 端口，名字可以任意起，没有实际作用，只是好区分，实际还是看里面写的代码内容来决定作用。（就是个分组）

1 在资源管理器 RAILWAY-MYSQL-BACKEND server api sql 下的 mysqlStudy.sql
直接在数据库里 run ,写代码，创表。

2 创建表格： 
CREAT TABLE 

3 UPDATE 表名
  SET 要改的内容
  WHERE 根据表格内有的项目 = 数据，去查找，修改数据。

4 需求
   1. 创建一条代理线，不少于5人，层级不少于3 现有的接口插入数据
   2. 写一个接口 调用接口一次 代表某一个用户下注+10

创建在run里执行就可以了，插入，insert into

写接口，复制，改名(例如名字叫game)，代码必写 输入 输出，

# 起服务器 bun run dev 
 1. 只需要起一次，若重复起服务器，会导致地址变化(因为起第一次地址出来，再起一次服务器地址已存在被占用，再起第二次就会重新有个地址)
 会导致复制地址到thunder时，服务器端口被占用，端口地址不对，会导致后面调用接口 send 不成功。
 2. 也可以点击删除按钮，把终端刚第一次启用的服务器端口删除，删除后重新启用也是可以的，此时服务器端口地址会为第一次启用的地址，也是默认地址
 3. 若 端口 名进行修改后，需要同步端口内的代码，以及端口对应的thunder 的 地址 这样才会send 成功(修改记得保存)

# 验证
执行完以后(thunder)，需要前往DATEBASE 点击对应的table，(每次点击时相当于执行了一次SELECT * FROM)，此时会显示最新内容

然后shift+ control +` 打开终端，执行 bun run dev 获取正确地址，不然导致后面调用接口 send 不成功。

获取复制粘贴，+路径/api/game到thunder ,选对应类型post。send才有用
然后写个简单的验证下send，可以了再改下，再send 可以了就真的可以了，然后
写必写的两行代码(作用链接连接服务器)，然后其他的写，async await try 接个return catch(error) 接个return(try catch包含两个return)，括号记得检查。

执行的代码在execute 后面执行，一般写成一排，最后一个不要逗号，写完可以是分号
在接口里写东西要win+s保存，run不用

run可以将执行过的代码进行删除，无影响
接口不可以

# 创建一个触发器 CREAT TRIGGER UPDATE，让使用 UPDATE 时，同步更新另一项值= UPDATE 后该项的值。一直同步，当更新时就会同步。
 1. before_update_gameRecord
 2. 删一样用drop 加上，如果存在语句
 3. 增加时，正常create就行 
语法：
CREATE TRIGGER before_update_gameRecord
BEFORE UPDATE ON gameRecord
FOR EACH ROW
BEGIN
  SET NEW.validBetAmount = NEW.betAmount;
END ;

# 创建一个触发器 CREAT TRIGGER INSERT，让使用 INSERT 时，同步更新另一项值= INSERT 后该项的值。一直同步，当插入时就会同步。
 1. before_insert_gameRecord
  SET NEW.validBetAmount = NEW.betAmount;
 2. 插入时，括号可以少写一项，因为有 betAmount ，当插入 betAmount 时，会自动同步 validBetAmount
 3. 因此可以在插入时，少写一项
   
CREATE TRIGGER before_insert_gameRecord 
BEFORE INSERT ON gameRecord
FOR EACH ROW
BEGIN
  SET NEW.validBetAmount = NEW.betAmount;
END;

# 明天要创建接口 并行在接口中执行 SQL .
 1. 执行就是 execute 后面那一句(注意：语法错误：execute() 只能执行一条 SQL 语句，不能在里面写两条 SQL；) 
 2. 执行前需要点击DATABASE 点击对应的table更新查看，然后再前往接口写执行代码-thunder点send，返回200后，再去点table更新查看

# 创建一个接口，只写一行代码 Const body = readbody(event),return { body }
 1. thunder 选 post，填创建的接口地址路径，创建个body JSON，
   - 一般 get 选query ，post 用body，两个用那个也不是不行，但是一般大家都这么用
   - JSON 格式 {"字"： 数字 } 
 2. 创建好 点send 验证，改，验证，改，验证，好了以后去接口那里写代码
 3. 给添加的 body 赋值，然后 return 改赋值项目，注意严格区分大小写，不要写错，return中格式 是{项目，项目} 保存，
 4. thunder 验证，成功了，改，验证，成功了就继续改代码，
 5. return中，sql:即将要执行的代码，对该代码进行验证，确认会返回对应值，改，验证，改，验证
 6. 回接口写代码，写连接代码，await连接语句，还有，执行execute语句，再将刚验证好的代码拿来，检查好括号，准备执行
 7. 查看TABLE数据，send执行，查看TABLE数据，变化符合预期
 8. 搞定

从这个路径得到，从这个路径去连接

等于或大于 以下内容时输出，默认定义事件管理者 异步去执行事件  
先做一遍，（定义，赋值）
内容

执行语句，sql,
一个execute只能执行一句话、
有多的就多谢几句

结构返回，定义上面语句执行后，然后返回的内容

然后捕获到错误的情况下，（是try catch 固定yuju）

不会中断执行，还是会执行完，然后捕获到错误就返回，

定义返回内容，
1.返回成功内容（会显示的内容为）：失败
2.错误，什么错误，对错误的定义，实例错误，也是if语句简写，是这个错误就返沪这个错误，不是就返回信息内容为未知错误

INSERT INTO 表名 (表格内的项，多个用逗号隔开) VALUES (用问号安全)要逗号
接[对应项的值，多个用逗号]

JSON 格式 {
    大括号，字符串用"": 数字不用引。多个写完一个逗号
}

拼接 用反引号包${neirong}多个逗号隔开

创表有设默认值的项，后续接口插入不写就是那个默认值，所以可以不写，写没有默认项的那几个就行其他一样有。

SELECT * FROM 表名 WHERE 任意项= 什么去定位查

DELECT * FROM 表名 WHERE 任意项= 什么去定位删

创建接口顺序 创ts,去thunder选类型，body写内容，get 用query， post用body，body用json，json有格式，需要反复检查每个步骤，调用接口，也是利用return反复检查接口通不通，确定后改代码，激活连接，接口与表之间的连接（数据库与接口之间）的连接：就算连好了，语句不会，一个逗号就死定了，到处报错，找都找不到，
语句弄会了，再也不报错了。

#  使用 cd r 按tab键，回车键。连接这个railway,然后 bun i 按回车，安装bun




