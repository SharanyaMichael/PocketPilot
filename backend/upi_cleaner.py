import re

KNOWN_MERCHANTS = {
    "STARBUCKS": ("Starbucks", "Food and Dining"),
    "SWIGGY": ("Swiggy", "Food and Dining"),
    "ZOMATO": ("Zomato", "Food and Dining"),
    "MCDONALD": ("McDonald's", "Food and Dining"),
    "DOMINOS": ("Domino's Pizza", "Food and Dining"),
    "KFC": ("KFC", "Food and Dining"),
    "CHAAYOS": ("Chaayos", "Food and Dining"),
    "BLUE TOKAI": ("Blue Tokai Coffee", "Food and Dining"),
    "UBER": ("Uber", "Transport"),
    "OLA": ("Ola Cabs", "Transport"),
    "RAPIDO": ("Rapido", "Transport"),
    "METRO": ("Metro Rail", "Transport"),
    "IRCTC": ("IRCTC Railways", "Transport"),
    "INDIGO": ("IndiGo Airlines", "Transport"),
    "AMAZON": ("Amazon", "Shopping"),
    "FLIPKART": ("Flipkart", "Shopping"),
    "MYNTRA": ("Myntra", "Shopping"),
    "AJIO": ("Ajio", "Shopping"),
    "BLINKIT": ("Blinkit", "Food and Dining"),
    "ZEPTO": ("Zepto", "Food and Dining"),
    "INSTAMART": ("Swiggy Instamart", "Food and Dining"),
    "BIGBASKET": ("BigBasket", "Food and Dining"),
    "NETFLIX": ("Netflix", "Subscriptions"),
    "SPOTIFY": ("Spotify", "Subscriptions"),
    "YOUTUBE": ("YouTube Premium", "Subscriptions"),
    "HOTSTAR": ("Disney+ Hotstar", "Subscriptions"),
    "PRIME": ("Amazon Prime", "Subscriptions"),
    "APPLE": ("Apple Services", "Subscriptions"),
    "GOOGLE": ("Google Services", "Subscriptions"),
    "AIRTEL": ("Airtel Telecom", "Bills and Utilities"),
    "JIO": ("Jio Telecom", "Bills and Utilities"),
    "BESCOM": ("Electricity BESCOM", "Bills and Utilities"),
    "ADANI": ("Adani Electricity", "Bills and Utilities"),
    "TATA POWER": ("Tata Power", "Bills and Utilities"),
    "APOLLO": ("Apollo Pharmacy", "Healthcare"),
    "1MG": ("Tata 1mg", "Healthcare"),
    "PHARMEASY": ("PharmEasy", "Healthcare"),
    "PVR": ("PVR Cinemas", "Entertainment"),
    "INOX": ("INOX Movies", "Entertainment"),
    "BOOKMYSHOW": ("BookMyShow", "Entertainment"),
    "UDEMY": ("Udemy", "Education"),
    "COURSERA": ("Coursera", "Education"),
    "NOBROKER": ("NoBroker Rent", "Housing"),
    "SALARY": ("Monthly Salary", "Income"),
    "FREELANCE": ("Freelance Project", "Income"),
    "DIVIDEND": ("Stock Dividend", "Income"),
    "INTEREST": ("Savings Interest", "Income"),
}

CATEGORY_KEYWORDS = {
    "Food and Dining": ["cafe", "coffee", "restaurant", "bistro", "bakery", "kitchen", "diner", "food", "tea", "canteen", "bar"],
    "Shopping": ["store", "mart", "retail", "fashion", "mall", "clothing", "bazaar", "apparel"],
    "Transport": ["fuel", "petrol", "diesel", "parking", "toll", "cab", "auto", "taxi"],
    "Bills and Utilities": ["electric", "water", "gas", "broadband", "wifi", "bill", "recharge"],
    "Entertainment": ["cinema", "theatre", "movie", "gaming", "amusement"],
    "Healthcare": ["hospital", "clinic", "dental", "meds", "diagnostics", "lab", "health"],
    "Education": ["tuition", "school", "college", "books", "academy", "course"],
    "Housing": ["rent", "maintenance", "society", "pg", "deposit"]
}

def clean_narration(raw_text: str):
    """
    Deterministic rule-based cleaner for UPI and transaction narrations.
    Strips noise prefixes: UPI/P2A, UPI/P2M, NEFT, RTGS, IMPS, POS, etc.
    """
    if not raw_text:
        return "Unknown Transaction", "Other"

    text = raw_text.strip()
    upper = text.upper()

    # Match known merchants first
    for key, (clean_name, category) in KNOWN_MERCHANTS.items():
        if key in upper:
            return clean_name, category

    # Common UPI prefixes and noise patterns
    # e.g., UPI/P2A/987654/STARBUCKS INDIA
    # UPI-123456-MERCHANT-OKAXIS
    # POS 401243XXXXXX MERCHANT GURGAON
    cleaned = text

    # Remove standard banking rails and tags
    cleaned = re.sub(r'^(UPI[/_-]?|NEFT[/_-]?|RTGS[/_-]?|IMPS[/_-]?|POS[/_-]?|NACH[/_-]?)', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'(P2A|P2M|DR|CR)[/_-]', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'[/_-]?\d{4,}[/_-]?', ' ', cleaned) # Remove long ref numbers
    cleaned = re.sub(r'@[a-zA-Z0-9]+', '', cleaned) # Remove VPA handles like @okhdfcbank
    cleaned = re.sub(r'(\b\d{4}X+\d{4}\b|\bX+\d{4}\b)', '', cleaned) # Card masks
    cleaned = re.sub(r'\b(BANGALORE|BENGALURU|MUMBAI|DELHI|PUNE|HYDERABAD|CHENNAI|KOLKATA|GURGAON|NOIDA|INDIA)\b', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'[\\/_+*#|]', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    if not cleaned or len(cleaned) < 2:
        cleaned = text.title()
    else:
        # Title case cleaned string
        cleaned = cleaned.title()

    # Determine fallback category by keywords
    detected_cat = "Other"
    clean_upper = cleaned.upper()
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(kw.upper() in clean_upper for kw in kws):
            detected_cat = cat
            break

    return cleaned, detected_cat
