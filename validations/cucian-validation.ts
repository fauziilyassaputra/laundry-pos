import z from "zod";

export const cucianFormSchema = z.object({
  id_pesanan: z.string().min(1, "Harus diisi"),
  jenis_pakaian: z.string().min(1, "Harus diisi"),
  berat_kg: z.string().min(1, "Harus diisi"),
  kondisi_cucian: z.string().optional(),
});

export type cucianSchema = z.infer<typeof cucianFormSchema>;
