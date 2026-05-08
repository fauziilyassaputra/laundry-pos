"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export default function CardStruk({
  id,
  item_cucian,
}: {
  id: string;
  item_cucian?:
    | {
        jenis_pakaian: string;
        berat_kg: number;
        kondisi_cucian: string;
      }[]
    | null
    | undefined;
}) {
  const supabase = createClient();
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => ({
    content: () => componentRef.current,
    documentTitle: `Struk_Pesanan_${id}`,
  });

  const { data: pesananData, isLoading: loadpesanan } = useQuery({
    queryKey: ["pesanan_list", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pesanan")
        .select(
          "id_pesanan, id_pelanggan, status_pesanan, total_harga, tanggal_masuk",
        )
        .eq("id_pesanan", id);

      if (error) throw error;
      return data;
    },
  });

  const { data: pelangganData, isLoading: loadpelanggan } = useQuery({
    queryKey: ["pelanggan_list", pesananData?.[0].id_pelanggan],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pelanggan")
        .select("nama_pelanggan")
        .eq("id_pelanggan", pesananData?.[0].id_pelanggan);

      if (error) throw error;
      return data;
    },
    enabled: !!pesananData?.[0]?.id_pelanggan,
  });

  const { data: pembayaranData, isLoading: loadpembayaran } = useQuery({
    queryKey: ["pembayaran_list", pesananData?.[0]?.id_pesanan],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pembayaran")
        .select("id_pembayaran, status_pembayaran")
        .eq("id_pesanan", pesananData?.[0]?.id_pesanan);

      if (error) throw error;
      return data;
    },
    enabled: !!pesananData?.[0]?.id_pesanan,
  });
  console.log('isi pesanan: ',pesananData);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full">
      <div className="mb-4 flex justify-start border-b pb-4">
        <Button
          onClick={handlePrint}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-semibold"
        >
          klik untuk Cetak Struk
        </Button>
      </div>

      <div className="p-2 text-slate-800" ref={componentRef}>
        <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider">
            Struk Laundry
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Terima kasih telah mempercayakan cucian Anda
          </p>
        </div>

        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">ID Pesanan:</span>
            <span className="font-semibold">
              #{pesananData?.[0]?.id_pesanan}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pelanggan:</span>
            <span className="font-semibold uppercase">
              {pelangganData?.[0]?.nama_pelanggan || "Loading..."}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal Masuk:</span>
            <span className="font-semibold">
              {pesananData?.[0]?.tanggal_masuk
                ? new Date(pesananData[0].tanggal_masuk).toLocaleString(
                    "id-ID",
                    { dateStyle: "medium", timeStyle: "short" },
                  )
                : "Loading..."}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-2">
            Item Cucian
          </h2>
          <div className="border-t border-b border-dashed border-gray-300 py-2 space-y-3">
            {item_cucian?.map((item, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between font-semibold">
                  <span className="capitalize">{item.jenis_pakaian}</span>
                  <span>{item.berat_kg} kg</span>
                </div>
                <div className="text-gray-500 text-xs italic mt-0.5">
                  Kondisi: {item.kondisi_cucian}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Status Pembayaran:</span>
            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold uppercase border">
              {pembayaranData?.[0]?.status_pembayaran || "Loading..."}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-base">Total Harga:</span>
            <span className="font-bold text-xl">
              Rp{" "}
              {pesananData?.[0]?.total_harga?.toLocaleString("id-ID") ||
                "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
