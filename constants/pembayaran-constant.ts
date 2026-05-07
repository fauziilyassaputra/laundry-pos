export const HEADER_TABLE_PEMBAYARAN = [
  "No",
  "ID",
  "ID Pesanan",
  "Jumlah bayar",
  "Status pembayaran",
  "Metode pembayaran",
  "Tanggal bayar",
  "Action",
];

export const INITIAL_PEMBAYARAN = {
  id_pesanan: "",
  jumlah_bayar: "",
  status_pembayaran: "",
  metode_bayar: "",
  tanggal_bayar: "",
};

export const INITIAL_STATE_PEMBAYARAN = {
  status: "idle",
  errors: {
    id_pesanan: [],
    jumlah_bayar: [],
    status_pembayaran: [],
    metode_bayar: [],
    tanggal_bayar: [],
    _form: [],
  },
};
