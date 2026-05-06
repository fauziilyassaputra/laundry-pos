export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_STATE_LOGIN_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

export const INITIAL_STATE_PROFILE = {
  id: "",
  nama: "",
  nomor_telepon: "",
  jabatan: "",
  avatar_url: "",
};

export const INITIAL_CREATE_USER_FORM = {
  nama: "",
  jabatan: "",
  nomor_telepon: "",
  avatar_url: "",
  email: "",
  password: "",
};

export const INITIAL_STATE_CREATE_USER = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    nama: [],
    jabatan: [],
    nomor_telepon: [],
    avatar_url: [],
    _form: [],
  },
};

export const INITIAL_STATE_UPDATE_USER = {
  status: "idle",
  errors: {
    nama: [],
    jabatan: [],
    nomor_telepon: [],
    avatar_url: [],
    _form: [],
  },
};

export const JABATAN_LIST = [
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "operator",
    label: "Operator",
  },
  {
    value: "cashier",
    label: "Cashier",
  },
];
