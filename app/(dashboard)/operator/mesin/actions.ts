"use server";
import { createClient } from "@/lib/supabase/server";
import { MesinFormState } from "@/types/mesin";
import { mesinForm, mesinFormSchema } from "@/validations/mesin-validation";
import { revalidatePath } from "next/cache";

export async function createMesin(
  prevState: MesinFormState,
  formData: FormData,
) {
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
  const rawData = validatedFields.data;
  const supabase = await createClient();

  const { data: newOrder, error: insertError } = await supabase
    .from("mesin")
    .insert([
      {
        nama_mesin: rawData.nama_mesin,
        tipe_mesin: rawData.tipe_mesin,
        status_mesin: "ready",
        tanggal_service_terakhir: null,
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

export async function updateMesin(
  prevState: MesinFormState,
  formData: FormData,
) {
  const validatedFields = mesinForm.safeParse({
    nama_mesin: formData.get("nama_mesin"),
    tipe_mesin: formData.get("tipe_mesin"),
    status_mesin: formData.get("status_mesin"),
    tanggal_service_terakhir: formData.get("tanggal_service_terakhir"),
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
  const id_mesin = formData.get("id_mesin");

  let tanggal_fix = rawData.tanggal_service_terakhir;
  if (tanggal_fix === "-" || tanggal_fix === "") {
    tanggal_fix = null;
  }
  const { data: newOrder, error: insertError } = await supabase
    .from("mesin")
    .update({
      nama_mesin: rawData.nama_mesin,
      tipe_mesin: rawData.tipe_mesin,
      status_mesin: rawData.status_mesin,
      tanggal_service_terakhir: tanggal_fix,
    })
    .eq("id_mesin", id_mesin);
  if (insertError) {
    return {
      status: "error",
      message: "Gagal menyimpan ke database: " + insertError.message,
    };
  }

  revalidatePath("/dashboard/operator/mesin");

  return {
    status: "success",
    message: "mesin berhasil diupdate!",
  };
}

export async function deleteMesin(
  prevState: MesinFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mesin")
    .delete()
    .eq("id_mesin", formData.get("id_mesin"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  revalidatePath("/operator/mesin");
  return { status: "success" };
}
