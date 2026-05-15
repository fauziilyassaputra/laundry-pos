import z from "zod";

export const pesananFormSchema = z.object({
  id_user: z.string().min(1, "wajib diisi"),
  id_pelanggan: z.string().min(1, "wajib diisi"),
  id_layanan: z.string().min(1, "wajib diisi"),
  tipe_pesanan: z.string().min(1, "wajib diisi"),
  catatan: z.string().optional(),
});

export type pesananSchema = z.infer<typeof pesananFormSchema>;
