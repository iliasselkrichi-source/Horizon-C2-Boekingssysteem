-- =====================================================
-- 002_triggers.sql
-- Cross-team conflict trigger + boekingsnummer generator
-- =====================================================

-- 1. CROSS-TEAM CONFLICT TRIGGER (STRICT: geen aankomst op vertrekdag)
CREATE OR REPLACE FUNCTION check_resource_availability() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM boekingen
        WHERE resource_id = NEW.resource_id
        AND NEW.check_in <= check_out
        AND NEW.check_out >= check_in
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    ) THEN
        RAISE EXCEPTION '❌ Conflict: Deze locatie (Al Houara Villa) is al bezet voor deze periode. TA-U1 en TB-pakketten delen dezelfde resource.';
    END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_resource
BEFORE INSERT OR UPDATE ON boekingen
FOR EACH ROW EXECUTE FUNCTION check_resource_availability();

-- 2. BOEKINGSNUMMER GENERATOR
CREATE OR REPLACE FUNCTION generate_booking_number() RETURNS TRIGGER AS $$
DECLARE
    base TEXT;
    final TEXT;
    suffix INT := 1;
BEGIN
    base := NEW.team || '-' || NEW.unit_code || '-' || TO_CHAR(NEW.check_in, 'DDMM');
    final := base || '-' || LPAD(suffix::TEXT, 2, '0');

    WHILE EXISTS (SELECT 1 FROM boekingen WHERE boekingsnummer = final) LOOP
        suffix := suffix + 1;
        final := base || '-' || LPAD(suffix::TEXT, 2, '0');
    END LOOP;

    NEW.boekingsnummer := final;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_booking_number
BEFORE INSERT ON boekingen
FOR EACH ROW EXECUTE FUNCTION generate_booking_number();
