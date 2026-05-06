export type PelangganFormState = {
  status?: string;
  errors?: {
    nama_pelanggan?: string[];
    nomor_telepon?: string[];
    alamat_rumah?: string[];
    _form?: string[];
  };
};
