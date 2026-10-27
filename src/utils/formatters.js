/**
 * Formats a numeric value into Indian Rupee or specified currency representation.
 * Examples: 125000 -> ₹1,25,000
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: num % 1 === 0 ? 0 : 2,
    }).format(num);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format ISO or standard YYYY-MM-DD date string
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format seconds into mm:ss or hh:mm:ss
 */
export function formatCountdown(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const CATEGORIES = [
  'Food and Dining',
  'Shopping',
  'Transport',
  'Bills and Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Subscriptions',
  'Housing',
  'Income',
  'Other'
];

export const CATEGORY_COLORS = {
  'Food and Dining': '#10B981',       // Emerald
  'Shopping': '#6EE7B7',              // Mint
  'Transport': '#38BDF8',             // Sky
  'Bills and Utilities': '#FBBF24',    // Amber
  'Entertainment': '#A78BFA',         // Lavender
  'Healthcare': '#FB7185',            // Rose
  'Education': '#818CF8',             // Indigo
  'Subscriptions': '#34D399',         // Light green
  'Housing': '#F472B6',               // Pink
  'Income': '#34D399',                // Positive green
  'Other': '#94A3B8'                  // Slate
};
