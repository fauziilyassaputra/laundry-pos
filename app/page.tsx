"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

export default function Home() {
  const profile = useAuthStore((state) => state.profile);
  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-4xl font-semibold">
        Welcome {profile?.nama || "User"}
      </h1>
      <Link href="/admin">
        <Button className="bg-teal-500 text-white">Access Dashboard</Button>
      </Link>
    </div>
  );
}
