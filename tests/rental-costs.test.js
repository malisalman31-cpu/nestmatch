import test from "node:test";
import assert from "node:assert/strict";
import { rentalCosts } from "../dist/rental-costs.js";

const quote = { rent: 2000, utilities: 200, fees: 300, deposit: 2000, months: 3, committedMonths: 3 };
test("calculates an itemized stay without counting deposit as permanent cost", () => {
  assert.deepEqual(rentalCosts(quote), { monthly: 2200, total: 6900, effectiveMonthly: 2300, initialCash: 4500, deposit: 2000, remainingBaseRent: 0 });
});
test("shows base rent committed beyond the planned stay", () => {
  assert.equal(rentalCosts({ ...quote, committedMonths: 12 }).remainingBaseRent, 18000);
});
test("handles zero-cost inputs and the full supported stay", () => {
  assert.equal(rentalCosts({ rent: 0, utilities: 0, fees: 0, deposit: 0, months: 120, committedMonths: 120 }).total, 0);
});
test("uses cents and rounds effective monthly cost", () => {
  const result = rentalCosts({ ...quote, rent: 0.1, utilities: 0.2, fees: 1, deposit: 0 });
  assert.equal(result.monthly, 0.3);
  assert.equal(result.total, 1.9);
  assert.equal(result.effectiveMonthly, 0.63);
});
test("deposit only changes upfront cash", () => {
  assert.equal(rentalCosts({ ...quote, deposit: 0 }).total, rentalCosts(quote).total);
  assert.equal(rentalCosts({ ...quote, deposit: 0 }).initialCash, 2500);
});
for (const key of ["rent", "utilities", "fees", "deposit"]) {
  test(`rejects invalid ${key}`, () => {
    for (const value of [-1, Infinity, NaN, "2000", undefined, 1000001]) {
      assert.throws(() => rentalCosts({ ...quote, [key]: value }), RangeError);
    }
  });
}
test("rejects invalid stay or shorter commitment", () => {
  for (const value of [0, -1, 1.5, 121, NaN, "3"]) {
    assert.throws(() => rentalCosts({ ...quote, months: value }), RangeError);
    assert.throws(() => rentalCosts({ ...quote, committedMonths: value }), RangeError);
  }
  assert.throws(() => rentalCosts({ ...quote, committedMonths: 2 }), RangeError);
});
