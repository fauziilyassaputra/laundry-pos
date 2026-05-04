export const HEADER_TABLE_OPERASI = [
  "No",
  "Id",
  "Id pesanan",
  "ID mesin",
  "Status proses",
  "Waktu mulai opeasi",
  "Waktu selesai operasi",
  "Action",
];

export const INITIAL_OPERASI = {
  id_pesanan: "",
  id_mesin: "",
  status_proses: "",
  waktu_mulai: "",
};

export const INITIAL_STATE_OPERASI = {
  status: "idle",
  errors: {
    id_pesanan: [],
    id_mesin: [],
    status_proses: [],
    waktu_mulai: [],
    _form: [],
  },
};
