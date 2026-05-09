'use server'
import { createClient } from "@/lib/supabase/server";
import { MesinFormState } from "@/types/mesin";
import { mesinFormSchema } from "@/validations/mesin-validation";
import { revalidatePath } from "next/cache";

export async function createMesin(
    prevState: MesinFormState,
    formData: FormData
){
     const validatedFields = mesinFormSchema.safeParse({
       nama_mesin: formData.get("nama_mesin"),
       tipe_mesin: formData.get("tipe_mesin"),
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

  const{data: newOrder, error: insertError} = await supabase.from("mesin").insert([
    {
       nama_mesin: rawData.nama_mesin,
       tipe_mesin: rawData.tipe_mesin,
       status_mesin: "ready",
       tanggal_service_terakhir: null
    },
  ])
  .select("id_mesin")
  .single();
if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath("/dashboard/operator/mesin");

  return {
    status: "success",
    message: "Pesanan baru berhasil dibuat!",
    newOrderId: newOrder.id_mesin,
  };
} 
