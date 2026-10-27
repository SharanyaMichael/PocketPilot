import sqlite3
import os
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "pocketpilot.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_db():
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Transactions table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            clean_merchant TEXT NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            notes TEXT DEFAULT '',
            is_demo INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Subscriptions table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            amount REAL NOT NULL,
            billing_frequency TEXT NOT NULL CHECK(billing_frequency IN ('monthly', 'yearly')),
            next_billing_date TEXT NOT NULL,
            category TEXT NOT NULL,
            notes TEXT DEFAULT '',
            is_demo INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Savings Goals table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS savings_goals (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            target_amount REAL NOT NULL,
            current_amount REAL NOT NULL DEFAULT 0,
            target_date TEXT NOT NULL,
            description TEXT DEFAULT '',
            is_demo INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Global Cooling-Off Session (Singleton state, always id=1)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS cooldown_session (
            id INTEGER PRIMARY KEY CHECK(id = 1),
            is_active INTEGER NOT NULL DEFAULT 0,
            start_time TEXT,
            duration_seconds INTEGER DEFAULT 0,
            expiry_time TEXT,
            reason TEXT DEFAULT ''
        )
        """)
        
        # Ensure single row exists in cooldown_session
        cursor.execute("SELECT id FROM cooldown_session WHERE id = 1")
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO cooldown_session (id, is_active, start_time, duration_seconds, expiry_time, reason)
            VALUES (1, 0, NULL, 0, NULL, '')
            """)

        # Cooldown Activity Log table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS cooldown_activity_log (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            attempted_amount REAL NOT NULL,
            merchant TEXT NOT NULL,
            category TEXT NOT NULL,
            action_taken TEXT NOT NULL CHECK(action_taken IN ('cancelled', 'continued', 'overrode')),
            notes TEXT DEFAULT ''
        )
        """)

        # User Settings table (key-value)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
        """)

        # Default settings if not already present
        defaults = {
            "monthly_budget": "65000",
            "min_savings_buffer": "20000",
            "preferred_currency": "INR",
            "currency_symbol": "₹",
            "demo_mode_enabled": "1"
        }
        for k, v in defaults.items():
            cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (k, v))
            
        print("Database initialized successfully.")
