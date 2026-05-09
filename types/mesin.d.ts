export type MesinFormState = {
    status: string;
    errors?: {
        nama_mesin?: string[];
        tipe_mesin?: string[];
    }
}