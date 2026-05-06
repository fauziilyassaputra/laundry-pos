export const HEADER_TABLE_CUCIAN = [
  "No",
  "ID pesanan",
  "Jenis Pakaian",
  "Berat perkilo",
  "Kondisi Pakaian",
];

export const INITIAL_CUCIAN = {
  id_pesanan: "",
  jenis_pakaian: "",
  berat_kg: "",
  kondisi_pakaian: "",
};

export const INITIAL_STATE_CUCIAN = {
  status: "idle",
  errors: {
    id_pesanan: [],
    jenis_pakaian: [],
    berat_kg: [],
    kondisi_pakaian: [],
    _form: [],
  },
};
