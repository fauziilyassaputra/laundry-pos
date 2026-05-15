export const HEADER_TABLE_CUCIAN = [
  "No",
  "ID pesanan",
  "Jenis Pakaian",
  "Berat perkilo",
  "Kondisi cucian",
];

export const INITIAL_CUCIAN = {
  // id_pesanan: "",
  jenis_pakaian: "",
  berat_kg: "",
  kondisi_cucian: "",
};

export const INITIAL_STATE_CUCIAN = {
  status: "idle",
  errors: {
    // id_pesanan: [],
    jenis_pakaian: [],
    berat_kg: [],
    kondisi_cucian: [],
    _form: [],
  },
};
