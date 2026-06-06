from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional

class TransactionCreate(BaseModel):
    amount: float
    type: str
    category: str
    description: Optional[str] = None

    @field_validator("type")
    def type_must_be_valid(cls, v):
        if v not in ["income", "expense"]:
            raise ValueError("type must be 'income' or 'expense'")
        return v

    @field_validator("amount")
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("amount must be greater than 0")
        return v

class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: str
    category: str
    description: Optional[str]
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True