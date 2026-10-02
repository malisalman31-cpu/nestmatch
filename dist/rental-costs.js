// Compare user-entered quotes, not market prices or eligibility for housing.
const MAX_AMOUNT = 1_000_000;
function amount(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > MAX_AMOUNT) {
    throw new RangeError("Enter costs between $0 and $1,000,000.");
  }
  return Math.round(value * 100);
}

export function rentalCosts({ rent, utilities, fees, deposit, months, committedMonths }) {
  if (!Number.isInteger(months) || months < 1 || months > 120 ||
      !Number.isInteger(committedMonths) || committedMonths < months || committedMonths > 120) {
    throw new RangeError("Use 1–120 whole months. Commitment cannot be shorter than your planned stay.");
  }
  const monthly = amount(rent) + amount(utilities);
  const nonrefundable = amount(fees);
  const refundable = amount(deposit);
  const total = monthly * months + nonrefundable;
  return {
    monthly: monthly / 100,
    total: total / 100,
    effectiveMonthly: Math.round(total / months) / 100,
    initialCash: (monthly + nonrefundable + refundable) / 100,
    deposit: refundable / 100,
    // Illustrative base-rent commitment only; no assumed right to end a lease.
    remainingBaseRent: amount(rent) * (committedMonths - months) / 100,
  };
}
