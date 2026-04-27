import { environment } from "@/config/environment";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = environment;
  console.log(
    "cek apakah ada isinya: ",
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
  );
  return createBrowserClient(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!);
}
