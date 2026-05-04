"use server";
import { createClient } from "@/lib/supabase/server";
import { PesananFormState } from "@/types/pesanan";
import { pesananFormSchema } from "@/validations/pesanan-validation";
import { revalidatePath } from "next/cache";

export async function createPesanan(
  prevState: PesananFormState,
  formData: FormData,
) {
  const validatedFields = pesananFormSchema.safeParse({
    id_pelanggan: formData.get("id_pelanggan"),
    id_layanan: formData.get("id_layanan"),
    total_harga: formData.get("total_harga"),
    tipe_pesanan: formData.get("tipe_pesanan"),
    catatan: formData.get("catatan"),
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

  const totalHargaNumber = parseFloat(rawData.total_harga);

  const { data: newOrder, error: insertError } = await supabase
    .from("pesanan")
    .insert([
      {
        id_pelanggan: rawData.id_pelanggan,
        id_layanan: rawData.id_layanan,
        id_user: user?.id,
        tipe_pesanan: rawData.tipe_pesanan,
        total_harga: totalHargaNumber,
        status_pesanan: "diterima",
        catatan: rawData.catatan || null,
      },
    ])
    .select("id_pesanan")
    .single();

  if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath("/dashboard/pesanan");

  return {
    status: "success",
    message: "Pesanan baru berhasil dibuat!",
    newOrderId: newOrder.id_pesanan,
  };
}
