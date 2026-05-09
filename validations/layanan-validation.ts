import { z } from "zod";

export const layananFormSchema = z.object({
    nama_layanan: z.string().min(1, "harus diisi"),
    harga_perkilo: z.string().min(1, "harus diisi"),
    estimasi_hari: z.string().min(1, "harus diisi")
})

export type layananSchema = z.infer<typeof layananFormSchema>