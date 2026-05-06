import z from "zod";

export const pelangganFormSchema = z.object({
  nama_pelanggan: z.string().min(1, "Harus diisi"),
  nomor_telepon: z.string().min(1, "Harus diisi"),
  alamat_rumah: z.string().optional(),
});

export type pelangganSchema = z.infer<typeof pelangganFormSchema>;
