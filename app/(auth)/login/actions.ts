"use server";

import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { createClient } from "@/lib/supabase/server";
import { authFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: authFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }
  const validatedVield = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedVield.success) {
    return {
      status: "error",
      errors: { ...validatedVield.error.flatten().fieldErrors, _form: [] },
    };
  }
  const supabase = await createClient({});

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(validatedVield.data);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  const { data: user_profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (user_profile) {
    const cookiesStore = await cookies();
    cookiesStore.set("user_profile", JSON.stringify(user_profile), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  revalidatePath("/", "layout");
  redirect("/");
}
