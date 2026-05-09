import { z } from "zod";

export const mesinFormSchema = z.object({
    nama_mesin: z.string().min(1, "harus diisi"),
    tipe_mesin: z.string().min(1, "harus diisi")
})

export type mesinSchema = z.infer<typeof mesinFormSchema>