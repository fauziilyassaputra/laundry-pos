export type LayananFormState = {
    status: string;
    errors?:{
        nama_layanan?: string[];
        harga_perkilo?: string[];
        estimasi_hari?: string[];
        _form?: string[];
    }
}