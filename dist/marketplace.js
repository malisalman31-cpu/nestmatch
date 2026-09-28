export const DEFAULT_PREFERENCES = Object.freeze({
  renter: { budget: 2800, commute: 35, homeType: "Any", petFriendly: true, bedrooms: 1 },
  landlord: { minIncome: 72000, moveWithin: 60, petPolicy: "Either", minStay: 12 },
});

export const WEIGHTS = Object.freeze({ price: 0.35, location: 0.25, fit: 0.25, mutual: 0.15 });

export const PROPERTIES = Object.freeze([
  { id: "home-silver-lake", panel: 0, title: "Silver Lake light-filled one bedroom", neighborhood: "Silver Lake", city: "Los Angeles", price: 2650, beds: 1, baths: 1, sqft: 760, type: "Apartment", petFriendly: true, commute: 24, furnished: false, minStay: 12, landlord: "Maya", mutualInterest: true, verified: true, hostHobbies: ["Ceramics", "Gardening"], hostPassions: ["Walkable neighborhoods"], description: "Top-floor home with balcony, morning light, secure parking, and a quiet work nook." },
  { id: "home-highland-park", panel: 1, title: "Highland Park craftsman cottage", neighborhood: "Highland Park", city: "Los Angeles", price: 2950, beds: 2, baths: 1, sqft: 910, type: "House", petFriendly: true, commute: 31, furnished: false, minStay: 12, landlord: "Andre", mutualInterest: false, verified: true, hostHobbies: ["Woodworking", "Cycling"], hostPassions: ["Historic homes"], description: "Detached bungalow with private garden, in-unit laundry, and a flexible second bedroom." },
  { id: "home-arts-district", panel: 2, title: "Arts District brick loft", neighborhood: "Arts District", city: "Los Angeles", price: 3200, beds: 1, baths: 1, sqft: 980, type: "Loft", petFriendly: false, commute: 17, furnished: true, minStay: 9, landlord: "Elena", mutualInterest: true, verified: true, hostHobbies: ["Photography", "Museums"], hostPassions: ["Local art"], description: "Open-plan loft with original brick, large windows, doorman, and furnished move-in." },
  { id: "home-echo-park", panel: 0, title: "Echo Park hillside studio", neighborhood: "Echo Park", city: "Los Angeles", price: 2250, beds: 0, baths: 1, sqft: 540, type: "Apartment", petFriendly: true, commute: 28, furnished: false, minStay: 12, landlord: "Jon", mutualInterest: false, verified: true, hostHobbies: ["Live music", "Biking"], hostPassions: ["Urban gardens"], description: "Efficient hillside studio with skyline outlook, shared terrace, and bike storage." },
  { id: "home-los-feliz", panel: 1, title: "Los Feliz garden duplex", neighborhood: "Los Feliz", city: "Los Angeles", price: 3450, beds: 2, baths: 1.5, sqft: 1050, type: "House", petFriendly: true, commute: 26, furnished: false, minStay: 18, landlord: "Priya", mutualInterest: true, verified: true, hostHobbies: ["Cooking", "Hiking"], hostPassions: ["Sustainable living"], description: "Quiet rear duplex with garden access, dining room, and dedicated office alcove." },
  { id: "home-koreatown", panel: 2, title: "Koreatown transit-ready one bedroom", neighborhood: "Koreatown", city: "Los Angeles", price: 2380, beds: 1, baths: 1, sqft: 690, type: "Apartment", petFriendly: false, commute: 14, furnished: false, minStay: 12, landlord: "Daniel", mutualInterest: false, verified: true, hostHobbies: ["Food tours", "Basketball"], hostPassions: ["Public transit"], description: "Updated one bedroom near rail with gym, package room, and controlled access." },
]);

