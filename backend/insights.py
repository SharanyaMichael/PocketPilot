from datetime import datetime, timedelta
from collections import defaultdict
import statistics

def compute_insights(transactions, monthly_budget, min_savings_buffer):
    """
    Computes transparent, rule-based financial insights based strictly on
    the user's recorded transaction history.
    """
    insights = []
    
    if not transactions:
        return [
            {
                "id": "no-data",
                "type": "info",
                "title": "Awaiting Financial Data",
                "description": "Add your first income or expense transactions to unlock personalized spending intelligence and trend analysis.",
                "category": "General",
                "is_calculated": True
            }
        ]

    now = datetime.now()
    this_month_str = now.strftime("%Y-%m")
    last_month_date = (now.replace(day=1) - timedelta(days=1))
    last_month_str = last_month_date.strftime("%Y-%m")

    expenses = [t for t in transactions if t["type"] == "expense"]
    income = [t for t in transactions if t["type"] == "income"]

    total_expense = sum(t["amount"] for t in expenses)
    total_income = sum(t["amount"] for t in income)

    this_month_expenses = [t for t in expenses if t["date"].startswith(this_month_str)]
    last_month_expenses = [t for t in expenses if t["date"].startswith(last_month_str)]

    this_month_total = sum(t["amount"] for t in this_month_expenses)
    last_month_total = sum(t["amount"] for t in last_month_expenses)

    # 1. Budget Warnings
    if monthly_budget > 0:
        budget_used_pct = (this_month_total / monthly_budget) * 100
        if budget_used_pct >= 90:
            insights.append({
                "id": "budget-alert-high",
                "type": "warning",
                "title": f"Budget Utilization Alert: {budget_used_pct:.0f}%",
                "description": f"You have spent ₹{this_month_total:,.0f} of your ₹{monthly_budget:,.0f} monthly budget. Only ₹{max(0, monthly_budget - this_month_total):,.0f} remains for the month.",
                "category": "Budget",
                "is_calculated": True,
                "badge": "High Priority"
            })
        elif budget_used_pct >= 75:
            insights.append({
                "id": "budget-alert-med",
                "type": "warning",
                "title": f"Approaching Budget Limit: {budget_used_pct:.0f}% Consumed",
                "description": f"You have spent ₹{this_month_total:,.0f} of your ₹{monthly_budget:,.0f} monthly target. Consider pacing non-essential expenses.",
                "category": "Budget",
                "is_calculated": True,
                "badge": "Pacing Alert"
            })
        else:
            insights.append({
                "id": "budget-healthy",
                "type": "positive",
                "title": f"Healthy Budget Pacing ({budget_used_pct:.0f}%)",
                "description": f"You are well within your ₹{monthly_budget:,.0f} budget for {now.strftime('%B')}. ₹{monthly_budget - this_month_total:,.0f} remains unallocated.",
                "category": "Budget",
                "is_calculated": True,
                "badge": "On Track"
            })

    # 2. Highest Spending Category
    category_totals = defaultdict(float)
    for t in expenses:
        category_totals[t["category"]] += t["amount"]

    if category_totals:
        sorted_cats = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
        top_cat, top_amt = sorted_cats[0]
        cat_pct = (top_amt / total_expense * 100) if total_expense > 0 else 0

        insights.append({
            "id": "top-spending-category",
            "type": "info",
            "title": f"Top Expense Category: {top_cat}",
            "description": f"{top_cat} accounts for ₹{top_amt:,.0f} ({cat_pct:.1f}% of your total recorded expenses).",
            "category": top_cat,
            "is_calculated": True,
            "badge": "Volume Driver"
        })

    # 3. Month-over-Month Spending Changes
    if last_month_total > 0 and this_month_total > 0:
        change_pct = ((this_month_total - last_month_total) / last_month_total) * 100
        if change_pct > 0:
            insights.append({
                "id": "mom-increase",
                "type": "warning",
                "title": f"Spending Increased by {change_pct:.1f}% vs Last Month",
                "description": f"Total spending this month is ₹{this_month_total:,.0f} compared to ₹{last_month_total:,.0f} at the same time last month.",
                "category": "Trends",
                "is_calculated": True,
                "badge": "Trend"
            })
        else:
            insights.append({
                "id": "mom-decrease",
                "type": "positive",
                "title": f"Spending Decreased by {abs(change_pct):.1f}% vs Last Month",
                "description": f"Excellent discipline! You spent ₹{abs(this_month_total - last_month_total):,.0f} less than last month's equivalent window.",
                "category": "Trends",
                "is_calculated": True,
                "badge": "Savings Win"
            })

    # Category specific change (e.g. Food and Dining MoM)
    for check_cat in ["Food and Dining", "Shopping", "Transport"]:
        this_cat_amt = sum(t["amount"] for t in this_month_expenses if t["category"] == check_cat)
        last_cat_amt = sum(t["amount"] for t in last_month_expenses if t["category"] == check_cat)
        if last_cat_amt > 1000 and this_cat_amt > 0:
            diff_cat_pct = ((this_cat_amt - last_cat_amt) / last_cat_amt) * 100
            if abs(diff_cat_pct) >= 15:
                direction = "more" if diff_cat_pct > 0 else "less"
                insights.append({
                    "id": f"mom-{check_cat.lower().replace(' ', '-')}",
                    "type": "warning" if diff_cat_pct > 0 else "positive",
                    "title": f"{check_cat} Trend: {abs(diff_cat_pct):.0f}% {direction}",
                    "description": f"You spent ₹{this_cat_amt:,.0f} on {check_cat} this month, which is {abs(diff_cat_pct):.1f}% {direction} than last month (₹{last_cat_amt:,.0f}).",
                    "category": check_cat,
                    "is_calculated": True,
                    "badge": "Category Focus"
                })

    # 4. Unusually Large Transactions (Statistical Outliers > 2.0x standard deviation or top 5%)
    if len(expenses) >= 3:
        amounts = [t["amount"] for t in expenses]
        mean_amt = statistics.mean(amounts)
        try:
            stdev_amt = statistics.stdev(amounts)
            threshold = mean_amt + (1.5 * stdev_amt)
        except Exception:
            threshold = mean_amt * 2.0

        outliers = [t for t in expenses if t["amount"] > threshold and t["amount"] > 3000]
        if outliers:
            top_outlier = sorted(outliers, key=lambda x: x["amount"], reverse=True)[0]
            insights.append({
                "id": f"large-tx-{top_outlier['id']}",
                "type": "warning",
                "title": f"Spike Detected: ₹{top_outlier['amount']:,.0f} at {top_outlier['clean_merchant']}",
                "description": f"This payment is significantly higher than your typical average expense of ₹{mean_amt:,.0f}.",
                "category": top_outlier["category"],
                "is_calculated": True,
                "badge": "Anomalous"
            })

    # 5. Potential Savings Opportunities & Recurring patterns
    dining_and_quick = sum(t["amount"] for t in expenses if t["category"] == "Food and Dining")
    if dining_and_quick > 5000:
        potential_save = dining_and_quick * 0.20
        insights.append({
            "id": "savings-dining",
            "type": "positive",
            "title": f"Opportunity: Save ~₹{potential_save:,.0f}/mo on Dining & Takeout",
            "description": f"Current food and delivery spend is ₹{dining_and_quick:,.0f}. Cooking 2-3 extra meals a week can preserve over ₹{potential_save:,.0f} toward your savings targets.",
            "category": "Savings",
            "is_calculated": True,
            "badge": "Optimization"
        })

    # 6. Savings Buffer Health
    net_savings = total_income - total_expense
    if min_savings_buffer > 0:
        if net_savings >= min_savings_buffer:
            insights.append({
                "id": "buffer-healthy",
                "type": "positive",
                "title": "Emergency Buffer Intact",
                "description": f"Your net operating surplus is ₹{net_savings:,.0f}, maintaining your ₹{min_savings_buffer:,.0f} minimum safety cushion.",
                "category": "Safety Buffer",
                "is_calculated": True,
                "badge": "Secured"
            })
        elif net_savings < 0:
            insights.append({
                "id": "buffer-deficit",
                "type": "negative",
                "title": "Operating Deficit Alert",
                "description": f"Recorded expenses exceed income by ₹{abs(net_savings):,.0f}. Tap into Cooling-Off mode to curb non-essential outflows.",
                "category": "Safety Buffer",
                "is_calculated": True,
                "badge": "Critical"
            })

    return insights
