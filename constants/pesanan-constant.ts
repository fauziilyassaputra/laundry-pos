export const HEADER_TABLE_PESANAN = [
  "No",
  "ID Pesanan",
  "Nama Operator",
  "ID Pelanggan",
  "ID Layanan",
  "Status Pesanan",
  "Total Harga",
  "catatan",
  "Tanggal Masuk",
  "Tanggal Estimasi Selesai",
  "Tanggal Selesai",
  "Tipe Pesanan",
  "Action",
];

export const INITIAL_PESANAN = {
  id_user: "",
  id_pelanggan: "",
  id_layanan: "",
  status_pesanan: "",
  total_harga: "",
  tanggal_masuk: "",
  tanggal_estimasi_selesai: "",
  tanggal_selesai: "",
  tipe_pesanan: "",
  catatan: "",
};

export const INITIAL_STATE_PESANAN = {
  status: "idle",
  errors: {
    id_user:[],
    id_pelanggan: [],
    id_layanan: [],
    status_pesanan: [],
    total_harga: [],
    tanggal_masuk: [],
    tanggal_estimasi_selesai: [],
    tanggal_selesai: [],
    tipe_pesanan: [],
    catatan: [],
    _form: [],
  },
};