export const RENTERS = Object.freeze([
  { id: "renter-leila", name: "Leila S.", initials: "LS", occupation: "Product designer", income: 112000, moveWithin: 28, stayMonths: 18, pets: true, household: "1 person + cat", verified: true, mutualInterest: true, profileFit: 96, hobbies: ["Ceramics", "Trail walks"], passions: ["Inclusive design"], bio: "Quiet designer relocating closer to work; values natural light and a long-term home." },
  { id: "renter-omar", name: "Omar K.", initials: "OK", occupation: "Graduate researcher", income: 76000, moveWithin: 45, stayMonths: 12, pets: false, household: "1 person", verified: true, mutualInterest: false, profileFit: 90, hobbies: ["Chess", "Running"], passions: ["Climate science"], bio: "Graduate researcher looking for a transit-friendly lease and a calm study environment." },
  { id: "renter-naomi", name: "Naomi R.", initials: "NR", occupation: "Nurse practitioner", income: 138000, moveWithin: 21, stayMonths: 24, pets: true, household: "2 people + dog", verified: true, mutualInterest: true, profileFit: 93, hobbies: ["Cooking", "Dog parks"], passions: ["Community health"], bio: "Two-person household seeking a stable lease, pet-friendly space, and reliable parking." },
  { id: "renter-mateo", name: "Mateo C.", initials: "MC", occupation: "Software engineer", income: 146000, moveWithin: 70, stayMonths: 12, pets: false, household: "1 person", verified: true, mutualInterest: false, profileFit: 88, hobbies: ["Climbing", "Gaming"], passions: ["Open source"], bio: "Remote engineer prioritizing a dedicated work area and flexible move timing." },
  { id: "renter-ava", name: "Ava T.", initials: "AT", occupation: "Public school teacher", income: 84000, moveWithin: 35, stayMonths: 18, pets: false, household: "1 person", verified: true, mutualInterest: true, profileFit: 91, hobbies: ["Book clubs", "Yoga"], passions: ["Public education"], bio: "Teacher looking for a walkable neighborhood and a home for at least one school year." },
]);

export function clamp(value, minimum = 0, maximum = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return minimum;
  return Math.min(maximum, Math.max(minimum, number));
}

export function normalizePreferences(role, input = {}) {
  if (!Object.hasOwn(DEFAULT_PREFERENCES, role)) throw new Error("Role must be renter or landlord.");
  if (role === "renter") {
    const homeType = ["Any", "Apartment", "House", "Loft"].includes(input.homeType) ? input.homeType : DEFAULT_PREFERENCES.renter.homeType;
    return {
      budget: clamp(input.budget ?? DEFAULT_PREFERENCES.renter.budget, 800, 10000),
      commute: clamp(input.commute ?? DEFAULT_PREFERENCES.renter.commute, 5, 120),
      homeType,
      petFriendly: input.petFriendly === undefined ? DEFAULT_PREFERENCES.renter.petFriendly : Boolean(input.petFriendly),
      bedrooms: clamp(input.bedrooms ?? DEFAULT_PREFERENCES.renter.bedrooms, 0, 5),
    };
  }
  return {
    minIncome: clamp(input.minIncome ?? DEFAULT_PREFERENCES.landlord.minIncome, 0, 500000),
    moveWithin: clamp(input.moveWithin ?? DEFAULT_PREFERENCES.landlord.moveWithin, 1, 365),
    petPolicy: ["Either", "Yes", "No"].includes(input.petPolicy) ? input.petPolicy : "Either",
    minStay: clamp(input.minStay ?? DEFAULT_PREFERENCES.landlord.minStay, 1, 60),
  };
}

function roundScore(value) { return Math.round(clamp(value)); }

export function scoreProperty(property, input = DEFAULT_PREFERENCES.renter) {
  if (!property?.id) throw new Error("A property candidate is required.");
  const preferences = normalizePreferences("renter", input);
  const price = property.price <= preferences.budget
    ? 100 - Math.max(0, preferences.budget - property.price) / preferences.budget * 12
    : 100 - (property.price - preferences.budget) / preferences.budget * 180;
  const location = property.commute <= preferences.commute
    ? 100 - property.commute / preferences.commute * 12
    : 100 - (property.commute - preferences.commute) / preferences.commute * 160;
  let fit = 100;
  if (preferences.homeType !== "Any" && property.type !== preferences.homeType) fit -= 34;
  if (preferences.petFriendly && !property.petFriendly) fit -= 45;
  if (property.beds < preferences.bedrooms) fit -= 28 * (preferences.bedrooms - property.beds);
  const mutual = property.mutualInterest ? 100 : 58;
  const factors = { price: roundScore(price), location: roundScore(location), fit: roundScore(fit), mutual };
  const score = Math.round(Object.entries(WEIGHTS).reduce((total, [key, weight]) => total + factors[key] * weight, 0));
  return { score, factors, reasons: propertyReasons(property, preferences, factors) };
}

function propertyReasons(property, preferences, factors) {
  const reasons = [];
  if (factors.price >= 90) reasons.push(`Within your $${preferences.budget.toLocaleString()} budget`);
  if (factors.location >= 85) reasons.push(`${property.commute}-minute estimated commute`);
  if (property.petFriendly && preferences.petFriendly) reasons.push("Pet policy matches");
  if (property.mutualInterest) reasons.push("Landlord interest signal is strong");
  if (!reasons.length) reasons.push("Closest available fit after current filters");
  return reasons.slice(0, 3);
}

