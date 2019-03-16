DROP TABLE IF EXISTS users, goal, total, expense, revenue CASCADE;

CREATE TABLE user_type (
  user_type_id   SERIAL       PRIMARY KEY
, user_type      VARCHAR(20)  NOT NULL UNIQUE
);

CREATE TABLE users (
  user_id        SERIAL       PRIMARY KEY
, username       VARCHAR(100) NOT NULL UNIQUE
, password       VARCHAR(255) NOT NULL
, user_type      INT          NOT NULL REFERENCES user_type(user_type_id)
, date_entered   DATE         NOT NULL
, last_update    INT          NOT NULL REFERENCES users(user_id)
);

CREATE TABLE goal (
  goal_id        SERIAL       PRIMARY KEY
, goal_expense   INT          NOT NULL
, goal_revenue   INT          NOT NULL
, goal_profits   INT          NOT NULL
, year           SMALLINT     NOT NULL
, date_entered   DATE         NOT NULL
, last_update    INT          NOT NULL REFERENCES users(user_id)
);

CREATE TABLE expense (
  expense_id     SERIAL       PRIMARY KEY
, description    TEXT         NOT NULL
, vendor         VARCHAR(100) NOT NULL
, amount         INT          NOT NULL
, year           SMALLINT     NOT NULL
, date_entered   DATE         NOT NULL
, last_update    INT          NOT NULL REFERENCES users(user_id)
, goal_id        INT          NOT NULL REFERENCES goal(goal_id)
);

CREATE TABLE revenue (
  revenue_id     SERIAL       PRIMARY KEY
, description    TEXT         NOT NULL
, client         VARCHAR(100) NOT NULL
, amount         INT          NOT NULL
, year           SMALLINT     NOT NULL
, date_entered   DATE         NOT NULL
, last_update    INT          NOT NULL REFERENCES users(user_id)
, goal_id        INT          NOT NULL REFERENCES goal(goal_id)
);