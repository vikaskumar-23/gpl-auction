-- GPL auction schema (SQLite). Money is stored as whole ₹ lakh.

CREATE TABLE IF NOT EXISTS teams (
    id               INTEGER PRIMARY KEY,
    name             TEXT    NOT NULL UNIQUE,
    total_budget     INTEGER NOT NULL CHECK (total_budget > 0),
    remaining_budget INTEGER NOT NULL,
    CHECK (remaining_budget BETWEEN 0 AND total_budget)
);

CREATE TABLE IF NOT EXISTS players (
    id         INTEGER PRIMARY KEY,
    name       TEXT    NOT NULL,
    skill      TEXT    NOT NULL CHECK (skill IN ('batting', 'bowling', 'both')),
    base_price INTEGER NOT NULL CHECK (base_price > 0),
    status     TEXT    NOT NULL DEFAULT 'available'
                       CHECK (status IN ('available', 'in_auction', 'sold')),
    sold_price INTEGER CHECK (sold_price > 0),
    team_id    INTEGER REFERENCES teams (id),
    -- a sold player always has a team and a price; an unsold one never does
    CHECK (
        (status = 'sold'  AND team_id IS NOT NULL AND sold_price IS NOT NULL) OR
        (status <> 'sold' AND team_id IS NULL     AND sold_price IS NULL)
    )
);

-- One auction at a time: at most one player can be 'in_auction'.
CREATE UNIQUE INDEX IF NOT EXISTS one_player_in_auction
    ON players (status) WHERE status = 'in_auction';

CREATE TABLE IF NOT EXISTS bids (
    id         INTEGER PRIMARY KEY,
    player_id  INTEGER NOT NULL REFERENCES players (id),
    team_id    INTEGER NOT NULL REFERENCES teams (id),
    amount     INTEGER NOT NULL CHECK (amount > 0),
    created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    voided     INTEGER NOT NULL DEFAULT 0 CHECK (voided IN (0, 1))  -- 1 = from a rejected round
);
