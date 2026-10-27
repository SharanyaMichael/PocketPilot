from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class TransactionBase(BaseModel):
    description: str
    amount: float = Field(gt=0, description="Transaction amount must be strictly greater than 0")
    type: str = Field(pattern="^(income|expense)$")
    category: Optional[str] = None
    date: str
    notes: Optional[str] = ""

class TransactionCreate(TransactionBase):
    override_cooldown: Optional[bool] = False

class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    type: Optional[str] = Field(default=None, pattern="^(income|expense)$")
    category: Optional[str] = None
    date: Optional[str] = None
    notes: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: str
    clean_merchant: str
    is_demo: int
    created_at: str

class SubscriptionBase(BaseModel):
    name: str
    amount: float = Field(gt=0)
    billing_frequency: str = Field(pattern="^(monthly|yearly)$")
    next_billing_date: str
    category: str
    notes: Optional[str] = ""

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    billing_frequency: Optional[str] = Field(default=None, pattern="^(monthly|yearly)$")
    next_billing_date: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None

class SubscriptionResponse(SubscriptionBase):
    id: str
    is_demo: int
    created_at: str
    monthly_equivalent: float

class SavingsGoalBase(BaseModel):
    name: str
    target_amount: float = Field(gt=0)
    current_amount: Optional[float] = Field(default=0, ge=0)
    target_date: str
    description: Optional[str] = ""

class SavingsGoalCreate(SavingsGoalBase):
    pass

class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = Field(default=None, gt=0)
    current_amount: Optional[float] = Field(default=None, ge=0)
    target_date: Optional[str] = None
    description: Optional[str] = None

class SavingsGoalContribution(BaseModel):
    amount: float = Field(gt=0)

class SavingsGoalResponse(SavingsGoalBase):
    id: str
    is_demo: int
    created_at: str
    progress_percentage: float
    remaining_amount: float

class CooldownActivateRequest(BaseModel):
    duration_seconds: int = Field(gt=0, description="Duration in seconds")
    reason: Optional[str] = ""

class CooldownInterceptAction(BaseModel):
    action: str = Field(pattern="^(cancelled|continued|overrode)$")
    attempted_amount: float
    merchant: str
    category: str
    notes: Optional[str] = ""

class CooldownSessionResponse(BaseModel):
    is_active: bool
    start_time: Optional[str]
    duration_seconds: int
    expiry_time: Optional[str]
    remaining_seconds: int
    reason: Optional[str]

class CooldownLogResponse(BaseModel):
    id: str
    timestamp: str
    attempted_amount: float
    merchant: str
    category: str
    action_taken: str
    notes: str

class AffordabilityRequest(BaseModel):
    item_name: str
    item_price: float = Field(gt=0)
    category: Optional[str] = "Shopping"

class AffordabilityResponse(BaseModel):
    verdict: str  # "Affordable", "Affordable with caution", "Not recommended right now"
    badge_variant: str  # "positive", "warning", "negative"
    explanation: str
    metrics: dict
    disclaimer: str

class SettingsModel(BaseModel):
    monthly_budget: float
    min_savings_buffer: float
    preferred_currency: str
    currency_symbol: str
    demo_mode_enabled: bool
