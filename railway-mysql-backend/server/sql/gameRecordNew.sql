CREATE TABLE IF NOT EXISTS gameRecordNew (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    gameVendor VARCHAR(255),
    gameType VARCHAR(255),
    betAmount BIGINT DEFAULT 0,
    validBetAmount BIGINT DEFAULT 0,
    winAmount BIGINT DEFAULT 0,
    betTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


SELECT * FROM `gameRecordNew` WHERE gameVendor LIKE 'P%';

DROP TABLE gameRecordNew