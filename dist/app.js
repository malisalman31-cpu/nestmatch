import { applyPreferences, createInitialState, currentCandidate, hydrateState, PROPERTIES, recordDecision, RENTERS } from "./marketplace.js";
import { setupProfileEditor } from "./profile-ui.js";
import { registerNestMatchTools } from "./webmcp.js";

const STORAGE_KEY = "nestmatch-workspace-v1";
const elements = {
  role: document.querySelector(".role-switch"), renterPreferences: document.querySelector("#renter-preferences"), landlordPreferences: document.querySelector("#landlord-preferences"), preferenceHeading: document.querySelector("#preference-heading"), feedTitle: document.querySelector("#feed-title"), queue: document.querySelector("#queue-count"), card: document.querySelector("#candidate-card"), visual: document.querySelector("#candidate-visual"), title: document.querySelector("#candidate-title"), location: document.querySelector("#candidate-location"), price: document.querySelector("#candidate-price"), facts: document.querySelector("#candidate-facts"), description: document.querySelector("#candidate-description"), social: document.querySelector("#candidate-social"), reason: document.querySelector("#candidate-reason"), empty: document.querySelector("#empty-feed"), actions: document.querySelector(".actions"), score: document.querySelector("#score-value"), orbit: document.querySelector("#score-orbit"), factors: document.querySelector("#score-factors"), matchCount: document.querySelector("#match-count"), matchPreview: document.querySelector("#match-preview"), matchesDialog: document.querySelector("#matches-dialog"), matchesList: document.querySelector("#matches-list"), toast: document.querySelector("#toast"),
};

let state = readState();
let toastTimer;

