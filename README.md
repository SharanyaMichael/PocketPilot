# PocketPilot — AI Personal Finance Manager

[![Theme: Obsidian + Emerald](https://img.shields.io/badge/Theme-Obsidian%20%2B%20Emerald-10B981?style=flat-square)](#design-system)
[![Backend: FastAPI + SQLite](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLite-009688?style=flat-square)](#technology-stack)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square)](#technology-stack)

> **PocketPilot** is a high-end, responsive personal finance web application built for mindful spending, cash flow telemetry, and impulse prevention. Powered by a deterministic intelligence engine and an Obsidian + Emerald Green fintech design system.

---

## 💎 Design System — Obsidian + Emerald Green

Built specifically with the fintech obsidian aesthetic:

| Surface / Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Main Background** | `#050B09` | Deep obsidian backdrop |
| **Sidebar Background** | `#091510` | Elevated dark jade navigation rail |
| **Primary Card Background** | `#0D1D16` | Rounded elevated card panels |
| **Secondary Surfaces** | `#11251B` | Input fields, active navigation pills, hover states |
| **Primary Accent** | `#10B981` | Emerald branding, primary CTAs, positive accents |
| **Mint Highlight** | `#6EE7B7` | Glow accents, focused typography, progress fills |
| **Main Text** | `#F0FDF4` | High-contrast mint-white text |
| **Secondary Text** | `#A7C4B5` | Muted sage secondary typography |
| **Card Borders** | `rgba(110, 231, 183, 0.16)` | Subtle frosted glassmorphic borders |
| **Positive Indicator** | `#34D399` | Income inflow, savings completions, positive alerts |
| **Warning Indicator** | `#FBBF24` | Budget thresholds, approaching renewals |
| **Negative Indicator** | `#FB7185` | Expenses, budget deficits, cooling-off overrides |

---

## ⚡ Key Features

### 1. 🛡️ Global Cooling-Off Mode (Core Differentiator)
A psychological friction barrier against impulsive e-commerce and retail spending:
* **One Persistent Global Session:** Configurable for 5m, 15m, 30m, 1h, or custom durations.
* **Persistent Expiry Timestamp:** Survives page transitions, browser refreshes, and server restarts.
* **Backend-Enforced Expense Interception:** When active, any expense attempt submitted inside PocketPilot is blocked at the API layer (HTTP 423 Locked) and opens the Interception Modal.
* **Three Strict Action Outcomes:**
  1. **Cancel Purchase:** Discards the expense, logs the saved amount to the Cooldown Activity Log, keeps cooldown active.
  2. **Continue Cooldown:** Pauses without saving or modifying the timer.
  3. **Yes, I Want to Spend:** Explicit override; saves the expense, logs the override, keeps cooldown running until its original expiry.
* **Income Unblocked:** Inflow transactions pass through freely without friction.
* **Honest Disclaimer:** Clearly highlights that PocketPilot intercepts within the app and does not claim to lock external third-party UPI or card hardware.

### 2. 📊 Financial Overview / Dashboard
* **5 Live KPI Telemetry Cards:** Total Available Balance, Monthly Income, Monthly Expenses, Savings Reserves, and Monthly Budget Remaining.
* **Income vs Expenses Bar Chart:** 6-month historical cash flow trends via Recharts.
* **Category Breakdown Donut Chart:** Interactive proportional expense distribution.
* **Recent Transactions & Upcoming Renewals:** Real-time ledger updates.
* **Personalized Spending Observations:** Real-time feedback generated strictly from data.

### 3. 💳 Transaction Management & Deterministic UPI Narration Cleaning
* Full CRUD for expenses and income entries.
* **Deterministic UPI Narration Cleaner:** Cleans messy raw bank tags (e.g. `UPI/P2A/987654/STARBUCKS INDIA` → `Starbucks`, `UPI-123456-SWIGGY BANGALORE-OKAXIS` → `Swiggy Food Delivery`).
* Real-time category suggestion based on merchant keyword mapping.
* Multi-parameter filtering: category, type, date range, and free-text search.
* Currency formatted in Indian Rupees (`₹1,25,000`).

### 4. 🧠 Smart Spending Insights (Deterministic Intelligence)
* Highest spending category analysis and volume contribution.
* Month-over-month (MoM) comparative variance.
* Anomalous transaction spike detection via statistical thresholding (1.5x standard deviation).
* Potential monthly savings suggestions.
* Emergency safety buffer health audits.

### 5. 🔄 Subscription Manager
* Tracks recurring SaaS, streaming services, and utility bills.
* Supports both monthly and yearly billing cycles with automated monthly-equivalent calculations.
* Urgency badges (`Due in X days`, `Renewal Passed`) for upcoming renewals.

### 6. 🎯 Savings Goals
* Multi-target portfolio tracking (e.g. Emergency Reserve, Workstation Upgrade, Vacation Fund).
* Individual progress bars and completion percentages.
* **Deposit Money Action:** Adds money toward a goal (without miscounting it as new income).
* Triggers celebratory confetti upon reaching 100% target!

### 7. ⚖️ Affordability Checker
* Mathematical decision engine assessing planned purchases against liquid reserves, monthly budget pacing, and user-configured minimum safety buffers.
* Returns three transparent verdicts:
  * 🟢 **Affordable**
  * 🟡 **Affordable with caution**
  * 🔴 **Not recommended right now**
* Includes 4 preset test scenarios (`iPhone 16 Pro`, `Sony Headphones`, `Dinner`, `Standing Desk`) for instant evaluation.

### 8. ⚙️ Settings & Privacy Architecture
* User-configurable monthly budget and minimum savings buffer.
* Demo Data Controls: Reset to baseline demo data, clear demo records while keeping custom data, or perform a total clean slate.
* **Zero-Knowledge Privacy:** No bank passwords, UPI PINs, or credentials requested.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, React Router, Recharts, Lucide React, Canvas Confetti.
* **Backend:** Python 3.12, FastAPI, SQLite3 with connection pooling and schema initialization.
* **API Architecture:** RESTful endpoints with CORS, Pydantic validation, and custom HTTP 423 Cooldown Interception.

---

## 🚀 How to Run the Application

### Option A: One-Command All-in-One Launcher (Recommended)
Run the automated launcher script from the workspace root:

```bash
python start_app.py
```
*(Or on Windows, simply double-click `start.bat`)*

This script automatically:
1. Initializes and seeds the SQLite database (`backend/pocketpilot.db`).
2. Starts the FastAPI backend server on `http://127.0.0.1:8000`.
3. Starts the Vite frontend on `http://localhost:5173`.

### Option B: Running Separately

**1. Launch FastAPI Backend:**
```bash
python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

**2. Launch Vite Frontend:**
```bash
npm run dev
```

Open your browser to:
* **Frontend Application:** [http://localhost:5173](http://localhost:5173)
* **Interactive API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 Automated Test Suite

A complete verification suite is included in `backend/test_suite.py`:
```bash
python backend/test_suite.py
```
Validates:
* Database initialization & summary telemetry calculations.
* UPI narration cleaning & category inference.
* Cooling-off activation, timer persistence, and HTTP 423 expense interception.
* Unblocked income processing during active cooldown.
* Subscription annualized & monthly equivalent formulas.
* Goal contribution and progress tracking.
* Affordability engine verdicts.

---

## 🔒 Limitations & Disclaimers

1. **App-Level Interception:** PocketPilot intercepts and pauses expense creation within its own software interface. It cannot physically halt card swipes or external UPI payments without bank open-API authorizations.
2. **Deterministic Rules:** AI observations are computed mathematically from transaction variance rather than black-box simulated LLM predictions.
3. **Local Persistence:** Data is stored locally in the workspace SQLite database and browser memory. Clearing local storage or deleting `pocketpilot.db` will reset the ledger.