export function scoreRenter(renter, input = DEFAULT_PREFERENCES.landlord) {
  if (!renter?.id) throw new Error("A renter candidate is required.");
  const preferences = normalizePreferences("landlord", input);
  const price = 100 - Math.max(0, preferences.minIncome - renter.income) / Math.max(preferences.minIncome, 1) * 120;
  const location = renter.moveWithin <= preferences.moveWithin ? 100 : 100 - (renter.moveWithin - preferences.moveWithin) * 2;
  let fit = renter.profileFit;
  if (renter.stayMonths < preferences.minStay) fit -= (preferences.minStay - renter.stayMonths) * 3;
  if (preferences.petPolicy === "No" && renter.pets) fit -= 45;
  if (preferences.petPolicy === "Yes" && !renter.pets) fit -= 8;
  const mutual = renter.mutualInterest ? 100 : 58;
  const factors = { price: roundScore(price), location: roundScore(location), fit: roundScore(fit), mutual };
  const score = Math.round(Object.entries(WEIGHTS).reduce((total, [key, weight]) => total + factors[key] * weight, 0));
  const reasons = [
    renter.income >= preferences.minIncome ? "Income target met" : "Income below current target",
    `${renter.moveWithin}-day move window`,
    renter.mutualInterest ? "Renter already expressed interest" : "No reciprocal signal yet",
  ];
  return { score, factors, reasons };
}

export function rankCandidates(role, preferences, excludedIds = []) {
  const excluded = new Set(excludedIds);
  const source = role === "renter" ? PROPERTIES : role === "landlord" ? RENTERS : null;
  if (!source) throw new Error("Role must be renter or landlord.");
  const scorer = role === "renter" ? scoreProperty : scoreRenter;
  return source
    .filter((item) => !excluded.has(item.id))
    .map((item) => ({ ...item, ...scorer(item, preferences) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

export function createInitialState() {
  return {
    schemaVersion: 1,
    role: "renter",
    preferences: {
      renter: { ...DEFAULT_PREFERENCES.renter },
      landlord: { ...DEFAULT_PREFERENCES.landlord },
    },
    swipes: [],
    saved: [],
    matches: [],
  };
}

export function hydrateState(input) {
  const clean = createInitialState();
  if (!input || input.schemaVersion !== 1) return clean;
  clean.role = input.role === "landlord" ? "landlord" : "renter";
  clean.preferences.renter = normalizePreferences("renter", input.preferences?.renter);
  clean.preferences.landlord = normalizePreferences("landlord", input.preferences?.landlord);
  clean.swipes = Array.isArray(input.swipes) ? input.swipes.filter((item) => item?.candidateId && ["pass", "save", "like"].includes(item.decision)).slice(-100) : [];
  clean.saved = Array.isArray(input.saved) ? [...new Set(input.saved.filter(Boolean))].slice(-50) : [];
  clean.matches = Array.isArray(input.matches) ? input.matches.filter((item) => item?.id && item?.candidateId).slice(-50) : [];
  return clean;
}

export function currentCandidate(state) {
  const hydrated = hydrateState(state);
  const completed = hydrated.swipes.filter((item) => item.role === hydrated.role && item.decision !== "save").map((item) => item.candidateId);
  return rankCandidates(hydrated.role, hydrated.preferences[hydrated.role], completed)[0] || null;
}

export function applyPreferences(state, role, preferences) {
  const next = hydrateState(state);
  next.role = role;
  next.preferences[role] = normalizePreferences(role, preferences);
  return next;
}

export function recordDecision(state, candidateId, decision, options = {}) {
  if (!["pass", "save", "like"].includes(decision)) throw new Error("Decision must be pass, save, or like.");
  const next = hydrateState(state);
  const candidate = (next.role === "renter" ? PROPERTIES : RENTERS).find((item) => item.id === candidateId);
  if (!candidate) throw new Error("Candidate is not available for the current role.");
  const timestamp = options.now ? new Date(options.now).toISOString() : new Date().toISOString();
  next.swipes.push({ id: `swipe-${next.role}-${candidateId}-${next.swipes.length + 1}`, role: next.role, candidateId, decision, createdAt: timestamp });
  if (decision === "save" && !next.saved.includes(candidateId)) next.saved.push(candidateId);
  if (decision === "like" && candidate.mutualInterest && !next.matches.some((item) => item.candidateId === candidateId && item.role === next.role)) {
    next.matches.push({ id: `match-${next.role}-${candidateId}`, role: next.role, candidateId, createdAt: timestamp, status: "mutual" });
  }
  return { state: next, matched: decision === "like" && candidate.mutualInterest, candidate };
}

export function serializeState(state) {
  return JSON.stringify(hydrateState(state));
}
