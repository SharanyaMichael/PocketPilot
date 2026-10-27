from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone, timedelta
import uuid
import sqlite3

from database import init_db, get_db
from models import (
    TransactionCreate, TransactionUpdate, TransactionResponse,
    SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse,
    SavingsGoalCreate, SavingsGoalUpdate, SavingsGoalResponse, SavingsGoalContribution,
    CooldownActivateRequest, CooldownInterceptAction, CooldownSessionResponse, CooldownLogResponse,
    AffordabilityRequest, AffordabilityResponse, SettingsModel
)
from upi_cleaner import clean_narration
from insights import compute_insights
from demo_seed import seed_demo_data

app = FastAPI(title="PocketPilot API", version="1.0.0")

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    with get_db() as conn:
        seed_demo_data(conn)

def get_cooldown_state(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cooldown_session WHERE id = 1")
    row = cursor.fetchone()
    if not row or not row["is_active"]:
        return {
            "is_active": False,
            "start_time": None,
            "duration_seconds": 0,
            "expiry_time": None,
            "remaining_seconds": 0,
            "reason": ""
        }

    expiry_str = row["expiry_time"]
    try:
        expiry_dt = datetime.fromisoformat(expiry_str)
        now_dt = datetime.now()
        remaining = int((expiry_dt - now_dt).total_seconds())
        if remaining <= 0:
            # Auto-expire
            cursor.execute("UPDATE cooldown_session SET is_active = 0 WHERE id = 1")
            return {
                "is_active": False,
                "start_time": row["start_time"],
                "duration_seconds": row["duration_seconds"],
                "expiry_time": row["expiry_time"],
                "remaining_seconds": 0,
                "reason": row["reason"]
            }
        return {
            "is_active": True,
            "start_time": row["start_time"],
            "duration_seconds": row["duration_seconds"],
            "expiry_time": row["expiry_time"],
            "remaining_seconds": remaining,
            "reason": row["reason"]
        }
    except Exception:
        return {
            "is_active": False,
            "start_time": None,
            "duration_seconds": 0,
            "expiry_time": None,
            "remaining_seconds": 0,
            "reason": ""
        }

def get_setting(conn, key: str, default: str = "") -> str:
    cursor = conn.cursor()
    cursor.execute("SELECT value FROM settings WHERE key = ?", (key,))
    row = cursor.fetchone()
    return row["value"] if row else default

# ==================== SUMMARY & OVERVIEW ====================
@app.get("/api/summary")
def get_summary():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM transactions ORDER BY date DESC, created_at DESC")
        tx_rows = cursor.fetchall()
        transactions = [dict(r) for r in tx_rows]

        monthly_budget = float(get_setting(conn, "monthly_budget", "65000"))
        min_savings_buffer = float(get_setting(conn, "min_savings_buffer", "20000"))

        now = datetime.now()
        current_month_prefix = now.strftime("%Y-%m")

        total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
        total_expenses = sum(t["amount"] for t in transactions if t["type"] == "expense")
        available_balance = total_income - total_expenses

        monthly_income = sum(t["amount"] for t in transactions if t["type"] == "income" and t["date"].startswith(current_month_prefix))
        monthly_expenses = sum(t["amount"] for t in transactions if t["type"] == "expense" and t["date"].startswith(current_month_prefix))
        monthly_budget_remaining = max(0.0, monthly_budget - monthly_expenses)

        # Savings Goals sum
        cursor.execute("SELECT SUM(current_amount) as total_saved, SUM(target_amount) as total_target FROM savings_goals")
        sg_row = cursor.fetchone()
        total_saved_goals = sg_row["total_saved"] or 0.0
        total_target_goals = sg_row["total_target"] or 0.0

        # Subscriptions upcoming
        cursor.execute("SELECT * FROM subscriptions ORDER BY next_billing_date ASC LIMIT 5")
        sub_rows = cursor.fetchall()
        upcoming_subs = []
        monthly_sub_cost = 0.0
        cursor.execute("SELECT * FROM subscriptions")
        all_subs = cursor.fetchall()
        for s in all_subs:
            amt = s["amount"]
            monthly_equivalent = amt if s["billing_frequency"] == "monthly" else (amt / 12.0)
            monthly_sub_cost += monthly_equivalent

        for s in sub_rows:
            upcoming_subs.append({
                "id": s["id"],
                "name": s["name"],
                "amount": s["amount"],
                "billing_frequency": s["billing_frequency"],
                "next_billing_date": s["next_billing_date"],
                "category": s["category"],
                "is_demo": s["is_demo"]
            })

        # Category breakdown
        category_map = {}
        for t in transactions:
            if t["type"] == "expense":
                cat = t["category"]
                category_map[cat] = category_map.get(cat, 0.0) + t["amount"]

        category_breakdown = [
            {"category": k, "amount": round(v, 2), "percentage": round((v / total_expenses * 100), 1) if total_expenses > 0 else 0}
            for k, v in sorted(category_map.items(), key=lambda x: x[1], reverse=True)
        ]

        # Monthly Trends (last 6 months)
        trends = []
        for i in range(5, -1, -1):
            m_date = (now.replace(day=1) - timedelta(days=i*30))
            m_prefix = m_date.strftime("%Y-%m")
            m_name = m_date.strftime("%b")
            m_inc = sum(t["amount"] for t in transactions if t["type"] == "income" and t["date"].startswith(m_prefix))
            m_exp = sum(t["amount"] for t in transactions if t["type"] == "expense" and t["date"].startswith(m_prefix))
            trends.append({
                "month": m_name,
                "year_month": m_prefix,
                "income": round(m_inc, 2),
                "expense": round(m_exp, 2)
            })

        # Cooldown state
        cd_state = get_cooldown_state(conn)

        return {
            "available_balance": round(available_balance, 2),
            "monthly_income": round(monthly_income, 2),
            "monthly_expenses": round(monthly_expenses, 2),
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "monthly_budget": round(monthly_budget, 2),
            "monthly_budget_remaining": round(monthly_budget_remaining, 2),
            "budget_used_percentage": round((monthly_expenses / monthly_budget * 100), 1) if monthly_budget > 0 else 0,
            "savings_total_saved": round(total_saved_goals, 2),
            "savings_total_target": round(total_target_goals, 2),
            "monthly_recurring_subscriptions": round(monthly_sub_cost, 2),
            "category_breakdown": category_breakdown,
            "monthly_trends": trends,
            "upcoming_subscriptions": upcoming_subs,
            "cooldown_active": cd_state["is_active"],
            "cooldown_remaining_seconds": cd_state["remaining_seconds"]
        }

# ==================== TRANSACTIONS ====================
@app.get("/api/transactions")
def list_transactions(
    category: str = Query(None),
    type: str = Query(None),
    search: str = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM transactions WHERE 1=1"
        params = []

        if category and category != "All":
            query += " AND category = ?"
            params.append(category)
        if type and type != "All":
            query += " AND type = ?"
            params.append(type)
        if search:
            query += " AND (description LIKE ? OR clean_merchant LIKE ? OR notes LIKE ?)"
            term = f"%{search}%"
            params.extend([term, term, term])
        if start_date:
            query += " AND date >= ?"
            params.append(start_date)
        if end_date:
            query += " AND date <= ?"
            params.append(end_date)

        query += " ORDER BY date DESC, created_at DESC"
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(r) for r in rows]

@app.post("/api/transactions", status_code=status.HTTP_201_CREATED)
def create_transaction(tx: TransactionCreate):
    with get_db() as conn:
        # Check cooling off mode if this is an expense and not overrode
        if tx.type == "expense":
            cd_state = get_cooldown_state(conn)
            if cd_state["is_active"] and not tx.override_cooldown:
                # Intercept!
                clean_name, det_cat = clean_narration(tx.description)
                cat = tx.category or det_cat
                raise HTTPException(
                    status_code=status.HTTP_423_LOCKED,
                    detail={
                        "message": "Cooling-off mode is active. Confirm if this purchase is necessary.",
                        "cooldown": cd_state,
                        "attempted_purchase": {
                            "description": tx.description,
                            "clean_merchant": clean_name,
                            "amount": tx.amount,
                            "category": cat,
                            "date": tx.date
                        }
                    }
                )

        cursor = conn.cursor()
        clean_name, det_cat = clean_narration(tx.description)
        cat = tx.category or det_cat
        tx_id = f"tx-{uuid.uuid4().hex[:10]}"
        
        cursor.execute("""
        INSERT INTO transactions (id, description, clean_merchant, amount, type, category, date, notes, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
        """, (tx_id, tx.description, clean_name, tx.amount, tx.type, cat, tx.date, tx.notes or ""))

        cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
        created = dict(cursor.fetchone())
        return created

@app.put("/api/transactions/{tx_id}")
def update_transaction(tx_id: str, update: TransactionUpdate):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Transaction not found")

        # If modifying amount upward or editing expense during cooling off mode
        new_type = update.type if update.type is not None else existing["type"]
        new_amount = update.amount if update.amount is not None else existing["amount"]
        
        # Determine cleaned merchant if description changed
        new_desc = update.description if update.description is not None else existing["description"]
        clean_name, det_cat = clean_narration(new_desc)
        new_cat = update.category if update.category is not None else (existing["category"] or det_cat)
        new_date = update.date if update.date is not None else existing["date"]
        new_notes = update.notes if update.notes is not None else existing["notes"]

        cursor.execute("""
        UPDATE transactions
        SET description = ?, clean_merchant = ?, amount = ?, type = ?, category = ?, date = ?, notes = ?
        WHERE id = ?
        """, (new_desc, clean_name, new_amount, new_type, new_cat, new_date, new_notes, tx_id))

        cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
        return dict(cursor.fetchone())

@app.delete("/api/transactions/{tx_id}")
def delete_transaction(tx_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Transaction not found")
        cursor.execute("DELETE FROM transactions WHERE id = ?", (tx_id,))
        return {"success": True, "deleted_id": tx_id}

@app.post("/api/clean-narration")
def clean_narration_endpoint(payload: dict):
    raw = payload.get("text", "")
    clean_name, category = clean_narration(raw)
    return {"cleaned_merchant": clean_name, "suggested_category": category}

# ==================== COOLING-OFF MODE ====================
@app.get("/api/cooldown")
def get_cooldown():
    with get_db() as conn:
        return get_cooldown_state(conn)

@app.post("/api/cooldown/activate")
def activate_cooldown(req: CooldownActivateRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        now = datetime.now()
        expiry = now + timedelta(seconds=req.duration_seconds)

        cursor.execute("""
        UPDATE cooldown_session
        SET is_active = 1, start_time = ?, duration_seconds = ?, expiry_time = ?, reason = ?
        WHERE id = 1
        """, (now.isoformat(), req.duration_seconds, expiry.isoformat(), req.reason or ""))

        return get_cooldown_state(conn)

@app.post("/api/cooldown/cancel-session")
def cancel_cooldown_session():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE cooldown_session SET is_active = 0 WHERE id = 1")
        return {"success": True, "message": "Cooling-off session stopped manually."}

@app.post("/api/cooldown/intercept-action")
def log_cooldown_intercept_action(action_req: CooldownInterceptAction):
    with get_db() as conn:
        cursor = conn.cursor()
        log_id = f"cd-log-{uuid.uuid4().hex[:8]}"
        now = datetime.now()

        cursor.execute("""
        INSERT INTO cooldown_activity_log (id, timestamp, attempted_amount, merchant, category, action_taken, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            log_id,
            now.strftime("%Y-%m-%d %H:%M:%S"),
            action_req.attempted_amount,
            action_req.merchant,
            action_req.category,
            action_req.action,
            action_req.notes or ""
        ))

        return {
            "success": True,
            "log_id": log_id,
            "action": action_req.action,
            "cooldown_state": get_cooldown_state(conn)
        }

@app.get("/api/cooldown/logs")
def get_cooldown_logs():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM cooldown_activity_log ORDER BY timestamp DESC LIMIT 50")
        rows = cursor.fetchall()
        return [dict(r) for r in rows]

# ==================== SUBSCRIPTIONS ====================
@app.get("/api/subscriptions")
def list_subscriptions():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM subscriptions ORDER BY next_billing_date ASC")
        rows = cursor.fetchall()
        subs = []
        for r in rows:
            d = dict(r)
            d["monthly_equivalent"] = round(d["amount"] if d["billing_frequency"] == "monthly" else (d["amount"] / 12.0), 2)
            subs.append(d)
        return subs

@app.post("/api/subscriptions", status_code=status.HTTP_201_CREATED)
def create_subscription(sub: SubscriptionCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        sub_id = f"sub-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
        INSERT INTO subscriptions (id, name, amount, billing_frequency, next_billing_date, category, notes, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        """, (sub_id, sub.name, sub.amount, sub.billing_frequency, sub.next_billing_date, sub.category, sub.notes or ""))

        cursor.execute("SELECT * FROM subscriptions WHERE id = ?", (sub_id,))
        d = dict(cursor.fetchone())
        d["monthly_equivalent"] = round(d["amount"] if d["billing_frequency"] == "monthly" else (d["amount"] / 12.0), 2)
        return d

@app.put("/api/subscriptions/{sub_id}")
def update_subscription(sub_id: str, update: SubscriptionUpdate):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM subscriptions WHERE id = ?", (sub_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Subscription not found")

        name = update.name if update.name is not None else existing["name"]
        amount = update.amount if update.amount is not None else existing["amount"]
        frequency = update.billing_frequency if update.billing_frequency is not None else existing["billing_frequency"]
        next_date = update.next_billing_date if update.next_billing_date is not None else existing["next_billing_date"]
        category = update.category if update.category is not None else existing["category"]
        notes = update.notes if update.notes is not None else existing["notes"]

        cursor.execute("""
        UPDATE subscriptions
        SET name = ?, amount = ?, billing_frequency = ?, next_billing_date = ?, category = ?, notes = ?
        WHERE id = ?
        """, (name, amount, frequency, next_date, category, notes, sub_id))

        cursor.execute("SELECT * FROM subscriptions WHERE id = ?", (sub_id,))
        d = dict(cursor.fetchone())
        d["monthly_equivalent"] = round(d["amount"] if d["billing_frequency"] == "monthly" else (d["amount"] / 12.0), 2)
        return d

@app.delete("/api/subscriptions/{sub_id}")
def delete_subscription(sub_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM subscriptions WHERE id = ?", (sub_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Subscription not found")
        cursor.execute("DELETE FROM subscriptions WHERE id = ?", (sub_id,))
        return {"success": True, "deleted_id": sub_id}

# ==================== SAVINGS GOALS ====================
@app.get("/api/savings-goals")
def list_savings_goals():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM savings_goals ORDER BY target_date ASC")
        rows = cursor.fetchall()
        goals = []
        for r in rows:
            d = dict(r)
            t = d["target_amount"]
            c = d["current_amount"]
            d["progress_percentage"] = round((c / t * 100), 1) if t > 0 else 0
            d["remaining_amount"] = max(0.0, round(t - c, 2))
            goals.append(d)
        return goals

@app.post("/api/savings-goals", status_code=status.HTTP_201_CREATED)
def create_savings_goal(goal: SavingsGoalCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        goal_id = f"goal-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
        INSERT INTO savings_goals (id, name, target_amount, current_amount, target_date, description, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, 0)
        """, (goal_id, goal.name, goal.target_amount, goal.current_amount or 0.0, goal.target_date, goal.description or ""))

        cursor.execute("SELECT * FROM savings_goals WHERE id = ?", (goal_id,))
        d = dict(cursor.fetchone())
        t = d["target_amount"]
        c = d["current_amount"]
        d["progress_percentage"] = round((c / t * 100), 1) if t > 0 else 0
        d["remaining_amount"] = max(0.0, round(t - c, 2))
        return d

@app.put("/api/savings-goals/{goal_id}")
def update_savings_goal(goal_id: str, update: SavingsGoalUpdate):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM savings_goals WHERE id = ?", (goal_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Savings goal not found")

        name = update.name if update.name is not None else existing["name"]
        target = update.target_amount if update.target_amount is not None else existing["target_amount"]
        current = update.current_amount if update.current_amount is not None else existing["current_amount"]
        date = update.target_date if update.target_date is not None else existing["target_date"]
        desc = update.description if update.description is not None else existing["description"]

        cursor.execute("""
        UPDATE savings_goals
        SET name = ?, target_amount = ?, current_amount = ?, target_date = ?, description = ?
        WHERE id = ?
        """, (name, target, current, date, desc, goal_id))

        cursor.execute("SELECT * FROM savings_goals WHERE id = ?", (goal_id,))
        d = dict(cursor.fetchone())
        t = d["target_amount"]
        c = d["current_amount"]
        d["progress_percentage"] = round((c / t * 100), 1) if t > 0 else 0
        d["remaining_amount"] = max(0.0, round(t - c, 2))
        return d

@app.post("/api/savings-goals/{goal_id}/contribute")
def contribute_to_goal(goal_id: str, payload: SavingsGoalContribution):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM savings_goals WHERE id = ?", (goal_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Savings goal not found")

        new_current = existing["current_amount"] + payload.amount
        cursor.execute("UPDATE savings_goals SET current_amount = ? WHERE id = ?", (new_current, goal_id))

        cursor.execute("SELECT * FROM savings_goals WHERE id = ?", (goal_id,))
        d = dict(cursor.fetchone())
        t = d["target_amount"]
        c = d["current_amount"]
        d["progress_percentage"] = round((c / t * 100), 1) if t > 0 else 0
        d["remaining_amount"] = max(0.0, round(t - c, 2))
        return d

@app.delete("/api/savings-goals/{goal_id}")
def delete_savings_goal(goal_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM savings_goals WHERE id = ?", (goal_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Savings goal not found")
        cursor.execute("DELETE FROM savings_goals WHERE id = ?", (goal_id,))
        return {"success": True, "deleted_id": goal_id}

# ==================== SMART SPENDING INSIGHTS ====================
@app.get("/api/insights")
def get_insights():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM transactions ORDER BY date DESC")
        transactions = [dict(r) for r in cursor.fetchall()]

        monthly_budget = float(get_setting(conn, "monthly_budget", "65000"))
        min_savings_buffer = float(get_setting(conn, "min_savings_buffer", "20000"))

        calculated_insights = compute_insights(transactions, monthly_budget, min_savings_buffer)

        # Distinguish demo insights vs live calculated
        has_user_data = any(t["is_demo"] == 0 for t in transactions)
        
        return {
            "has_user_data": has_user_data,
            "insights": calculated_insights,
            "data_summary": {
                "total_transactions": len(transactions),
                "user_transactions": sum(1 for t in transactions if t["is_demo"] == 0),
                "demo_transactions": sum(1 for t in transactions if t["is_demo"] == 1)
            }
        }

# ==================== AFFORDABILITY CHECKER ====================
@app.post("/api/affordability", response_model=AffordabilityResponse)
def evaluate_affordability(req: AffordabilityRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM transactions")
        transactions = [dict(r) for r in cursor.fetchall()]

        monthly_budget = float(get_setting(conn, "monthly_budget", "65000"))
        min_savings_buffer = float(get_setting(conn, "min_savings_buffer", "20000"))

        now = datetime.now()
        current_month = now.strftime("%Y-%m")

        total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
        total_expense = sum(t["amount"] for t in transactions if t["type"] == "expense")
        liquid_balance = total_income - total_expense

        monthly_income = sum(t["amount"] for t in transactions if t["type"] == "income" and t["date"].startswith(current_month))
        monthly_expense = sum(t["amount"] for t in transactions if t["type"] == "expense" and t["date"].startswith(current_month))
        remaining_budget = max(0.0, monthly_budget - monthly_expense)

        price = req.item_price
        post_purchase_balance = liquid_balance - price
        post_purchase_remaining_budget = remaining_budget - price

        # Transparent rule logic:
        # 1. Not recommended if purchase exceeds current liquid balance OR leaves balance below minimum savings buffer
        if price > liquid_balance or post_purchase_balance < min_savings_buffer:
            verdict = "Not recommended right now"
            badge = "negative"
            explanation = (
                f"Purchasing '{req.item_name}' (₹{price:,.0f}) would depress your liquid balance to ₹{post_purchase_balance:,.0f}, "
                f"which breaches your configured minimum emergency buffer of ₹{min_savings_buffer:,.0f}."
            )
        # 2. Affordable with caution if purchase exceeds monthly remaining budget OR takes > 40% of remaining budget
        elif post_purchase_remaining_budget < 0:
            verdict = "Affordable with caution"
            badge = "warning"
            explanation = (
                f"You have enough liquid reserve (₹{liquid_balance:,.0f}), but this ₹{price:,.0f} purchase will exceed your monthly budget "
                f"by ₹{abs(post_purchase_remaining_budget):,.0f}. Recommend pacing or pausing other discretionary spend."
            )
        elif price > (0.4 * remaining_budget):
            verdict = "Affordable with caution"
            badge = "warning"
            explanation = (
                f"This purchase of ₹{price:,.0f} consumes {(price / remaining_budget * 100):.0f}% of your remaining monthly budget (₹{remaining_budget:,.0f}). "
                f"Safe to proceed if essential, but consider delaying optional upgrades."
            )
        else:
            verdict = "Affordable"
            badge = "positive"
            explanation = (
                f"Green light! '{req.item_name}' (₹{price:,.0f}) fits comfortably within your remaining monthly budget of ₹{remaining_budget:,.0f} "
                f"and preserves your ₹{min_savings_buffer:,.0f} safety reserve."
            )

        return AffordabilityResponse(
            verdict=verdict,
            badge_variant=badge,
            explanation=explanation,
            metrics={
                "liquid_balance": round(liquid_balance, 2),
                "min_savings_buffer": round(min_savings_buffer, 2),
                "monthly_budget": round(monthly_budget, 2),
                "remaining_budget": round(remaining_budget, 2),
                "post_purchase_balance": round(post_purchase_balance, 2),
                "post_purchase_remaining_budget": round(post_purchase_remaining_budget, 2)
            },
            disclaimer="PocketPilot provides analytical budget guidance based on your recorded numbers. This does not constitute certified financial or investment advice."
        )

# ==================== SETTINGS & PRIVACY ====================
@app.get("/api/settings")
def get_settings():
    with get_db() as conn:
        return {
            "monthly_budget": float(get_setting(conn, "monthly_budget", "65000")),
            "min_savings_buffer": float(get_setting(conn, "min_savings_buffer", "20000")),
            "preferred_currency": get_setting(conn, "preferred_currency", "INR"),
            "currency_symbol": get_setting(conn, "currency_symbol", "₹"),
            "demo_mode_enabled": get_setting(conn, "demo_mode_enabled", "1") == "1"
        }

@app.put("/api/settings")
def update_settings(settings: SettingsModel):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE settings SET value = ? WHERE key = 'monthly_budget'", (str(settings.monthly_budget),))
        cursor.execute("UPDATE settings SET value = ? WHERE key = 'min_savings_buffer'", (str(settings.min_savings_buffer),))
        cursor.execute("UPDATE settings SET value = ? WHERE key = 'preferred_currency'", (settings.preferred_currency,))
        cursor.execute("UPDATE settings SET value = ? WHERE key = 'currency_symbol'", (settings.currency_symbol,))
        cursor.execute("UPDATE settings SET value = ? WHERE key = 'demo_mode_enabled'", ("1" if settings.demo_mode_enabled else "0",))
        return settings

@app.post("/api/demo-data/reset")
def reset_demo_data(mode: str = "restore"):
    with get_db() as conn:
        cursor = conn.cursor()
        if mode == "clear_all":
            cursor.execute("DELETE FROM transactions")
            cursor.execute("DELETE FROM subscriptions")
            cursor.execute("DELETE FROM savings_goals")
            cursor.execute("DELETE FROM cooldown_activity_log")
            return {"success": True, "message": "All transactions, subscriptions, and goals cleared."}
        elif mode == "clear_demo_only":
            cursor.execute("DELETE FROM transactions WHERE is_demo = 1")
            cursor.execute("DELETE FROM subscriptions WHERE is_demo = 1")
            cursor.execute("DELETE FROM savings_goals WHERE is_demo = 1")
            return {"success": True, "message": "Demo data cleared. Only your custom entries remain."}
        elif mode == "restore":
            cursor.execute("DELETE FROM transactions")
            cursor.execute("DELETE FROM subscriptions")
            cursor.execute("DELETE FROM savings_goals")
            cursor.execute("DELETE FROM cooldown_activity_log")
            seed_demo_data(conn)
            return {"success": True, "message": "Demo data refreshed to clean baseline."}
