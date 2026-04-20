CREATE OR REPLACE FUNCTION hitung_ulang_total_pesanan()
RETURNS TRIGGER AS $$
DECLARE
    v_total_baru DECIMAL;
BEGIN
    
    SELECT SUM(i.berat_kg) * l.harga_perkilo INTO v_total_baru
    FROM item_cucian i
    JOIN pesanan p ON i.id_pesanan = p.id_pesanan
    JOIN layanan l ON p.id_layanan = l.id_layanan
    WHERE i.id_pesanan = COALESCE(NEW.id_pesanan, OLD.id_pesanan)
    GROUP BY l.harga_perkilo;


    UPDATE pesanan 
    SET total_harga = COALESCE(v_total_baru, 0)
    WHERE id_pesanan = COALESCE(NEW.id_pesanan, OLD.id_pesanan);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_sinkron_total_harga
AFTER INSERT OR UPDATE OR DELETE ON item_cucian
FOR EACH ROW
EXECUTE FUNCTION hitung_ulang_total_pesanan();