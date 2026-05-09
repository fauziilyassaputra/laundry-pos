'use server'
import { createClient } from "@/lib/supabase/server";
import { LayananFormState } from "@/types/layanan";
import { layananFormSchema } from "@/validations/layanan-validation";
import { revalidatePath } from "next/cache";


export async function createLayanan(
    prevState: LayananFormState,
    formData: FormData
){
    const validatedFields = layananFormSchema.safeParse({
        nama_layanan: formData.get("nama_layanan"),
        harga_perkilo: formData.get("harga_perkilo"),
        estimasi_hari: formData.get("estimasi_hari"),
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

  const rawData = validatedFields.data
  const supabase = await createClient()

  const{data: newOrder, error: insertError} = await supabase.from("layanan").insert([
    {
        nama_layanan: rawData.nama_layanan,
        harga_perkilo: rawData.harga_perkilo,
        estimasi_hari: rawData.estimasi_hari
    },
  ])
  .select("id_layanan")
  .single();
if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath("/dashboard/layanan");

  return {
    status: "success",
    message: "Pesanan baru berhasil dibuat!",
    newOrderId: newOrder.id_layanan,
  };
} 