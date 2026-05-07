export type PembayaranFormState = {
  status?: string;
  errors?: {
    id_pesanan?: string[];
    tanggal_bayar?: string[];
    jumlah_bayar?: string[];
    metode_bayar?: string[];
    status_pembayaran?: string[];
    _form?: string[];
  };
};
