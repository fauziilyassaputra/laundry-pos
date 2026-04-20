CREATE OR REPLACE FUNCTION set_estimasi_selesai()
RETURNS TRIGGER AS $$
DECLARE
    v_hari_estimasi INTEGER;
BEGIN
    SELECT estimasi_hari INTO v_hari_estimasi 
    FROM layanan 
    WHERE id_layanan = NEW.id_layanan;

    NEW.tanggal_estimasi_selesai := CURRENT_DATE + COALESCE(v_hari_estimasi, 3);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_estimasi_sebelum_insert
BEFORE INSERT ON pesanan
FOR EACH ROW
EXECUTE FUNCTION set_estimasi_selesai();