CREATE OR REPLACE FUNCTION selesai_proses_mesin()
RETURNS TRIGGER AS $$
DECLARE
    v_tipe_mesin VARCHAR;
BEGIN
    IF NEW.status_proses = 'selesai' AND OLD.status_proses = 'berjalan' THEN
        
        SELECT tipe_mesin INTO v_tipe_mesin FROM mesin WHERE id_mesin = NEW.id_mesin;
        UPDATE mesin SET status = 'ready' WHERE id_mesin = NEW.id_mesin;

        IF v_tipe_mesin = 'washer' THEN
            UPDATE pesanan SET status_pesanan = 'selesai dicuci' WHERE id_pesanan = NEW.id_pesanan;
        ELSIF v_tipe_mesin = 'dryer' THEN
            UPDATE pesanan SET status_pesanan = 'selesai dikeringkan' WHERE id_pesanan = NEW.id_pesanan;
        ELSIF v_tipe_mesin = 'setrika' THEN
            UPDATE pesanan SET status_pesanan = 'selesai' WHERE id_pesanan = NEW.id_pesanan;
        END IF;
        NEW.waktu_selesai := now();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_selesai_proses_mesin
BEFORE UPDATE OF status_proses ON penggunaan_mesin
FOR EACH ROW
EXECUTE FUNCTION selesai_proses_mesin();