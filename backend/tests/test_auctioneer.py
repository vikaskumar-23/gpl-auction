PLAYER, OTHER_PLAYER = 9, 14  # Meera Shetye (base 50), Neel Parab (base 20)


def code(resp):
    return resp.json()["error"]["code"]


def test_auctioneer_starts_an_auction_for_one_player(client, start):
    r = start(PLAYER)
    assert r.status_code == 200
    assert r.json()["player"]["id"] == PLAYER
    assert r.json()["player"]["status"] == "in_auction"
    assert r.json()["bids"] == []
    assert client.get("/api/auction").json()["player"]["id"] == PLAYER


def test_only_one_auction_at_a_time(start):
    start(PLAYER)
    r = start(OTHER_PLAYER)
    assert r.status_code == 409 and code(r) == "AUCTION_IN_PROGRESS"


def test_unknown_player_cannot_be_auctioned(start):
    r = start(999)
    assert r.status_code == 404 and code(r) == "PLAYER_NOT_FOUND"


def test_only_the_auctioneer_can_start(client):
    for headers in ({}, {"X-Role": "viewer"}, {"X-Role": "manager"}):
        r = client.post("/api/auction/start", json={"player_id": PLAYER}, headers=headers)
        assert r.status_code == 403 and code(r) == "FORBIDDEN"


def test_malformed_start_request_gets_a_readable_error(client):
    r = client.post(
        "/api/auction/start",
        json={"player_id": "abc"},
        headers={"X-Role": "auctioneer"},
    )
    assert r.status_code == 422 and code(r) == "VALIDATION_ERROR"
    assert r.json()["error"]["message"].startswith("player_id:")
