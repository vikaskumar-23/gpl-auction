"""Request and response shapes. FastAPI uses them for validation and for the /docs page."""

from typing import Literal

from pydantic import BaseModel, Field


class Player(BaseModel):
    id: int
    name: str
    skill: Literal["batting", "bowling", "both"]
    base_price: int = Field(description="₹ lakh")
    status: Literal["available", "in_auction", "sold"]
    sold_price: int | None = Field(description="₹ lakh, set once sold")
    team_id: int | None


class Team(BaseModel):
    id: int
    name: str
    total_budget: int
    remaining_budget: int
    players: list[Player] = Field(description="Players bought, most expensive first")


class Bid(BaseModel):
    id: int
    player_id: int
    team_id: int
    team_name: str
    amount: int = Field(description="₹ lakh")
    created_at: str = Field(description="UTC, ISO 8601")


class Auction(BaseModel):
    player: Player | None = Field(description="Player up for auction, or null")
    bids: list[Bid] = Field(description="This round's bids, highest first")


class StartRequest(BaseModel):
    player_id: int


class BidRequest(BaseModel):
    team_id: int
    amount: int = Field(gt=0, description="₹ lakh")


class AcceptRequest(BaseModel):
    bid_id: int = Field(description="Must still be the highest bid")
