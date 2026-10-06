import pytest
from fastapi.testclient import TestClient

from app.main import app

AUCTIONEER = {"X-Role": "auctioneer"}
MANAGER = {"X-Role": "manager"}


@pytest.fixture(autouse=True)
def temp_db(tmp_path, monkeypatch):
    """Every test gets its own empty SQLite file."""
    monkeypatch.setenv("GPL_DB_PATH", str(tmp_path / "test.db"))


@pytest.fixture
def client():
    with TestClient(app) as c:  # runs the lifespan: schema + seed
        yield c


@pytest.fixture
def start(client):
    return lambda player_id: client.post(
        "/api/auction/start", json={"player_id": player_id}, headers=AUCTIONEER
    )


@pytest.fixture
def bid(client):
    return lambda team_id, amount: client.post(
        "/api/auction/bids", json={"team_id": team_id, "amount": amount}, headers=MANAGER
    )
