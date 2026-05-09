export const HEADER_TABLE_MESIN = [
  "No",
  "id",
  "nama mesin",
  "tipe mesin",
  "status mesin",
  "tanggal service terakhir",
  "Action",
];

export const INITIAL_MESIN = {
  nama_mesin: "",
  tipe_mesin:"",
}

export const INITIAL_MESIN_STATE = {
  status: 'idle',
  errors: {
    nama_mesin: [],
    tipe_mesin:[],
    _form: []
  }
}