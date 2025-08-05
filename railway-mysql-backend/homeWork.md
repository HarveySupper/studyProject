- 2025 07 31
  需求；实现一个玩家注册接口，接口传入两个，用户id和上级id，调用接口，实现往gameRecord和commission两个表中插入对应用户数据，时间为当天。

  # 判断用户id的唯一性，真实性
  需求：实现一个玩家下注接口，接口传入参数有两个，用户id和下注金额，要求做到以下三种情况：
   1. 用户id在表中已存在更新下注金额
   2. 用户id在表中不存在插入一条记录并更新下注金额
   3. 用户id非法：例如，用户id输入的是空或者空字符串等一系列不为数字的值不进行任何操作，并且返回一个错误

# 实现需求
   1. 用户ID必须存在 不能为空if (!userId || userId === " ")
    - 为空时，返回一个错误'用户ID必须输入'
    - == null 会同时判断 null 和 undefined。if (userId == null || userId === '')
    - 只针对 "未传或空字符串" 的情况。
    - 拦截空值（如 null, undefined, "", " "）
   2. 用户ID为必须为正整数（数字类型）
    - 拦截负数，非整数(小数)，null, undefined，" "，""，0(必须大于0),
     - if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) 
   3. 获取用户信息
      - if (!user || user.length === 0)
        - 查找数组信息，数组长度为0，就是不存在。 
      - 如果用户不存在，就插入条新的该用户信息,插入时，:
          - if (inviteId !== undefined && inviteId !== null)
          - 如果body有传inviteId,就插入用户ID，邀请ID, 投注金额
            - 插入后返回：'查不到数据，已插入新记录'
          - else
          - 没传，就插入用户ID，投注金额(邀请ID走创表默认值)
            - 插入后返回：'查不到数据，已插入新记录'
      - else
      - 如果用户存在，就根据用户ID更新投注金额
        - 更新后返回：'查到了数据，已更新记录'
    return {
        success: true,
        message: '投注金额更新成功'
    }

#
// 判断用户ID
    // 1. 用户ID为空时，返回啥
    // 2. 用户ID不为数字，返回啥 
    // 3. 用户ID为负数的情况，返回啥，
    // 4. 投注金额必须存在 不能为空
    // 5. 投注金额必须为数字
    // 6. 投注金额必须为正整数
    // 获取用户信息 
    const [user]: [any[], any]意思是：
	•	user 是从 [any[], any] 的第一个位置解构来的
	•	整个结果是一个元组：[查询结果数组, 字段信息]
	•	any[]：查询返回的结果数组（每行数据是一个对象）
	•	any：字段的元信息（一般没用到，可以忽略）
    const [user]: [any[], any]= await connection.query('SELECT * FROM gameRecord WHERE userId = ?', [userId])
    // 如果用户不存在，就插入该用户信息，用户ID 和投注金额
    
    // 如果用户存在，更新投注金额

要求：
1. 不要告诉模棱两可答案
2. 只承认最后的结果
3. 只提供解决问题思路，不告诉代码怎么写


第一：要用if实现这个需求（这就是逻辑）
第二：你非要你所说的其他方法，我说我不知道你指的是哪个，也不知道怎么实现（我没有撒谎，或者不懂装懂吧）

然后提到的代码不会，怎么证明if就可以，？ 我都不会代码，我怎么证明？ 我只能说如果存在就不插入，你可以评价我的答案不是你要的，但是我有逻辑。

你不能说我没逻辑，说我很差之类的，说我撒谎？

没有就是没有，有就是有、、、

接受不接受我是一回事，但是不能无中生有，你可以说你很讨厌我的答案，但是不能冤枉我撒谎，或者否定我本来就有的东西

2. 把示例写给我，不懂汇总，回答 。
   
1，贬低，不写任何代码，引导找到结果，不承认






# 2025-08-02 用户代理关系
1. 整理gameRecord表，让gameRecord表内的数据功能更单一。
2. 设计代理关系表，需要做到可查询整条代理线所有用户、某个用户的所有直属下级、某个用户的所有团队下级。
3. 写出一个语句，统计某个用户对应游戏类型的团队业绩、直属业绩和总业绩。

