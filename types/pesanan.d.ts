export type PesananFormState = {
  status?: string;
  errors?: {
    id_pelanggan?: string[];
    id_layanan?: string[];
    id_user?: string[];
    status_pesanan?: string[];
    tipe_pesanan?: string[];
    catatan?: string[];
    _form?: string[];
  };
};
