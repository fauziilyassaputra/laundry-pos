"use server"
import { createClient } from "@/lib/supabase/server";
import { CucianFormState } from "@/types/cucian";
import { cucianFormSchema } from "@/validations/cucian-validation";
import { revalidatePath } from "next/cache";

export async function createCucian(
  prevState: CucianFormState,
  formData: FormData,
) {
  const validatedFields = cucianFormSchema.safeParse({
    id_pesanan: formData.get("id_pesanan") as string,
    jenis_pakaian: formData.get("jenis_pakaian") as string,
    berat_kg: formData.get("berat_kg") as string,
    kondisi_pakaian: formData.get("kondisi_pakaian") as string,
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
    .from("item_cucian")
    .insert([
      {
        id_pesanan: rawData.id_pesanan,
        jenis_pakaian: rawData.jenis_pakaian,
        berat_kg: rawData.berat_kg,
        kondisi_cucian: rawData.kondisi_cucian,
      },
    ])
    .select("id_cucian")
    .single();

  if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath(`/dashboard/pesanan/${rawData.id_pesanan}`);

  return {
    status: "success",
    message: "Operasi mesin baru berhasil dibuat!",
    newOrderId: newOrder.id_cucian,
  };
}
