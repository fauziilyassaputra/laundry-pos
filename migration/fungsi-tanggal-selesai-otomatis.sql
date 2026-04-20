CREATE OR REPLACE FUNCTION catat_tanggal_selesai_otomatis()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_pesanan = 'selesai' AND (OLD.status_pesanan IS NULL OR OLD.status_pesanan != 'selesai') THEN
        NEW.tanggal_selesai := now();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_catat_selesai_sebelum_update
BEFORE UPDATE OF status_pesanan ON pesanan
FOR EACH ROW
EXECUTE FUNCTION catat_tanggal_selesai_otomatis();