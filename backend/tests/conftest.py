import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(autouse=True)
def temp_db(tmp_path, monkeypatch):
    """Every test gets its own empty SQLite file."""
    monkeypatch.setenv("GPL_DB_PATH", str(tmp_path / "test.db"))


@pytest.fixture
def client():
    with TestClient(app) as c:  # runs the lifespan: schema + seed
        yield c