# 实现需求
1. 整理gameRecord表
   - 目前表内有自增id, 用户id, 邀请id, 游戏厂商，游戏类型， 投注金额， 计算有效投注方式，游戏输赢，下注时间
   - 自增id:由于该表是用来记录每一局游戏的游戏对局记录表，可能用户id会重复出现在多行 该项不用填
   - 邀请id:接口有做限制，传进来的邀请id必须是表里已存在的用户id 该项可不填
   - 游戏厂商与游戏类型不传时，默认会随机填入一个厂商（厂商内容已提供，且限制对应厂商有的游戏类型，根据该限制进行随机填入）该项可不填
   - 游戏类型，未传时，会根据 NEW.gameVendor，从允许的类型里随机挑一个gameType填入。该项可不填
   - 投注金额，接口有做限制为正整数
   - 计算有效投注方式，根据游戏厂商来默认传值，接口插入新数据时，该项可不填
   - 游戏输赢，想做个按返奖率的，但是未能成功实现，不知道哪个步骤有问题，有尝试函数调用，好像不行，需要帮助
   - 下注时间没变，默认当前时间戳
  
 2. 代理关系表 
   - 可查询整条代理线所有用户
  `SELECT * FROM agencyRelation WHERE topId = ?`,
  [topId]

   - 某个用户的所有直属下级
  `SELECT * FROM agencyRelation  WHERE inviteId = ?`,
  [inviteId]

   - 某个用户的所有团队下级(除直属)。topId, inviteId 需要是同一个会员id
  `SELECT *
  FROM agencyRelation
  WHERE
  topId = ? AND inviteId != ?`,
  [topId, inviteId]

  
 3. 写出一个语句
  - 统计某个用户对应游戏类型的团队业绩、直属业绩和总业绩。
- 新语法(有条件地求和)：SUM(CASE WHEN 条件 THEN 数值 ELSE 0 END)
   对满足某个条件的行，才把指定的值加进总和；不满足的就加 0。
   ` SELECT gr.gameType,
    SUM(CASE WHEN ar.inviteId = ar.topId THEN gr.validBetAmount ELSE 0 END) AS direct_total,
    SUM(CASE WHEN ar.inviteId != ar.topId THEN gr.validBetAmount ELSE 0 END) AS indirect_total,
    SUM(gr.validBetAmount) AS total
    FROM agencyRelation ar
    LEFT JOIN gameRecord gr ON gr.userId = ar.userId
    WHERE ar.topId = ?
    GROUP BY gr.gameType `,
    [topId]

// “主表”写在 FROM 位置，再用 LEFT JOIN 连接“次表”
-  WHERE 放后面，不可写进JOIN ... ON 
SELECT SUM(gr.validBetAmount) AS total
FROM agencyRelation ar
LEFT JOIN gameRecord gr ON gr.userId = ar.userId AND gr.gameType = ?
WHERE ar.inviteId = ?
[gameType, inviteId]


  // 捕鱼
  SELECT SUM(validBetAmount) AS totalBetAmount2 FROM gameRecord RIGHT JOIN agencyRelation ON gameRecord.userId = agencyRelation.userId WHERE agencyRelation.inviteId = ? AND gameRecord.gameType = 'fish'

  // 棋牌
  SELECT SUM(validBetAmount) AS totalBetAmount3 FROM gameRecord RIGHT JOIN agencyRelation ON gameRecord.userId = agencyRelation.userId WHERE agencyRelation.inviteId = ? AND gameRecord.gameType = 'card'

  // 视讯
  SELECT SUM(validBetAmount) AS totalBetAmount4 FROM gameRecord RIGHT JOIN agencyRelation ON gameRecord.userId = agencyRelation.userId WHERE agencyRelation.inviteId = ? AND gameRecord.gameType = 'casino'


找 183887333 的直属 和团队，
只能是邀请ID 不能拿topid
找他的直属有谁。找他的团队有谁。

890099 找到他的所有上级 先写一个句子找到topid,这样才能用topID
尽量只用一个？问号(明文) 外部传入的东西叫明文

group by

创了两个表，一个新的游戏记录表
一个代理关系等级表，

代理关系等级表：该条线的顶级id，等级为0，把每个层级进行排序，排序后有，userId subId topId level
可通过这个表进行查找：从下往上找该条线的人

新表 math.abs()绝对值。 插入投注记录