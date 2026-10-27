import uuid
from datetime import datetime, timedelta
import random

def get_demo_transactions():
    now = datetime.now()
    transactions = [
        # Income
        {
            "id": "demo-inc-1",
            "description": "ACH CRED SALARY TECHCORP INDIA",
            "clean_merchant": "TechCorp India Monthly Salary",
            "amount": 95000.0,
            "type": "income",
            "category": "Income",
            "date": (now - timedelta(days=26)).strftime("%Y-%m-%d"),
            "notes": "Direct payroll deposit",
            "is_demo": 1
        },
        {
            "id": "demo-inc-2",
            "description": "NEFT CR FREELANCE UI CONSULTING",
            "clean_merchant": "Freelance UI Consulting",
            "amount": 28000.0,
            "type": "income",
            "category": "Income",
            "date": (now - timedelta(days=12)).strftime("%Y-%m-%d"),
            "notes": "Design sprint milestone payout",
            "is_demo": 1
        },
        # Fixed & Housing
        {
            "id": "demo-exp-1",
            "description": "UPI/P2M/987123/NOBROKER RENT BANGALORE",
            "clean_merchant": "NoBroker Apartment Rent",
            "amount": 26000.0,
            "type": "expense",
            "category": "Housing",
            "date": (now - timedelta(days=25)).strftime("%Y-%m-%d"),
            "notes": "Monthly 2BHK apartment rent",
            "is_demo": 1
        },
        {
            "id": "demo-exp-2",
            "description": "BBPS/BESCOM ELECTRICITY BILL 560001",
            "clean_merchant": "Electricity BESCOM",
            "amount": 1850.0,
            "type": "expense",
            "category": "Bills and Utilities",
            "date": (now - timedelta(days=22)).strftime("%Y-%m-%d"),
            "notes": "Power utility bill",
            "is_demo": 1
        },
        {
            "id": "demo-exp-3",
            "description": "UPI/AIRTEL FIBER BROADBAND BILL",
            "clean_merchant": "Airtel Fiber Broadband",
            "amount": 1179.0,
            "type": "expense",
            "category": "Bills and Utilities",
            "date": (now - timedelta(days=20)).strftime("%Y-%m-%d"),
            "notes": "300 Mbps fiber internet",
            "is_demo": 1
        },
        # Food & Dining
        {
            "id": "demo-exp-4",
            "description": "UPI/P2A/987654/STARBUCKS INDIA",
            "clean_merchant": "Starbucks Coffee",
            "amount": 420.0,
            "type": "expense",
            "category": "Food and Dining",
            "date": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
            "notes": "Work meeting over Flat White",
            "is_demo": 1
        },
        {
            "id": "demo-exp-5",
            "description": "UPI/SWIGGY FOOD ORDER BENGALURU",
            "clean_merchant": "Swiggy Food Delivery",
            "amount": 680.0,
            "type": "expense",
            "category": "Food and Dining",
            "date": (now - timedelta(days=3)).strftime("%Y-%m-%d"),
            "notes": "Dinner with friends",
            "is_demo": 1
        },
        {
            "id": "demo-exp-6",
            "description": "POS ZOMATO RESTAURANT DINING",
            "clean_merchant": "Zomato Dining",
            "amount": 1450.0,
            "type": "expense",
            "category": "Food and Dining",
            "date": (now - timedelta(days=8)).strftime("%Y-%m-%d"),
            "notes": "Weekend dinner buffet",
            "is_demo": 1
        },
        {
            "id": "demo-exp-7",
            "description": "UPI/BLINKIT INSTANT GROCERY STORE",
            "clean_merchant": "Blinkit Quick Commerce",
            "amount": 920.0,
            "type": "expense",
            "category": "Food and Dining",
            "date": (now - timedelta(days=5)).strftime("%Y-%m-%d"),
            "notes": "Weekly fruits & pantry essentials",
            "is_demo": 1
        },
        # Transport
        {
            "id": "demo-exp-8",
            "description": "UPI/UBER INDIA SYSTEMS PVT LTD",
            "clean_merchant": "Uber India Cabs",
            "amount": 380.0,
            "type": "expense",
            "category": "Transport",
            "date": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
            "notes": "Commute to co-working hub",
            "is_demo": 1
        },
        {
            "id": "demo-exp-9",
            "description": "POS HPCL PETROL PUMP WHITEFIELD",
            "clean_merchant": "HPCL Petrol Fuel Station",
            "amount": 2500.0,
            "type": "expense",
            "category": "Transport",
            "date": (now - timedelta(days=14)).strftime("%Y-%m-%d"),
            "notes": "Car fuel refill",
            "is_demo": 1
        },
        # Shopping
        {
            "id": "demo-exp-10",
            "description": "AMZN/MKTPLACE RETAIL PYMT 78392",
            "clean_merchant": "Amazon Marketplace",
            "amount": 3499.0,
            "type": "expense",
            "category": "Shopping",
            "date": (now - timedelta(days=10)).strftime("%Y-%m-%d"),
            "notes": "Ergonomic laptop stand & cable organizer",
            "is_demo": 1
        },
        {
            "id": "demo-exp-11",
            "description": "POS 401243XXXXXX UNIQLO INDIRANAGAR",
            "clean_merchant": "Uniqlo Retail",
            "amount": 4990.0,
            "type": "expense",
            "category": "Shopping",
            "date": (now - timedelta(days=16)).strftime("%Y-%m-%d"),
            "notes": "Office casual linen shirt & chinos",
            "is_demo": 1
        },
        # Healthcare & Wellness
        {
            "id": "demo-exp-12",
            "description": "UPI/APOLLO PHARMACY ONLINE 4910",
            "clean_merchant": "Apollo Pharmacy",
            "amount": 840.0,
            "type": "expense",
            "category": "Healthcare",
            "date": (now - timedelta(days=7)).strftime("%Y-%m-%d"),
            "notes": "Daily multivitamins and first aid refill",
            "is_demo": 1
        },
        # Entertainment
        {
            "id": "demo-exp-13",
            "description": "BOOKMYSHOW PVR IMAX FORUM MALL",
            "clean_merchant": "BookMyShow PVR Cinemas",
            "amount": 960.0,
            "type": "expense",
            "category": "Entertainment",
            "date": (now - timedelta(days=6)).strftime("%Y-%m-%d"),
            "notes": "Sci-fi IMAX evening tickets",
            "is_demo": 1
        },
        # Subscriptions
        {
            "id": "demo-exp-14",
            "description": "AUTO-DEBIT NETFLIX PREMIUM 4K",
            "clean_merchant": "Netflix India",
            "amount": 649.0,
            "type": "expense",
            "category": "Subscriptions",
            "date": (now - timedelta(days=18)).strftime("%Y-%m-%d"),
            "notes": "Monthly family 4K plan",
            "is_demo": 1
        },
        {
            "id": "demo-exp-15",
            "description": "AUTO-DEBIT SPOTIFY INDIVIDUAL",
            "clean_merchant": "Spotify Premium",
            "amount": 119.0,
            "type": "expense",
            "category": "Subscriptions",
            "date": (now - timedelta(days=15)).strftime("%Y-%m-%d"),
            "notes": "Ad-free music stream",
            "is_demo": 1
        }
    ]
    return transactions

