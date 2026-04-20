CREATE OR REPLACE FUNCTION buat_pembayaran_otomatis()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_harga IS NOT NULL THEN
    INSERT INTO pembayaran (id_pesanan, jumlah_bayar, tanggal_bayar, status_pembayaran)
    VALUES (NEW.id_pesanan, 0, now(), 'bayar')
    ON CONFLICT (id_pesanan) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_setelah_update_total
AFTER UPDATE OF total_harga ON pesanan
FOR EACH ROW
EXECUTE FUNCTION buat_pembayaran_otomatis();