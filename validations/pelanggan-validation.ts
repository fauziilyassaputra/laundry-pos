import z, { nullable } from "zod";

export const pelangganFormSchema = z.object({
  nama_pelanggan: z.string().min(1, "Harus diisi"),
  nomor_telepon: z.string().min(1, "Harus diisi"),
  alamat_rumah: z.string().optional(),
});
export const pelangganForm = z.object({
  nama_pelanggan: z.string(),
  nomor_telepon: z.string(),
  alamat_rumah: z.string().optional().or(z.literal("")),
});

export type pelangganSchema = z.infer<typeof pelangganFormSchema>;
export type Pelanggan = z.infer<typeof pelangganForm> & {id_pelanggan: string};
