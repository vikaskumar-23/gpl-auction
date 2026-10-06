from app.seed import TOTAL_BUDGET

PLAYER = 9  # Meera Shetye; tests read her base price from the API


def code(resp):
    return resp.json()["error"]["code"]


def amounts(client):
    return [b["amount"] for b in client.get("/api/auction").json()["bids"]]


def test_four_managers_can_each_place_a_higher_bid(client, start, bid):
    base = start(PLAYER).json()["player"]["base_price"]
    for team_id in (1, 2, 3, 4):
        assert bid(team_id, base + 10 * team_id).status_code == 201

    bids = client.get("/api/auction").json()["bids"]
    assert [(b["team_id"], b["amount"]) for b in bids] == [
        (4, base + 40),
        (3, base + 30),
        (2, base + 20),
        (1, base + 10),
    ]


def test_bid_must_be_more_than_base_price(start, bid):
    base = start(PLAYER).json()["player"]["base_price"]
    r = bid(1, base)
    assert r.status_code == 400 and code(r) == "BID_NOT_ABOVE_BASE"
    assert bid(1, base + 1).status_code == 201


def test_only_a_higher_bid_is_stored(client, start, bid):
    base = start(PLAYER).json()["player"]["base_price"]
    bid(1, base + 10)
    for amount in (base + 10, base + 5):
        r = bid(2, amount)
        assert r.status_code == 400 and code(r) == "BID_NOT_ABOVE_HIGHEST"
    assert amounts(client) == [base + 10]


def test_team_cannot_bid_twice_in_a_row(start, bid):
    base = start(PLAYER).json()["player"]["base_price"]
    assert bid(1, base + 10).status_code == 201
    r = bid(1, base + 20)
    assert r.status_code == 409 and code(r) == "ALREADY_HIGHEST_BIDDER"
    assert bid(2, base + 20).status_code == 201
    assert bid(1, base + 30).status_code == 201  # allowed again once outbid


def test_cannot_bid_when_no_player_is_up(bid):
    r = bid(1, 100)
    assert r.status_code == 409 and code(r) == "NO_ACTIVE_AUCTION"


def test_bid_for_unknown_team_is_refused(start, bid):
    start(PLAYER)
    r = bid(99, 500)
    assert r.status_code == 404 and code(r) == "TEAM_NOT_FOUND"


def test_only_team_managers_can_bid(client, start):
    start(PLAYER)
    for headers in ({}, {"X-Role": "viewer"}, {"X-Role": "auctioneer"}):
        r = client.post("/api/auction/bids", json={"team_id": 1, "amount": 500}, headers=headers)
        assert r.status_code == 403 and code(r) == "FORBIDDEN"


def test_malformed_amount_gets_a_readable_error(client, start):
    start(PLAYER)
    for amount in (-5, 0, "lots", 10.5):
        r = client.post(
            "/api/auction/bids",
            json={"team_id": 1, "amount": amount},
            headers={"X-Role": "manager"},
        )
        assert r.status_code == 422 and code(r) == "VALIDATION_ERROR"
        assert r.json()["error"]["message"].startswith("amount:")


def test_bid_above_remaining_budget_is_refused_with_a_clear_error(start, bid):
    start(PLAYER)
    r = bid(1, TOTAL_BUDGET + 1)
    assert r.status_code == 400 and code(r) == "OVER_BUDGET"
    assert "remaining budget" in r.json()["error"]["message"]
    assert bid(1, TOTAL_BUDGET).status_code == 201  # spending the whole budget is allowed
