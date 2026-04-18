-- =====================================================
-- 003_enable_realtime.sql
-- Realtime publicatie inschakelen voor de tabel 'boekingen'
-- =====================================================

ALTER TABLE boekingen REPLICA IDENTITY FULL;
INSERT INTO supabase_realtime.messages (table_name) VALUES ('boekingen') ON CONFLICT DO NOTHING;
