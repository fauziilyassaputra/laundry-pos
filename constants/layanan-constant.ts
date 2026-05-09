import { string } from "zod";

export const HEADER_TABLE_LAYANAN = [
  "No",
  "ID Layanan",
  "Nama Layanan",
  "Harga Perkilo",
  "Estimasi Hari",
  "Action",
];

export const INITIAL_LAYANAN = {
nama_layanan: "",
harga_perkilo: "",
estimasi_hari: "",
}

export const INITIAL_STATE_LAYANAN = {
  status: 'idle',
  errors: {
    nama_layanan: [],
harga_perkilo: [],
estimasi_hari: [],
_form:[]
  }
}