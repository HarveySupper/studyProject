CREATE TABLE IF NOT EXISTS userInfo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nickname VARCHAR(50) NOT NULL,
    bet BIGINT NOT NULL DEFAULT 0,
    recharge BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS userInfoDay (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    data DATE NOT NULL,
    bet BIGINT NOT NULL DEFAULT 0,
    recharge BIGINT NOT NULL DEFAULT 0
)

INSERT INTO
    userInfo (nickname, bet, recharge)
VALUES ('用户1', DEFAULT, DEFAULT),
    ('用户2', DEFAULT, DEFAULT),
    ('用户3', DEFAULT, DEFAULT),
    ('用户4', DEFAULT, DEFAULT),
    ('用户5', DEFAULT, DEFAULT);

INSERT INTO
    userInfoDay (userId, data, bet, recharge)
VALUES (1, '2025-07-29', 100, 1000);

ALTER TABLE userInfoDay ADD Withdraw BIGINT NOT NULL DEFAULT 0;

UPDATE userInfoDay
SET
    Withdraw = 100
WHERE
    userId = 1
    AND data = '2025-07-29';

DELETE FROM userInfo WHERE id = 5;

ALTER TABLE userInfo ADD Withdraw BIGINT NOT NULL DEFAULT 0

CREATE TABLE IF NOT EXISTS messages1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    author VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE messages1;

SELECT id, register_time, nickname, bet, recharge FROM userInfo;

UPDATE userInfo SET nickname = '用户1' WHERE id = 4;

SELECT DISTINCT nickname FROM userInfo;

SELECT * FROM userInfo WHERE nickname LIKE '用%' ORDER BY id DESC

SELECT *
FROM userInfo
    INNER JOIN userInfoDay ON userInfo.id = userInfoDay.id
    --不去重，以ID为首列进行合并查询

SELECT bet
FROM userInfo
UNION
SELECT bet
FROM userInfoDay
    -- 去重，合并查询

UPDATE userInfoDay SET bet = 200 WHERE id =

INSERT INTO
    userInfoDay (
        id,
        userId,
        data,
        bet,
        recharge,
        Withdraw
    )
VALUES (
        2,
        2,
        '2025-07-29',
        200,
        500,
        100
    );

