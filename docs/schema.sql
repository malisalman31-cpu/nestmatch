-- Reference schema for the production NestMatch API described in the portfolio project.
CREATE TABLE users (id TEXT PRIMARY KEY, role TEXT NOT NULL CHECK(role IN ('renter','landlord')), created_at TEXT NOT NULL);
CREATE TABLE renter_profiles (user_id TEXT PRIMARY KEY REFERENCES users(id), income INTEGER, household_size INTEGER, bio TEXT);
CREATE TABLE landlord_profiles (user_id TEXT PRIMARY KEY REFERENCES users(id), display_name TEXT NOT NULL, verified INTEGER NOT NULL DEFAULT 0);
CREATE TABLE properties (id TEXT PRIMARY KEY, landlord_id TEXT NOT NULL REFERENCES users(id), address_key TEXT NOT NULL UNIQUE, property_type TEXT NOT NULL);
CREATE TABLE listings (id TEXT PRIMARY KEY, property_id TEXT NOT NULL REFERENCES properties(id), price INTEGER NOT NULL, bedrooms REAL, bathrooms REAL, status TEXT NOT NULL);
CREATE TABLE renter_preferences (user_id TEXT PRIMARY KEY REFERENCES users(id), budget INTEGER, max_commute INTEGER, home_type TEXT, pet_friendly INTEGER);
CREATE TABLE landlord_preferences (listing_id TEXT PRIMARY KEY REFERENCES listings(id), min_income INTEGER, move_window INTEGER, min_stay INTEGER, pet_policy TEXT);
CREATE TABLE feature_snapshots (id TEXT PRIMARY KEY, subject_id TEXT NOT NULL, price_score REAL, location_score REAL, fit_score REAL, mutual_score REAL, created_at TEXT NOT NULL);
CREATE TABLE recommendation_scores (id TEXT PRIMARY KEY, viewer_id TEXT NOT NULL REFERENCES users(id), candidate_id TEXT NOT NULL, feature_snapshot_id TEXT NOT NULL REFERENCES feature_snapshots(id), score REAL NOT NULL);
CREATE TABLE swipes (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL REFERENCES users(id), candidate_id TEXT NOT NULL, decision TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE matches (id TEXT PRIMARY KEY, renter_id TEXT NOT NULL REFERENCES users(id), landlord_id TEXT NOT NULL REFERENCES users(id), listing_id TEXT NOT NULL REFERENCES listings(id), created_at TEXT NOT NULL, UNIQUE(renter_id, listing_id));
CREATE TABLE match_messages (id TEXT PRIMARY KEY, match_id TEXT NOT NULL REFERENCES matches(id), sender_id TEXT NOT NULL REFERENCES users(id), body TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX idx_listing_status ON listings(status, price);
CREATE INDEX idx_scores_viewer ON recommendation_scores(viewer_id, score DESC);
CREATE INDEX idx_swipes_pair ON swipes(actor_id, candidate_id, created_at DESC);
