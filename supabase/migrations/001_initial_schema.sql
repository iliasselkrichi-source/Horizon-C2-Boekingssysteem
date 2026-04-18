-- =====================================================
-- 001_initial_schema.sql
-- Voor een COMPLEET NIEUW project (geen migratie!)
-- =====================================================

-- 1. ENUM types aanmaken
CREATE TYPE team_type AS ENUM ('TA', 'TB');
CREATE TYPE booking_status AS ENUM ('NIEUW', 'BEVESTIGD', 'GEANNULEERD');

-- 2. Resources tabel (fysieke locaties)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_code TEXT UNIQUE NOT NULL,
    resource_name TEXT,
    property_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hoofdtabel boekingen
-- BELANGRIJK: boekingsnummer heeft GEEN NOT NULL! De trigger vult hem in.
CREATE TABLE boekingen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boekingsnummer TEXT UNIQUE,
    team team_type NOT NULL,
    unit_code TEXT NOT NULL,
    resource_id UUID REFERENCES resources(id),
    gast_naam TEXT NOT NULL,
    gast_contact JSONB DEFAULT '{}',
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    totaalprijs DECIMAL(10,2),
    status booking_status DEFAULT 'NIEUW',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexen voor performance
CREATE INDEX idx_boekingen_check_dates ON boekingen(check_in, check_out);
CREATE INDEX idx_boekingen_resource ON boekingen(resource_id);
CREATE INDEX idx_boekingen_team ON boekingen(team);
CREATE INDEX idx_boekingen_status ON boekingen(status);

-- 5. Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_updated_at
BEFORE UPDATE ON boekingen
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
