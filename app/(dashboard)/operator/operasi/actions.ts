"use server";
import { createClient } from "@/lib/supabase/server";
import { OperasiFormState } from "@/types/operasi";
import { operasiFormSchema } from "@/validations/operasi-validation";
import { revalidatePath } from "next/cache";

export async function createOperasi(
  prevState: OperasiFormState,
  formData: FormData,
) {
  const validatedFields = operasiFormSchema.safeParse({
    id_pesanan: formData.get("id_pesanan") as string,
    id_mesin: formData.get("id_mesin") as string,
    status_proses: formData.get("status_proses") as string,
    waktu_mulai: formData.get("waktu_mulai") as string,
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
    .from("penggunaan_mesin")
    .insert([
      {
        id_pesanan: rawData.id_pesanan,
        id_mesin: rawData.id_mesin,
        status_proses: rawData.status_proses,
        waktu_mulai: rawData.waktu_mulai,
      },
    ])
    .select("id_penggunaan_mesin")
    .single();

  if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath("/dashboard/operator/operasi");

  return {
    status: "success",
    message: "Operasi mesin baru berhasil dibuat!",
    newOrderId: newOrder.id_penggunaan_mesin,
  };
}
