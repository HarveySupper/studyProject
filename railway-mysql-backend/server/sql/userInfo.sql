userId balance registerTime

CREATE TABLE IF NOT EXISTS users (
    userId INT PRIMARY KEY,
    balance BIGINT DEFAULT 0,
    registerTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (userId, balance) VALUES (1234, 1000);

userId subId level topId

CREATE TABLE IF NOT EXISTS agencyRelation (
    id INT SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    subId INT,
    level INT DEFAULT 0,
    topId INT
);