def get_demo_subscriptions():
    now = datetime.now()
    return [
        {
            "id": "sub-1",
            "name": "Netflix Premium",
            "amount": 649.0,
            "billing_frequency": "monthly",
            "next_billing_date": (now + timedelta(days=12)).strftime("%Y-%m-%d"),
            "category": "Entertainment",
            "notes": "Family 4-screen plan",
            "is_demo": 1
        },
        {
            "id": "sub-2",
            "name": "Spotify Premium",
            "amount": 119.0,
            "billing_frequency": "monthly",
            "next_billing_date": (now + timedelta(days=15)).strftime("%Y-%m-%d"),
            "category": "Entertainment",
            "notes": "Individual student/personal",
            "is_demo": 1
        },
        {
            "id": "sub-3",
            "name": "ChatGPT Plus",
            "amount": 1999.0,
            "billing_frequency": "monthly",
            "next_billing_date": (now + timedelta(days=4)).strftime("%Y-%m-%d"),
            "category": "Education",
            "notes": "AI research assistant",
            "is_demo": 1
        },
        {
            "id": "sub-4",
            "name": "Amazon Prime",
            "amount": 1499.0,
            "billing_frequency": "yearly",
            "next_billing_date": (now + timedelta(days=68)).strftime("%Y-%m-%d"),
            "category": "Shopping",
            "notes": "Annual delivery & video membership",
            "is_demo": 1
        },
        {
            "id": "sub-5",
            "name": "Google One (2TB Cloud)",
            "amount": 6500.0,
            "billing_frequency": "yearly",
            "next_billing_date": (now + timedelta(days=110)).strftime("%Y-%m-%d"),
            "category": "Bills and Utilities",
            "notes": "Annual cloud storage backup",
            "is_demo": 1
        }
    ]

