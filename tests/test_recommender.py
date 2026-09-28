import unittest

from analysis.recommender import (
    DEFAULT_PREFERENCES,
    PROPERTIES,
    RENTERS,
    WEIGHTS,
    clamp,
    normalize_preferences,
    rank_candidates,
    reference_scenarios,
    score_property,
    score_renter,
)


class RecommenderTests(unittest.TestCase):
    def test_weights_sum_to_one(self):
        self.assertAlmostEqual(sum(WEIGHTS.values()), 1)

    def test_clamp_handles_bounds_and_bad_values(self):
        self.assertEqual(clamp(-10), 0)
        self.assertEqual(clamp(150), 100)
        self.assertEqual(clamp("bad"), 0)

    def test_renter_preferences_are_normalized(self):
        preferences = normalize_preferences("renter", {"budget": 99, "home_type": "Castle"})
        self.assertEqual(preferences["budget"], 800)
        self.assertEqual(preferences["home_type"], "Any")

    def test_landlord_preferences_are_normalized(self):
        preferences = normalize_preferences("landlord", {"move_within": 900, "pet_policy": "Maybe"})
        self.assertEqual(preferences["move_within"], 365)
        self.assertEqual(preferences["pet_policy"], "Either")

    def test_unknown_role_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "renter or landlord"):
            normalize_preferences("agent")

    def test_property_score_has_all_factors(self):
        result = score_property(PROPERTIES[0])
        self.assertTrue(0 <= result["score"] <= 100)
        self.assertEqual(set(result["factors"]), set(WEIGHTS))

    def test_matching_budget_improves_price_factor(self):
        candidate = PROPERTIES[0]
        matching = score_property(candidate, {"budget": candidate["price"]})
        constrained = score_property(candidate, {"budget": 1800})
        self.assertGreater(matching["factors"]["price"], constrained["factors"]["price"])

    def test_pet_policy_changes_property_fit(self):
        candidate = next(item for item in PROPERTIES if not item["pet_friendly"])
        pet_owner = score_property(candidate, {"pet_friendly": True})
        no_pet = score_property(candidate, {"pet_friendly": False})
        self.assertGreater(no_pet["factors"]["fit"], pet_owner["factors"]["fit"])

    def test_renter_score_has_all_factors(self):
        result = score_renter(RENTERS[0])
        self.assertTrue(0 <= result["score"] <= 100)
        self.assertEqual(set(result["factors"]), set(WEIGHTS))

    def test_income_threshold_changes_renter_score(self):
        candidate = RENTERS[1]
        default = score_renter(candidate)
        strict = score_renter(candidate, {"min_income": 150000})
        self.assertGreater(default["factors"]["price"], strict["factors"]["price"])

    def test_rankings_are_descending_and_exclusions_work(self):
        rankings = rank_candidates("renter", DEFAULT_PREFERENCES["renter"])
        self.assertEqual([item["score"] for item in rankings], sorted([item["score"] for item in rankings], reverse=True))
        reduced = rank_candidates("renter", excluded_ids=[rankings[0]["id"]])
        self.assertNotEqual(rankings[0]["id"], reduced[0]["id"])

    def test_reference_scenarios_cover_both_sides(self):
        scenarios = reference_scenarios()
        self.assertEqual(len(scenarios), 6)
        self.assertEqual(len(scenarios["renter_default"]), len(PROPERTIES))
        self.assertEqual(len(scenarios["landlord_default"]), len(RENTERS))


if __name__ == "__main__":
    unittest.main()
