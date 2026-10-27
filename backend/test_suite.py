import sys
import os
import unittest
from datetime import datetime, timedelta

# Append backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

import database
import demo_seed
import main
from models import (
    TransactionCreate, CooldownActivateRequest, CooldownInterceptAction,
    SubscriptionCreate, SavingsGoalCreate, SavingsGoalContribution, AffordabilityRequest
)

class TestPocketPilot(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        database.init_db()
        with database.get_db() as conn:
            demo_seed.seed_demo_data(conn)

    def test_01_summary(self):
        data = main.get_summary()
        self.assertIn("available_balance", data)
        self.assertIn("monthly_income", data)
        self.assertIn("monthly_expenses", data)
        self.assertIn("category_breakdown", data)
        self.assertIn("monthly_trends", data)
        print(f"Test 1: get_summary OK. Available balance: INR {data['available_balance']:,.2f}")

    def test_02_upi_cleaning(self):
        res = main.clean_narration_endpoint({"text": "UPI/P2A/987654/STARBUCKS INDIA"})
        self.assertEqual(res["cleaned_merchant"], "Starbucks")
        self.assertEqual(res["suggested_category"], "Food and Dining")

        res2 = main.clean_narration_endpoint({"text": "UPI-123456-SWIGGY BANGALORE-OKAXIS"})
        self.assertIn("Swiggy", res2["cleaned_merchant"])
        print(f"Test 2: UPI Narration Cleaning OK -> {res['cleaned_merchant']}")

    def test_03_cooldown_activation_and_interception(self):
        # 1. Activate cooldown for 900 seconds
        state = main.activate_cooldown(CooldownActivateRequest(duration_seconds=900, reason="Impulse check"))
        self.assertTrue(state["is_active"])
        self.assertGreater(state["remaining_seconds"], 0)

        # 2. Attempt to add expense during active cooldown -> MUST raise HTTPException 423
        expense = TransactionCreate(
            description="Sony Wireless Gaming Headset",
            amount=6499.0,
            type="expense",
            category="Shopping",
            date=datetime.now().strftime("%Y-%m-%d"),
            override_cooldown=False
        )
        try:
            main.create_transaction(expense)
            self.fail("Expected HTTPException 423 for intercepted expense")
        except main.HTTPException as he:
            self.assertEqual(he.status_code, 423)
            self.assertIn("Cooling-off mode is active", he.detail["message"])
            print("Test 3a: Expense was successfully intercepted with HTTP 423 Locked!")

        # 3. Add income during cooldown -> should succeed unblocked!
        income = TransactionCreate(
            description="Freelance Mobile App Retainer",
            amount=25000.0,
            type="income",
            category="Income",
            date=datetime.now().strftime("%Y-%m-%d")
        )
        created_inc = main.create_transaction(income)
        self.assertEqual(created_inc["type"], "income")
        print("Test 3b: Income passed unblocked during active cooldown!")

        # 4. Action 1: Cancel purchase log
        cancel_log = main.log_cooldown_intercept_action(CooldownInterceptAction(
            action="cancelled",
            attempted_amount=6499.0,
            merchant="Sony Wireless Gaming Headset",
            category="Shopping",
            notes="Cancelled during cooling off"
        ))
        self.assertTrue(cancel_log["success"])

        # 5. Action 3: Override cooldown and save
        expense.override_cooldown = True
        created_exp = main.create_transaction(expense)
        self.assertEqual(created_exp["amount"], 6499.0)
        print("Test 3c: Expense recorded with override_cooldown=True!")

        # 6. Stop session
        main.cancel_cooldown_session()
        cd_now = main.get_cooldown()
        self.assertFalse(cd_now["is_active"])

    def test_04_subscriptions(self):
        sub = main.create_subscription(SubscriptionCreate(
            name="Linear App Workspace",
            amount=960.0,
            billing_frequency="monthly",
            next_billing_date=(datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"),
            category="Education"
        ))
        self.assertEqual(sub["monthly_equivalent"], 960.0)

        sub_yr = main.create_subscription(SubscriptionCreate(
            name="1Password Family Plan",
            amount=4800.0,
            billing_frequency="yearly",
            next_billing_date=(datetime.now() + timedelta(days=180)).strftime("%Y-%m-%d"),
            category="Bills and Utilities"
        ))
        self.assertEqual(sub_yr["monthly_equivalent"], 400.0)
        print(f"Test 4: Subscriptions OK (Monthly eq: INR {sub_yr['monthly_equivalent']}/mo)")

    def test_05_savings_goals(self):
        goal = main.create_savings_goal(SavingsGoalCreate(
            name="Tokyo Vacation Fund",
            target_amount=100000.0,
            current_amount=25000.0,
            target_date=(datetime.now() + timedelta(days=150)).strftime("%Y-%m-%d"),
            description="Autumn trip"
        ))
        self.assertEqual(goal["progress_percentage"], 25.0)

        updated = main.contribute_to_goal(goal["id"], SavingsGoalContribution(amount=10000.0))
        self.assertEqual(updated["current_amount"], 35000.0)
        self.assertEqual(updated["progress_percentage"], 35.0)
        print(f"Test 5: Savings Goal contribution OK. New progress: {updated['progress_percentage']}%")

    def test_06_affordability(self):
        res_ok = main.evaluate_affordability(AffordabilityRequest(
            item_name="Wireless Ergonomic Mouse",
            item_price=1200.0,
            category="Shopping"
        ))
        self.assertIn(res_ok.verdict, ["Affordable", "Affordable with caution"])

        res_huge = main.evaluate_affordability(AffordabilityRequest(
            item_name="Supercar Downpayment",
            item_price=10000000.0,
            category="Shopping"
        ))
        self.assertEqual(res_huge.verdict, "Not recommended right now")
        print(f"Test 6: Affordability engine assessed correctly -> {res_huge.verdict}")

if __name__ == "__main__":
    unittest.main()
