"use server";
import { createClient } from "@/lib/supabase/server";
import { PelangganFormState } from "@/types/pelanggan";
import { pelangganFormSchema } from "@/validations/pelanggan-validation";
import { revalidatePath } from "next/cache";

export async function createPelanggan(
  prevState: PelangganFormState,
  formData: FormData,
) {
  const validatedFields = pelangganFormSchema.safeParse({
    nama_pelanggan: formData.get("nama_pelanggan"),
    nomor_telepon: formData.get("nomor_telepon"),
    alamat_rumah: formData.get("alamat_rumah"),
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

  const { data: newOrder, error: insertError } = await supabase
    .from("pelanggan")
    .insert([
      {
        nama_pelanggan: rawData.nama_pelanggan,
        nomor_telepon: rawData.nomor_telepon,
        alamat_rumah: rawData.alamat_rumah || null,
      },
    ])
    .select("id_pelanggan")
    .single();

  if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath("/pelanggan");

  return {
    status: "success",
    message: "Pesanan baru berhasil dibuat!",
    newOrderId: newOrder.id_pelanggan,
  };
}
