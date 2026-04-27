export type authFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    nama?: string[];
    nomor_telepon?: string[];
    avatar_url?: string[];
    _form?: string[];
  };
};

export type Profile = {
  id?: string;
  nama?: string;
  nomor_telepon?: string;
  jabatan?: string;
  avatar_url?: string;
};
