CREATE OR REPLACE FUNCTION mulai_proses_mesin()
RETURNS TRIGGER AS $$
DECLARE
    v_tipe_mesin VARCHAR;
BEGIN
    
    SELECT tipe_mesin INTO v_tipe_mesin 
    FROM mesin 
    WHERE id_mesin = NEW.id_mesin;

    UPDATE mesin SET status = 'in use' WHERE id_mesin = NEW.id_mesin;
   
    IF v_tipe_mesin = 'washer' THEN
        UPDATE pesanan SET status_pesanan = 'dicuci' WHERE id_pesanan = NEW.id_pesanan;
    ELSIF v_tipe_mesin = 'dryer' THEN
        UPDATE pesanan SET status_pesanan = 'dikeringkan' WHERE id_pesanan = NEW.id_pesanan;
    ELSIF v_tipe_mesin = 'setrika' THEN
        UPDATE pesanan SET status_pesanan = 'disetrika' WHERE id_pesanan = NEW.id_pesanan;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mulai_proses_mesin
AFTER INSERT ON penggunaan_mesin
FOR EACH ROW
EXECUTE FUNCTION mulai_proses_mesin();