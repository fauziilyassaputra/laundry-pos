export type PesananFormState = {
  status?: string;
  errors?: {
    id_pelanggan?: string[];
    id_layanan?: string[];
    status_pesanan?: string[];
    total_harga?: string[];
    tanggal_estimasi_selesai?: string[];
    tipe_pesana?: string[];
    catatan?: string[];
    _form?: string[];
  };
};
