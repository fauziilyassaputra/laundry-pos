"use server";
import { createClient } from "@/lib/supabase/server";
import { PembayaranFormState } from "@/types/pembayaran";
import { pembayaranFormSchema } from "@/validations/pembayaran-validation";
import { revalidatePath } from "next/cache";

export async function updatePembayaran(
  prevState: PembayaranFormState,
  formData: FormData,
) {
  const validatedFields = pembayaranFormSchema.safeParse({
    id_pesanan: formData.get("id_pesanan"),
    tanggal_bayar: formData.get("tanggal_bayar"),
    jumlah_bayar: formData.get("jumlah_bayar"),
    metode_bayar: formData.get("metode_bayar"),
    status_pembayaran: formData.get("status_pembayaran"),
  });
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }
  const rawData = validatedFields.data;
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      status: "error",
      message: "Gagal memproses: Anda harus login ulang.",
    };
  }

  const id_pembayaran = formData.get("id_pembayaran") as string;

  const { data: newOrder, error: insertError } = await supabase
    .from("pembayaran")
    .update([
      {
        id_pesanan: rawData.id_pesanan,
        tanggal_bayar: rawData.tanggal_bayar,
        jumlah_bayar: rawData.jumlah_bayar,
        metode_bayar: rawData.metode_bayar,
        status_pembayaran: rawData.status_pembayaran,
      },
    ])
    .eq("id_pembayaran", id_pembayaran)
    .single();

  if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath("cashier/pembayaran");

  return {
    status: "success",
    message: "Pesanan berhasil diperbarui!",
  };
}
