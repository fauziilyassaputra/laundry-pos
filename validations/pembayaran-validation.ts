import z from "zod";

export const pembayaranFormSchema = z.object({
  id_pesanan: z.string().min(1, "Harus diisi"),
  tanggal_bayar: z.string().min(1, "Harus diisi"),
  jumlah_bayar: z.string().min(1, "Harus diisi"),
  metode_bayar: z.string().min(1, "Harus diisi"),
  status_pembayaran: z.string().min(1, "Harus diisi"),
});
export const pembayaranForm = z.object({
  id_pesanan: z.string(),
  tanggal_bayar: z.string(),
  jumlah_bayar: z.string(),
  metode_bayar: z.string(),
  status_pembayaran: z.string(),
});

export type pembayaranSchema = z.infer<typeof pembayaranFormSchema>;
export type Pembayaran = z.infer<typeof pembayaranForm> & {
  id_pembayaran: string;
};
