import { z } from "zod";

export const layananFormSchema = z.object({
  nama_layanan: z.string().min(1, "harus diisi"),
  harga_perkilo: z.string().min(1, "harus diisi"),
  estimasi_hari: z.string().min(1, "harus diisi"),
});
export const layananForm = z.object({
  nama_layanan: z.string().or(z.literal("")),
  harga_perkilo: z.string().or(z.literal("")),
  estimasi_hari: z.string().or(z.literal("")),
});

export type layananSchema = z.infer<typeof layananFormSchema>;
export type Layanan = z.infer<typeof layananForm> & { id_layanan: string };
