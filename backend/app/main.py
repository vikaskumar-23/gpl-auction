"""HTTP API for the GPL auction."""

import sqlite3
from contextlib import asynccontextmanager, closing
from typing import Annotated

from fastapi import Depends, FastAPI, Header, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app import auction
from app.auction import AuctionError
from app.db import connect, get_conn, init_schema
from app.schemas import AcceptRequest, Auction, Bid, BidRequest, Player, StartRequest, Team
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    with closing(connect()) as conn:
        init_schema(conn)
        seed_if_empty(conn)
    yield


app = FastAPI(title="GPL Auction API", version="1.0.0", lifespan=lifespan)
Conn = Annotated[sqlite3.Connection, Depends(get_conn)]


def error(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status, content={"error": {"code": code, "message": message}})


@app.exception_handler(AuctionError)
async def on_auction_error(request: Request, exc: AuctionError):
    return error(exc.status, exc.code, exc.message)


@app.exception_handler(RequestValidationError)
async def on_validation_error(request: Request, exc: RequestValidationError):
    first = exc.errors()[0]
    # loc looks like ("body", "amount"); drop the "body"/"query" prefix
    field = ".".join(str(part) for part in first["loc"][1:]) or "body"
    return error(422, "VALIDATION_ERROR", f"{field}: {first['msg']}")


def require_role(role: str):
    """Simulated identity: the client says who it is in an X-Role header (no real auth, per the brief)."""

    def check(x_role: Annotated[str | None, Header()] = None):
        if x_role != role:
            raise AuctionError(
                403,
                "FORBIDDEN",
                f"Only the {role} can do this (send header X-Role: {role}).",
            )

    return Depends(check)


# ---------- reads ----------


@app.get("/api/players", response_model=list[Player])
def list_players(conn: Conn):
    return auction.list_players(conn)


@app.get("/api/teams", response_model=list[Team])
def list_teams(conn: Conn):
    return auction.list_teams(conn)


@app.get("/api/auction", response_model=Auction)
def get_auction(conn: Conn):
    return auction.current_auction(conn)


# ---------- writes ----------


@app.post(
    "/api/auction/start",
    response_model=Auction,
    dependencies=[require_role("auctioneer")],
)
def start_auction(body: StartRequest, conn: Conn):
    return auction.start_auction(conn, body.player_id)


@app.post(
    "/api/auction/bids",
    response_model=Bid,
    status_code=201,
    dependencies=[require_role("manager")],
)
def place_bid(body: BidRequest, conn: Conn):
    return auction.place_bid(conn, body.team_id, body.amount)


@app.post(
    "/api/auction/accept",
    response_model=Player,
    dependencies=[require_role("auctioneer")],
)
def accept_bid(body: AcceptRequest, conn: Conn):
    return auction.accept_bid(conn, body.bid_id)


@app.post(
    "/api/auction/reject",
    response_model=Player,
    dependencies=[require_role("auctioneer")],
)
def reject_round(conn: Conn):
    return auction.reject_round(conn)