def get_demo_savings_goals():
    now = datetime.now()
    return [
        {
            "id": "goal-1",
            "name": "Emergency Fund (6 Months)",
            "target_amount": 200000.0,
            "current_amount": 145000.0,
            "target_date": (now + timedelta(days=180)).strftime("%Y-%m-%d"),
            "description": "Liquid high-yield reserve for unplanned medical or job transitions",
            "is_demo": 1
        },
        {
            "id": "goal-2",
            "name": "M4 MacBook Pro Upgrade",
            "target_amount": 180000.0,
            "current_amount": 92000.0,
            "target_date": (now + timedelta(days=90)).strftime("%Y-%m-%d"),
            "description": "Tech workstation upgrade for AI dev and design workflows",
            "is_demo": 1
        },
        {
            "id": "goal-3",
            "name": "Japan Autumn Vacation",
            "target_amount": 150000.0,
            "current_amount": 60000.0,
            "target_date": (now + timedelta(days=240)).strftime("%Y-%m-%d"),
            "description": "Flights, JR pass, and Tokyo-Kyoto stay",
            "is_demo": 1
        }
    ]

def get_demo_cooldown_logs():
    now = datetime.now()
    return [
        {
            "id": "cd-log-1",
            "timestamp": (now - timedelta(days=4, hours=3)).strftime("%Y-%m-%d %H:%M:%S"),
            "attempted_amount": 14999.0,
            "merchant": "Mechanical Keyboard Custom Build",
            "category": "Shopping",
            "action_taken": "cancelled",
            "notes": "Saved ₹14,999 after stepping back during 30m cooldown"
        },
        {
            "id": "cd-log-2",
            "timestamp": (now - timedelta(days=2, hours=5)).strftime("%Y-%m-%d %H:%M:%S"),
            "attempted_amount": 4200.0,
            "merchant": "Sneaker Limited Drop",
            "category": "Shopping",
            "action_taken": "continued",
            "notes": "Decided to wait out the cooldown timer and didn't purchase"
        },
        {
            "id": "cd-log-3",
            "timestamp": (now - timedelta(days=1, hours=8)).strftime("%Y-%m-%d %H:%M:%S"),
            "attempted_amount": 3499.0,
            "merchant": "Amazon Ergonomic Laptop Stand",
            "category": "Shopping",
            "action_taken": "overrode",
            "notes": "Essential ergonomic purchase confirmed during cooldown"
        }
    ]

def seed_demo_data(conn):
    cursor = conn.cursor()
    # Check if transactions already exist
    cursor.execute("SELECT COUNT(*) as cnt FROM transactions")
    if cursor.fetchone()["cnt"] == 0:
        for t in get_demo_transactions():
            cursor.execute("""
            INSERT INTO transactions (id, description, clean_merchant, amount, type, category, date, notes, is_demo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (t["id"], t["description"], t["clean_merchant"], t["amount"], t["type"], t["category"], t["date"], t["notes"], t["is_demo"]))

    cursor.execute("SELECT COUNT(*) as cnt FROM subscriptions")
    if cursor.fetchone()["cnt"] == 0:
        for s in get_demo_subscriptions():
            cursor.execute("""
            INSERT INTO subscriptions (id, name, amount, billing_frequency, next_billing_date, category, notes, is_demo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (s["id"], s["name"], s["amount"], s["billing_frequency"], s["next_billing_date"], s["category"], s["notes"], s["is_demo"]))

    cursor.execute("SELECT COUNT(*) as cnt FROM savings_goals")
    if cursor.fetchone()["cnt"] == 0:
        for g in get_demo_savings_goals():
            cursor.execute("""
            INSERT INTO savings_goals (id, name, target_amount, current_amount, target_date, description, is_demo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (g["id"], g["name"], g["target_amount"], g["current_amount"], g["target_date"], g["description"], g["is_demo"]))

    cursor.execute("SELECT COUNT(*) as cnt FROM cooldown_activity_log")
    if cursor.fetchone()["cnt"] == 0:
        for cl in get_demo_cooldown_logs():
            cursor.execute("""
            INSERT INTO cooldown_activity_log (id, timestamp, attempted_amount, merchant, category, action_taken, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (cl["id"], cl["timestamp"], cl["attempted_amount"], cl["merchant"], cl["category"], cl["action_taken"], cl["notes"]))
