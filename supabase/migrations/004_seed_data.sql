-- =====================================================
-- 004_seed_data.sql
-- Testdata voor een nieuw project
-- =====================================================

INSERT INTO resources (resource_code, resource_name, property_type) VALUES
    ('VILLA_ALHOURA', 'Al Houara Villa (TA-U1 & TB-P1..P4)', 'Villa'),
    ('VILLA_LA_PERLA', 'La Perla (TA-U2)', 'Villa'),
    ('VILLA_AL_BAHAR', 'Al Bahar (TA-U3)', 'Villa'),
    ('VILLA_LE_ROCHER', 'Le Rocher (TA-U4)', 'Villa'),
    ('VILLA_ESSENCE', 'L''Essence Suite (TA-U5)', 'Suite'),
    ('VILLA_OASIS', 'Oasis de Paix (TA-U6)', 'Appartement'),
    ('VILLA_REFUGE', 'Le Refuge (TA-U7)', 'Studio'),
    ('VILLA_IMPERIAL', 'Imperial Duplex (TA-U8)', 'Duplex'),
    ('VILLA_PALMERAIE', 'Palmeraie Royale (TA-U9)', 'Villa'),
    ('VILLA_SKYLINE', 'Sovereign Skyline (TA-U10)', 'Penthouse')
ON CONFLICT (resource_code) DO NOTHING;
