import { z } from "zod";

export const mesinFormSchema = z.object({
  nama_mesin: z.string().min(1, "harus diisi"),
  tipe_mesin: z.string().min(1, "harus diisi"),
});
export const mesinForm = z.object({
  nama_mesin: z.string(),
  tipe_mesin: z.string(),
  status_mesin: z.string(),
  tanggal_service_terakhir: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(""))
    .or(z.literal("-")),
});

export type mesinSchema = z.infer<typeof mesinFormSchema>;
export type mesin = z.infer<typeof mesinForm>;
export type Mesin = z.infer<typeof mesinForm> & { id_mesin: string };
