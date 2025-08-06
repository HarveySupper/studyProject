SELECT * FROM `gameRecord` WHERE `inviteId` =

SELECT * FROM `gameRecord` WHERE `userId` = `inviteId`;

CREATE TABLE IF NOT EXISTS agencyRelation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    inviteId INT,
    topId INT NOT NULL
);

DROP TABLE IF EXISTS `userInfo`;


INSERT INTO
    agencyRelation (userId, inviteId, topId)
VALUES (18388733, NULL, 18388733),
    (183976733, 18388733, 18388733),
    (183123133, 18388733, 18388733),
    (
        183887333,
        183123133,
        18388733
    )

SELECT *
FROM `agencyRelation`
WHERE
    `topId` = 18388733
    AND `inviteId` != 18388733;

SELECT * FROM `agencyRelation` WHERE `inviteId` = 18388733;

SELECT * FROM `agencyRelation` WHERE `topId` = 18388733;

INSERT INTO
    `gameRecord` (
        `userId`,
        `inviteId`,
        `gameTYpe`
    )
VALUES (183976733, 18388733, 'fish')

SELECT * FROM `agencyRelation` WHERE `inviteId` = 18388733;

SELECT SUM(`betAmount`) AS `totalBetAmount`
FROM
    `gameRecord`
    RIGHT JOIN `agencyRelation` ON `gameRecord`.`userId` = `agencyRelation`.`userId`
WHERE
    `agencyRelation`.`inviteId` = 18388733
    AND `gameRecord`.`gameTYpe` = 'slot';

CREATE TABLE IF NOT EXISTS userInfo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    balance BIGINT DEFAULT 0,
    registerTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

