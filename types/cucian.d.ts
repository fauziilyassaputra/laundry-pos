export type CucianFormState = {
  status?: string;
  errors?: {
    id_pesanan?: string[];
    jenis_pakaian?: string[];
    berat_kg?: string[];
    kondisi_pakaian?: string[];
    _form?: string[];
  };
};