function readState() { try { return hydrateState(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch { return createInitialState(); } }
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { showToast("This browser could not save local progress."); } }
function showToast(message) { clearTimeout(toastTimer); elements.toast.textContent = message; elements.toast.hidden = false; toastTimer = setTimeout(() => { elements.toast.hidden = true; }, 2600); }
function formatCurrency(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }

function setFacts(values) {
  elements.facts.replaceChildren(...values.map((value) => Object.assign(document.createElement("span"), { textContent: value })));
}

function render() {
  const role = state.role;
  elements.renterPreferences.hidden = role !== "renter";
  elements.landlordPreferences.hidden = role !== "landlord";
  elements.preferenceHeading.textContent = role === "renter" ? "Shape your ranked feed." : "Define your ideal renter.";
  elements.feedTitle.textContent = role === "renter" ? "Homes ranked for you" : "Renters ranked for your listing";
  for (const button of elements.role.querySelectorAll("button")) button.classList.toggle("active", button.dataset.role === role);
  syncControls();
  const candidate = currentCandidate(state);
  const total = role === "renter" ? PROPERTIES.length : RENTERS.length;
  const completed = state.swipes.filter((item) => item.role === role && item.decision !== "save").length;
  elements.queue.textContent = candidate ? `${Math.min(completed + 1, total)} of ${total}` : `${total} reviewed`;
  elements.card.hidden = !candidate;
  elements.actions.hidden = !candidate;
  elements.empty.hidden = Boolean(candidate);
  if (candidate) renderCandidate(candidate);
  renderMatches();
}

function syncControls() {
  const renter = state.preferences.renter;
  document.querySelector("#budget").value = renter.budget;
  document.querySelector("#budget-value").value = formatCurrency(renter.budget);
  document.querySelector("#commute").value = renter.commute;
  document.querySelector("#commute-value").value = `${renter.commute} min`;
  document.querySelector("#pet-friendly").checked = renter.petFriendly;
  for (const button of document.querySelectorAll("#home-type .chip")) button.classList.toggle("active", button.dataset.value === renter.homeType);
  const landlord = state.preferences.landlord;
  document.querySelector("#min-income").value = landlord.minIncome;
  document.querySelector("#income-value").value = formatCurrency(landlord.minIncome);
  document.querySelector("#move-within").value = landlord.moveWithin;
  document.querySelector("#move-value").value = `${landlord.moveWithin} days`;
  document.querySelector("#min-stay").value = landlord.minStay;
  document.querySelector("#stay-value").value = `${landlord.minStay} months`;
  for (const button of document.querySelectorAll("#pet-policy .chip")) button.classList.toggle("active", button.dataset.value === landlord.petPolicy);
}

function renderCandidate(candidate) {
  elements.card.dataset.kind = state.role;
  if (state.role === "renter") {
    elements.visual.className = "property-photo";
    elements.visual.style.backgroundPosition = ["left center", "center center", "right center"][candidate.panel];
    elements.visual.textContent = "";
    elements.visual.setAttribute("aria-label", `${candidate.title} property photo`);
    elements.title.textContent = candidate.title;
    elements.location.textContent = `${candidate.neighborhood} · ${candidate.city}${candidate.verified ? " · Verified" : ""}`;
    const suffix = Object.assign(document.createElement("span"), { textContent: "/mo" });
    elements.price.replaceChildren(document.createTextNode(formatCurrency(candidate.price)), suffix);
    setFacts([candidate.beds ? `${candidate.beds} bed` : "Studio", `${candidate.baths} bath`, `${candidate.sqft.toLocaleString()} ft²`, candidate.petFriendly ? "Pets welcome" : "No pets"]);
    setSocial(`Hosted by ${candidate.landlord}`, [...candidate.hostHobbies, ...candidate.hostPassions]);
  } else {
    elements.visual.className = "renter-visual";
    elements.visual.style.backgroundPosition = "";
    elements.visual.textContent = candidate.initials;
    elements.visual.setAttribute("aria-label", `${candidate.name} profile`);
    elements.title.textContent = candidate.name;
    elements.location.textContent = `${candidate.occupation}${candidate.verified ? " · Identity verified" : ""}`;
    elements.price.textContent = formatCurrency(candidate.income);
    setFacts([`${candidate.moveWithin}-day move`, `${candidate.stayMonths}-month stay`, candidate.household, candidate.pets ? "Has a pet" : "No pets"]);
    setSocial("Personality", [...candidate.hobbies, ...candidate.passions]);
  }
  elements.description.textContent = candidate.description || candidate.bio;
  elements.reason.textContent = candidate.reasons.join(" · ");
  elements.score.textContent = candidate.score;
  elements.orbit.style.setProperty("--overall", `${candidate.score}%`);
  const labels = state.role === "renter" ? { price: "Price fit", location: "Location", fit: "Housing fit", mutual: "Mutual signal" } : { price: "Income fit", location: "Move timing", fit: "Profile fit", mutual: "Mutual signal" };
  elements.factors.replaceChildren(...Object.entries(candidate.factors).map(([key, value]) => {
    const node = document.createElement("div"); node.className = "factor";
    const heading = document.createElement("span"); heading.append(document.createTextNode(labels[key]), Object.assign(document.createElement("b"), { textContent: `${Math.round(value)} / 100` }));
    const bar = document.createElement("i"); bar.style.setProperty("--score", `${value}%`);
    node.append(heading, bar); return node;
  }));
}

function setSocial(heading, values) {
  elements.social.replaceChildren(Object.assign(document.createElement("strong"), { textContent: heading }), ...values.map((value) => Object.assign(document.createElement("span"), { textContent: value })));
}

function candidateByMatch(match) { return (match.role === "renter" ? PROPERTIES : RENTERS).find((item) => item.id === match.candidateId); }

function renderMatches() {
  elements.matchCount.textContent = String(state.matches.length);
  elements.matchPreview.replaceChildren(); elements.matchesList.replaceChildren();
  if (!state.matches.length) {
    elements.matchPreview.append(Object.assign(document.createElement("p"), { className: "no-matches", textContent: "No reciprocal matches yet." }));
    elements.matchesList.append(Object.assign(document.createElement("p"), { className: "dialog-empty", textContent: "Express interest in a candidate who has already liked your profile to create a match." }));
    return;
  }
  for (const match of [...state.matches].reverse()) {
    const candidate = candidateByMatch(match); if (!candidate) continue;
    const name = candidate.title || candidate.name;
    const compact = Object.assign(document.createElement("button"), { type: "button", className: "match-row", textContent: name }); compact.addEventListener("click", () => elements.matchesDialog.showModal()); elements.matchPreview.append(compact);
    const card = document.createElement("article"); card.className = "dialog-match";
    card.append(Object.assign(document.createElement("strong"), { textContent: name }), Object.assign(document.createElement("p"), { textContent: match.role === "renter" ? `You and ${candidate.landlord} both expressed interest.` : `You and ${candidate.name} both expressed interest.` }), Object.assign(document.createElement("span"), { textContent: "Mutual match · Ready to connect" }));
    elements.matchesList.append(card);
  }
}

function updatePreferences(role, values) {
  state = applyPreferences(state, role, { ...state.preferences[role], ...values }); saveState(); render();
  const candidate = currentCandidate(state);
  return { role, preferences: state.preferences[role], candidate: candidate ? summary(candidate) : null };
}

function summary(candidate) { return { id: candidate.id, title: candidate.title || candidate.name, score: candidate.score, factors: candidate.factors, reasons: candidate.reasons }; }

function decide(candidateId, decision) {
  const current = currentCandidate(state);
  if (!current || current.id !== candidateId) throw new Error("The candidate is no longer current. Read the current candidate and try again.");
  const result = recordDecision(state, candidateId, decision); state = result.state; saveState(); render();
  showToast(result.matched ? "It’s a match — both sides are interested." : decision === "save" ? "Saved for later." : decision === "like" ? "Interest sent privately." : "Passed — the next candidate is ready.");
  const next = currentCandidate(state);
  return { candidateId, decision, matched: result.matched, matchCount: state.matches.length, nextCandidate: next ? summary(next) : null };
}

const profileEditor = setupProfileEditor({ getRole: () => state.role, showToast });

elements.role.addEventListener("click", (event) => { const role = event.target.closest("button[data-role]")?.dataset.role; if (!role) return; state.role = role; saveState(); render(); profileEditor.render(); showToast(role === "renter" ? "Showing homes for renters." : "Showing renter candidates for landlords."); });
document.querySelector("#budget").addEventListener("input", (event) => updatePreferences("renter", { budget: Number(event.target.value) }));
document.querySelector("#commute").addEventListener("input", (event) => updatePreferences("renter", { commute: Number(event.target.value) }));
document.querySelector("#pet-friendly").addEventListener("change", (event) => updatePreferences("renter", { petFriendly: event.target.checked }));
document.querySelector("#home-type").addEventListener("click", (event) => { const value = event.target.closest("button[data-value]")?.dataset.value; if (value) updatePreferences("renter", { homeType: value }); });
document.querySelector("#min-income").addEventListener("input", (event) => updatePreferences("landlord", { minIncome: Number(event.target.value) }));
document.querySelector("#move-within").addEventListener("input", (event) => updatePreferences("landlord", { moveWithin: Number(event.target.value) }));
document.querySelector("#min-stay").addEventListener("input", (event) => updatePreferences("landlord", { minStay: Number(event.target.value) }));
document.querySelector("#pet-policy").addEventListener("click", (event) => { const value = event.target.closest("button[data-value]")?.dataset.value; if (value) updatePreferences("landlord", { petPolicy: value }); });
elements.actions.addEventListener("click", (event) => { const decision = event.target.closest("button[data-decision]")?.dataset.decision; const candidate = currentCandidate(state); if (decision && candidate) decide(candidate.id, decision); });
document.querySelector("#matches-button").addEventListener("click", () => elements.matchesDialog.showModal());
document.querySelector("#reset-button").addEventListener("click", resetDemo); document.querySelector("[data-reset]").addEventListener("click", resetDemo);
function resetDemo() { state = createInitialState(); profileEditor.reset(); saveState(); render(); showToast("Demo and private profiles reset."); }

render();
registerNestMatchTools({
  modelContext: document.modelContext,
  configurePreferences: async (input) => updatePreferences(input.role, input),
  readCandidate: async () => { const candidate = currentCandidate(state); return candidate ? { role: state.role, ...summary(candidate) } : { role: state.role, available: false }; },
  recordDecision: async (candidateId, decision) => decide(candidateId, decision),
  listMatches: async () => ({ count: state.matches.length, matches: state.matches.map((match) => ({ ...match, title: candidateByMatch(match)?.title || candidateByMatch(match)?.name })) }),
});
