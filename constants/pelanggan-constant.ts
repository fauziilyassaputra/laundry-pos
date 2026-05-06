export const HEADER_TABLE_PELANGGAN = [
  "No",
  "ID",
  "Nama Pelanggan",
  "Nomor Telepon",
  "alamat rumah",
  "Action",
];

export const INITIAL_PELANGGAN = {
  nama_pelanggan: "",
  nomor_telepon: "",
  alamat_rumah: "",
};

export const INITIAL_STATE_PELANGGAN = {
  status: "idle",
  errors: {
    nama_pelanggan: [],
    nomor_telepon: [],
    alamat_rumah: [],
    _form: [],
  },
};