SELECT *
FROM userInfo mm
    RIGHT JOIN userInfoDay nn ON mm.id = nn.id
    -- 左右连接不去重   左连接，以左表为基准，左边不动(保留），右表完整连过来。右连接同理

CREATE TABLE IF NOT EXISTS gameRcord (
    userId INT(11) NOT NULL,
    inviteId INT(11),
    gameType VARCHAR(4) NOT NULL DEFAULT '电子',
    betAmount INT(10) NOT NULL DEFAULT 0,
    validBetAmount INT(10) NOT NULL DEFAULT 0,
    countValidBetWay VARCHAR(4) NOT NULL DEFAULT '按投注',
    betDay DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commission (
    userId INT(11) NOT NULL,
    inviteId INT(11),
    subBet INT(10) NOT NULL DEFAULT 0,
    teamBet INT(10) NOT NULL DEFAULT 0,
    totalBet INT(10) NOT NULL DEFAULT 0,
    subCommission INT(10) NOT NULL DEFAULT 0,
    teamCommission INT(10) NOT NULL DEFAULT 0,
    totalCommission INT(10) NOT NULL DEFAULT 0,
    checkTime DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE gameRcord;

INSERT INTO
    gameRcord (
        userId,
        inviteId,
        gameType,
        betAmount,
        validBetAmount,
        countValidBetWay
    )
VALUES (
        18388733,
        NULL,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        '按投注'
    ),
    (
        183976733,
        18388733,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        '按投注'
    ),
    (
        183123133,
        18388733,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        '按投注'
    ),
    (
        18388733,
        183123133,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        '按投注'
    ),
    (
        2283948,
        183976733,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        '按投注'
    );

DELIMITER / /

CREATE TRIGGER before_insert_gameRecord
BEFORE INSERT ON gameRecord
FOR EACH ROW
BEGIN
  SET NEW.validBetAmount = NEW.betAmount;
END;
//

CREATE TRIGGER before_insert_gameRecord
BEFORE INSERT ON gameRecord
FOR EACH ROW
BEGIN
  SET NEW.validBetAmount = NEW.betAmount;
END;

CREATE TRIGGER before_update_gameRecord
BEFORE UPDATE ON gameRecord
FOR EACH ROW
BEGIN
  SET NEW.validBetAmount = NEW.betAmount;
END ;

UPDATE gameRecord
SET
    betAmount = betAmount + 10
WHERE
    userId = 2283948;

INSERT INTO
    gameRecord (
        userId,
        inviteId,
        gameType,
        betAmount,
        validBetAmount,
        countValidBetWay
    )
VALUES (
        987747422,
        2283948,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        '按投注'
    )

DROP TRIGGER IF EXISTS before_insert_gameRecord;

INSERT INTO
    gameRecord (
        userId,
        inviteId,
        gameType,
        betAmount,
        countValidBetWay
    )
VALUES (
        987747422,
        2283948,
        DEFAULT,
        20,
        '按投注'
    )

CREATE TRIGGER before_update_commission
BEFORE UPDATE ON commission
FOR EACH ROW
BEGIN
  SET NEW.totalBet = NEW.subBet + NEW.teamBet;
END ;

CREATE TABLE IF NOT EXISTS newgameRcord (
    userId INT(11) NOT NULL,
    inviteId INT(11),
    gameType VARCHAR(4) NOT NULL DEFAULT 'slot',
    betAmount INT(10) NOT NULL DEFAULT 0,
    validBetAmount INT(10) NOT NULL DEFAULT 0,
    countValidBetWay VARCHAR(4) NOT NULL DEFAULT '按投注',
    betDay DATETIME DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE gameRecord
MODIFY COLUMN countValidBetWay VARCHAR(9);

ALTER TABLE gameRecord
MODIFY COLUMN countValidBetWay ENUM('byBet', 'byWinLose') NOT NULL DEFAULT 'byBet',
ADD COLUMN gameResult DECIMAL(10) DEFAULT 0 COMMENT '游戏输赢金额，正为赢，负为输';

UPDATE gameRecord
SET countValidBetWay = CASE
  WHEN countValidBetWay = '按投注' THEN 'byBet'
  WHEN countValidBetWay = '按输赢' THEN 'byWinLose'
  ELSE NULL
END;

UPDATE gameRecord
SET countValidBetWay = 'byBet'

ALTER TABLE gameRecord
MODIFY COLUMN gameResult DECIMAL(10,2) DEFAULT 0 COMMENT '游戏输赢金额，正为赢，负为输' AFTER countValidBetWay;

ALTER TABLE gameRecord
MODIFY COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP AFTER gameResult;

ALTER TABLE gameRecord
MODIFY COLUMN gameResult INT(10) DEFAULT 0 COMMENT '游戏输赢金额，正为赢，负为输' AFTER countValidBetWay;

ALTER TABLE gameRecord
MODIFY COLUMN betDay DATETIME AFTER gameResult;

ALTER TABLE gameRecord
ADD COLUMN gameVendor ENUM('PP','FaChai','POPOK','G759','CP','Spribe','Evolution','JBD','Evoplay','CQ9','Tada','PG') 
AFTER inviteId;
-- 先填 fish 类型的（只用 Tada）
UPDATE gameRecord
SET gameVendor = 'Tada'
WHERE `gameTYpe` = 'fish';

-- 再填 slot 类型的（从多个厂商中随机一个）
UPDATE gameRecord
SET gameVendor = ELT(FLOOR(1 + RAND() * 11),
  'PP','FaChai','POPOK','G759','CP','Spribe',
  'Evolution','JBD','Evoplay','CQ9','PG')
WHERE gameTYpe = 'slot';

ALTER TABLE gameRecord
CHANGE COLUMN gameTYpe gameType ENUM('slot', 'fish', 'live', 'card') NOT NULL COMMENT '游戏类型';

DELIMITER $$

ALTER TABLE gameRecord
ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST;

DELIMITER $$

CREATE TRIGGER set_valid_bet_amount_on_insert
BEFORE INSERT ON gameRecord
FOR EACH ROW
BEGIN
  IF NEW.countValidBetWay = 'byBet' THEN
    SET NEW.validBetAmount = NEW.betAmount;
  ELSEIF NEW.countValidBetWay = 'byWinLose' THEN
    SET NEW.validBetAmount = ABS(NEW.gameResult);
  END IF;
END$$

DELIMITER ;
DROP TRIGGER IF EXISTS set_valid_strategy_on_insert;= 'gameRecord';

SHOW TRIGGERS WHERE `Table` = 'gameRecord'

ALTER TABLE gameRecord
CHANGE validBetStrategy countValidBetWay ENUM('byBet', 'byWinLose') NOT NULL DEFAULT 'byBet' COMMENT '计算有效投注方式';

DELIMITER $$

CREATE TRIGGER set_valid_bet_way_by_vendor_on_update
BEFORE UPDATE ON gameRecord
FOR EACH ROW
BEGIN
  IF NEW.gameVendor = 'Spribe' THEN
    SET NEW.countValidBetWay = 'byWinLose';
  ELSE
    SET NEW.countValidBetWay = 'byBet';
  END IF;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER auto_fill_gameVendor_gameType_update
BEFORE UPDATE ON gameRecord
FOR EACH ROW
BEGIN
  -- 如果 gameVendor 或 gameType 为空，随机合法组合
  IF NEW.gameVendor IS NULL OR NEW.gameVendor = ''
     OR NEW.gameType IS NULL OR NEW.gameType = '' THEN

    -- 生成一个随机合法组合
    SET @rand := FLOOR(1 + RAND() * 13); -- 总共 13 个合法组合（按你之前列的）

    CASE @rand
      WHEN 1 THEN SET NEW.gameVendor = 'PG';       SET NEW.gameType = 'slot';
      WHEN 2 THEN SET NEW.gameVendor = 'Spribe';   SET NEW.gameType = 'slot';
      WHEN 3 THEN SET NEW.gameVendor = 'Evolution';SET NEW.gameType = 'casino';
      WHEN 4 THEN SET NEW.gameVendor = 'Tada';     SET NEW.gameType = 'slot';
      WHEN 5 THEN SET NEW.gameVendor = 'Tada';     SET NEW.gameType = 'fishing';
      WHEN 6 THEN SET NEW.gameVendor = 'Tada';     SET NEW.gameType = 'card';
      WHEN 7 THEN SET NEW.gameVendor = 'FaChai';   SET NEW.gameType = 'slot';
      WHEN 8 THEN SET NEW.gameVendor = 'POPOK';    SET NEW.gameType = 'slot';
      WHEN 9 THEN SET NEW.gameVendor = 'G759';     SET NEW.gameType = 'slot';
      WHEN 10 THEN SET NEW.gameVendor = 'CP';      SET NEW.gameType = 'slot';
      WHEN 11 THEN SET NEW.gameVendor = 'JBD';     SET NEW.gameType = 'slot';
      WHEN 12 THEN SET NEW.gameVendor = 'Evoplay'; SET NEW.gameType = 'slot';
      WHEN 13 THEN SET NEW.gameVendor = 'CQ9';     SET NEW.gameType = 'slot';
    END CASE;

  END IF;
END $$

DELIMITER ;

SELECT * FROM `agencyRelation` WHERE `inviteId` = 18388733


SELECT *
FROM `agencyRelation`
WHERE
`topId` = 18388733 AND `inviteId` != 18388733

SELECT * FROM `agencyRelation` WHERE `topId` = 18388733


SELECT gr.gameType,
SUM(CASE WHEN ar.inviteId = ar.`topId` THEN gr.validBetAmount ELSE 0 END) AS direct_total,
SUM(CASE WHEN ar.inviteId != ar.`topId` THEN gr.validBetAmount ELSE 0 END) AS indirect_total,
SUM(gr.validBetAmount) AS total
FROM agencyRelation ar
LEFT JOIN gameRecord gr ON gr.userId = ar.userId
WHERE ar.`topId` = 18388733
GROUP BY gr.gameType

