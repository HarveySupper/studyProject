DROP TABLE `agencyRelationLevel`;
CREATE TABLE IF NOT EXISTS agencyRelationLevel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    subId INT,
    topId INT NOT NULL,
    level INT NOT NULL
);

101 
1001 1002
10001 10002
100001

INSERT INTO `agencyRelationLevel` (`userId`,`subId`,`topId`,`level`)
VALUES(10001,100001,101,1)


SELECT * FROM `agencyRelationLevel` WHERE `userId` = 1001;

SELECT * FROM `agencyRelationLevel` WHERE `userId` = 1001 AND `level` = 1;

SELECT * FROM `agencyRelationLevel` WHERE `subId` = 100001