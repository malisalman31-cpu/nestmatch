"""Python-first reciprocal recommendation engine for NestMatch."""

from __future__ import annotations

import math
from copy import deepcopy


DEFAULT_PREFERENCES = {
    "renter": {
        "budget": 2800,
        "commute": 35,
        "home_type": "Any",
        "pet_friendly": True,
        "bedrooms": 1,
    },
    "landlord": {
        "min_income": 72000,
        "move_within": 60,
        "pet_policy": "Either",
        "min_stay": 12,
    },
}

WEIGHTS = {"price": 0.35, "location": 0.25, "fit": 0.25, "mutual": 0.15}

PROPERTIES = [
    {"id": "home-silver-lake", "price": 2650, "beds": 1, "type": "Apartment", "pet_friendly": True, "commute": 24, "mutual_interest": True},
    {"id": "home-highland-park", "price": 2950, "beds": 2, "type": "House", "pet_friendly": True, "commute": 31, "mutual_interest": False},
    {"id": "home-arts-district", "price": 3200, "beds": 1, "type": "Loft", "pet_friendly": False, "commute": 17, "mutual_interest": True},
    {"id": "home-echo-park", "price": 2250, "beds": 0, "type": "Apartment", "pet_friendly": True, "commute": 28, "mutual_interest": False},
    {"id": "home-los-feliz", "price": 3450, "beds": 2, "type": "House", "pet_friendly": True, "commute": 26, "mutual_interest": True},
    {"id": "home-koreatown", "price": 2380, "beds": 1, "type": "Apartment", "pet_friendly": False, "commute": 14, "mutual_interest": False},
]

RENTERS = [
    {"id": "renter-leila", "income": 112000, "move_within": 28, "stay_months": 18, "pets": True, "mutual_interest": True, "profile_fit": 96},
    {"id": "renter-omar", "income": 76000, "move_within": 45, "stay_months": 12, "pets": False, "mutual_interest": False, "profile_fit": 90},
    {"id": "renter-naomi", "income": 138000, "move_within": 21, "stay_months": 24, "pets": True, "mutual_interest": True, "profile_fit": 93},
    {"id": "renter-mateo", "income": 146000, "move_within": 70, "stay_months": 12, "pets": False, "mutual_interest": False, "profile_fit": 88},
    {"id": "renter-ava", "income": 84000, "move_within": 35, "stay_months": 18, "pets": False, "mutual_interest": True, "profile_fit": 91},
]


def clamp(value: float, minimum: float = 0, maximum: float = 100) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return minimum
    if not math.isfinite(number):
        return minimum
    return min(maximum, max(minimum, number))


def js_round(value: float) -> int:
    return math.floor(value + 0.5)


def normalize_preferences(role: str, supplied: dict | None = None) -> dict:
    if role not in DEFAULT_PREFERENCES:
        raise ValueError("role must be renter or landlord")
    supplied = supplied or {}
    preferences = deepcopy(DEFAULT_PREFERENCES[role])
    if role == "renter":
        preferences["budget"] = clamp(supplied.get("budget", preferences["budget"]), 800, 10000)
        preferences["commute"] = clamp(supplied.get("commute", preferences["commute"]), 5, 120)
        preferences["bedrooms"] = clamp(supplied.get("bedrooms", preferences["bedrooms"]), 0, 5)
        preferences["pet_friendly"] = bool(supplied.get("pet_friendly", preferences["pet_friendly"]))
        home_type = supplied.get("home_type", preferences["home_type"])
        preferences["home_type"] = home_type if home_type in {"Any", "Apartment", "House", "Loft"} else "Any"
        return preferences

    preferences["min_income"] = clamp(supplied.get("min_income", preferences["min_income"]), 0, 500000)
    preferences["move_within"] = clamp(supplied.get("move_within", preferences["move_within"]), 1, 365)
    preferences["min_stay"] = clamp(supplied.get("min_stay", preferences["min_stay"]), 1, 60)
    pet_policy = supplied.get("pet_policy", preferences["pet_policy"])
    preferences["pet_policy"] = pet_policy if pet_policy in {"Either", "Yes", "No"} else "Either"
    return preferences


