import { rentalCosts } from "./rental-costs.js";

const form = document.querySelector("#cost-form");
const results = document.querySelector("#cost-results");
const error = document.querySelector("#cost-error");
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

form.addEventListener("input", () => {
  results.hidden = true;
  error.textContent = "";
});
form.addEventListener("submit", event => {
  event.preventDefault();
  error.textContent = "";
  results.hidden = true;
  const data = new FormData(form);
  try {
    for (const side of ["a", "b"]) {
      const values = Object.fromEntries(["rent", "utilities", "fees", "deposit", "committedMonths"].map(key => [key, Number(data.get(`${side}-${key}`))]));
      const cost = rentalCosts({ ...values, months: Number(data.get("months")) });
      for (const [key, value] of Object.entries(cost)) {
        document.querySelector(`#${side}-${key}-result`).textContent = money.format(value);
      }
    }
    results.hidden = false;
    results.focus();
  } catch (cause) {
    error.textContent = cause.message;
  }
});
