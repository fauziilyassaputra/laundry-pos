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

export const STATUS_OPERASI_LIST = [{ value: "selesai", label: "Selesai" }];

export const INITIAL_STATE_OPERASI = {
  status: "idle",
  errors: {
    status_proses: [],
    _form: [],
  },
};
