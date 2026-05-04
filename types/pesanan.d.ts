export type PesananFormState = {
  status?: string;
  errors?: {
    id_pelanggan?: string[];
    id_layanan?: string[];
    status_pesanan?: string[];
    total_harga?: string[];
    tipe_pesanan?: string[];
    catatan?: string[];
    _form?: string[];
  };
};
