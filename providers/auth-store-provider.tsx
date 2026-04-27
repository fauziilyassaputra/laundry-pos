"use client";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import { Profile } from "@/types/auth";
import { ReactNode, useEffect } from "react";

export default function AuthStoreProviders({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setProfile(profile);
    });
  });
  return <>{children}</>;
}