def weighted_score(factors: dict[str, int]) -> int:
    return js_round(sum(factors[name] * weight for name, weight in WEIGHTS.items()))


def score_property(property_record: dict, supplied: dict | None = None) -> dict:
    if not property_record.get("id"):
        raise ValueError("a property candidate is required")
    preferences = normalize_preferences("renter", supplied)
    budget = preferences["budget"]
    price = (
        100 - max(0, budget - property_record["price"]) / budget * 12
        if property_record["price"] <= budget
        else 100 - (property_record["price"] - budget) / budget * 180
    )
    commute = preferences["commute"]
    location = (
        100 - property_record["commute"] / commute * 12
        if property_record["commute"] <= commute
        else 100 - (property_record["commute"] - commute) / commute * 160
    )
    fit = 100
    if preferences["home_type"] != "Any" and property_record["type"] != preferences["home_type"]:
        fit -= 34
    if preferences["pet_friendly"] and not property_record["pet_friendly"]:
        fit -= 45
    if property_record["beds"] < preferences["bedrooms"]:
        fit -= 28 * (preferences["bedrooms"] - property_record["beds"])
    factors = {
        "price": js_round(clamp(price)),
        "location": js_round(clamp(location)),
        "fit": js_round(clamp(fit)),
        "mutual": 100 if property_record["mutual_interest"] else 58,
    }
    return {"score": weighted_score(factors), "factors": factors}


def score_renter(renter: dict, supplied: dict | None = None) -> dict:
    if not renter.get("id"):
        raise ValueError("a renter candidate is required")
    preferences = normalize_preferences("landlord", supplied)
    income_floor = max(preferences["min_income"], 1)
    price = 100 - max(0, preferences["min_income"] - renter["income"]) / income_floor * 120
    location = 100 if renter["move_within"] <= preferences["move_within"] else 100 - (renter["move_within"] - preferences["move_within"]) * 2
    fit = renter["profile_fit"]
    if renter["stay_months"] < preferences["min_stay"]:
        fit -= (preferences["min_stay"] - renter["stay_months"]) * 3
    if preferences["pet_policy"] == "No" and renter["pets"]:
        fit -= 45
    if preferences["pet_policy"] == "Yes" and not renter["pets"]:
        fit -= 8
    factors = {
        "price": js_round(clamp(price)),
        "location": js_round(clamp(location)),
        "fit": js_round(clamp(fit)),
        "mutual": 100 if renter["mutual_interest"] else 58,
    }
    return {"score": weighted_score(factors), "factors": factors}


def rank_candidates(role: str, supplied: dict | None = None, excluded_ids: list[str] | None = None) -> list[dict]:
    if role not in {"renter", "landlord"}:
        raise ValueError("role must be renter or landlord")
    excluded = set(excluded_ids or [])
    source = PROPERTIES if role == "renter" else RENTERS
    scorer = score_property if role == "renter" else score_renter
    rankings = [
        {**candidate, **scorer(candidate, supplied)}
        for candidate in source
        if candidate["id"] not in excluded
    ]
    return sorted(rankings, key=lambda candidate: (-candidate["score"], candidate["id"]))


def reference_scenarios() -> dict:
    cases = {
        "renter_default": ("renter", DEFAULT_PREFERENCES["renter"]),
        "renter_budget_2300": ("renter", {**DEFAULT_PREFERENCES["renter"], "budget": 2300}),
        "renter_loft_no_pet": ("renter", {**DEFAULT_PREFERENCES["renter"], "home_type": "Loft", "pet_friendly": False}),
        "landlord_default": ("landlord", DEFAULT_PREFERENCES["landlord"]),
        "landlord_no_pets": ("landlord", {**DEFAULT_PREFERENCES["landlord"], "pet_policy": "No"}),
        "landlord_income_120k": ("landlord", {**DEFAULT_PREFERENCES["landlord"], "min_income": 120000}),
    }
    return {
        name: [
            {"id": candidate["id"], "score": candidate["score"], "factors": candidate["factors"]}
            for candidate in rank_candidates(role, preferences)
        ]
        for name, (role, preferences) in cases.items()
    }
