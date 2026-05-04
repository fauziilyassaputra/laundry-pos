export type OperasiFormState = {
  status: string;
  erros?: {
    id_pesanan?: string[];
    id_mesin?: string[];
    status_proses?: string[];
    waktu_mulai?: string[];
    _form?: string[];
  };
};
