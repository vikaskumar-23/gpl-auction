"""SQLite access: one short-lived connection per request, explicit write transactions."""

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

DEFAULT_DB = Path(__file__).resolve().parent.parent / "gpl.db"
SCHEMA = Path(__file__).with_name("schema.sql")


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(
        os.environ.get("GPL_DB_PATH", DEFAULT_DB),
        isolation_level=None,  # autocommit; transaction() opens write transactions explicitly
        check_same_thread=False,  # FastAPI may open and use a connection on different threads
        timeout=5,  # wait up to 5 s for another writer's lock instead of failing
    )
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def transaction(conn: sqlite3.Connection):
    """Run a block atomically. BEGIN IMMEDIATE takes the write lock up front, so two
    simultaneous bids cannot both read the same "highest bid" and both succeed."""
    conn.execute("BEGIN IMMEDIATE")
    try:
        yield
    except BaseException:
        conn.execute("ROLLBACK")
        raise
    conn.execute("COMMIT")


def get_conn():
    """FastAPI dependency: one connection per request."""
    conn = connect()
    try:
        yield conn
    finally:
        conn.close()


def init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA.read_text(encoding="utf-8"))
