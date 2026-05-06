import z from "zod";

export const operasiFormSchema = z.object({
  id_pesanan: z.string().min(1, "Harus diisi"),
  id_mesin: z.string().min(1, "Harus diisi"),
  waktu_mulai: z.string().min(1, "Harus diisi"),
});

export type operasiSchema = z.infer<typeof operasiFormSchema>;
