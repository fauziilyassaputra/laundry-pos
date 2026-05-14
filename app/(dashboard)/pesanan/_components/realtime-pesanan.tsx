import { createClient } from "@/lib/supabase/client";
import {  useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useReltimePesanan(){
    console.log("hook dipanggil")
    const queryClient = useQueryClient()
    useEffect(() => {
        console.log("use effect berjalan")
        const supabase = createClient()
        const namaChannel = `realtime-pesanan-${Date.now()}`;
        const channel = supabase.channel("realtime-pesanan")
        .on("postgres_changes",{
            event: "*",
            schema: "public",
            table: "pesanan"
        },
        (payload) => {
            console.log("data berubah:, ", payload)
            queryClient.invalidateQueries({queryKey: ["pesanan_pesanan"]})
        }
    )
    .subscribe((status) => {
        console.log("status koneksi realtime: " ,status)
    });

    return () => {
        console.log("memutus koneksi: ",{namaChannel})
        supabase.removeChannel(channel);
    }
    },[queryClient])

}