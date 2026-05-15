"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_PESANAN } from "@/constants/pesanan-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn, formatWaktuWib } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import {  useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpCircle, Pencil, ScrollText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DialogCreatePesanan from "./create-pesanan";
import DialogNotes from "@/components/common/dialog-notes";

export default function PesananManagement() {
  
  const supabase = createClient();
  const queryClient = useQueryClient()
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  const profile = useAuthStore((state) => state.profile);

  const { data: pesanan_pesanan, isLoading, refetch: refetchPesanan } = useQuery({
    queryKey: ["pesanan_pesanan", currentPage, currentLimit, currentSearch, profile?.id, profile?.jabatan],
    queryFn: async () => {
      let query = supabase
        .from("pesanan")
        .select(`*, operator:id_user(id,nama)`, { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at", {ascending: false});
        if (profile?.jabatan === "operator"){
          query = query.eq("id_user", profile.id)
        }
        
     
      if (currentSearch) {
        query = query.or(
          `id_pesanan.ilike.%${currentSearch}%,status_pesanan.ilike.%${currentSearch}%,total_harga.ilike.%${currentSearch}%,tipe_pesanan.ilike.%${currentSearch}%`,
        );
      }
      const result = await query;

      if (result.error)
        toast.error("get pesanan data failed: ", {
          description: result.error.message,
        });

      return result;
    },
  });

   useEffect(() => {
    const channel = supabase
      .channel('change-pesanan')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pesanan',
        },
        () => {
      queryClient.invalidateQueries({queryKey:["pesanan_pesanan"]});
          refetchPesanan();

    },
      )
      .subscribe();

    return () => {
      
      supabase.removeChannel(channel);
    };
  }, [refetchPesanan, supabase]);


 
  const filteredData = useMemo(() => {
    return (pesanan_pesanan?.data || []).map((pesanan, index) => {
      if (pesanan.catatan === null || "") {
        pesanan.catatan = "-";
      }
      if (pesanan.tanggal_selesai === null) {
        pesanan.tanggal_selesai = "Pesanan belum selesai";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        pesanan.id_pesanan,
        pesanan.operator?.nama || "Operator tidak ditemukan",
        pesanan.id_pelanggan,
        pesanan.id_layanan,

        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit ", {
            "bg-green-600":
              pesanan.status_pesanan === "diterima" ||
              pesanan.status_pesanan === "selesai dicuci" ||
              pesanan.status_pesanan === "selesai dikeringkan",
            "bg-red-600":
              pesanan.status_pesanan === "dicuci" ||
              pesanan.status_pesanan === "dikeringkan" ||
              pesanan.status_pesanan === "disetrika",
            "bg-yellow-500": pesanan.status_pesanan === "selesai",
            "bg-gray-500": pesanan.status_pesanan === "diambil",
          })}
        >
          {pesanan.status_pesanan}
        </div>,
        <h1 className="text-xl font-semibold">{pesanan.total_harga}</h1>,
        pesanan.catatan && pesanan.catatan !== "-" ? (
           <Dialog>
          <DialogTrigger asChild>
            <DialogTitle>
              <Button size="sm" variant="outline">Catatan</Button>
            </DialogTitle>
          </DialogTrigger>
          <DialogNotes text={pesanan.catatan} notesType="catatan pesanan" />
          </Dialog>
        ): (
          <span>{pesanan.catatan}</span>
        )
        ,
        formatWaktuWib(pesanan.tanggal_masuk),
        formatWaktuWib(pesanan.tanggal_estimasi_selesai),
        formatWaktuWib(pesanan.tanggal_selesai),
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit ", {
            "bg-blue-600": pesanan.tipe_pesanan === "ambil pesanan",
            "bg-orange-400": pesanan.tipe_pesanan === "antar pesanan",
          })}
        >
          {pesanan.tipe_pesanan}
        </div>,
        <DropdownAction
          menu={
            pesanan.status_pesanan !== "diambil" ?
            [
            {
              label: (
                <Link
                  href={`/pesanan/${pesanan.id_pesanan}`}
                  className="flex item-center gap-2"
                >
                  <ScrollText />
                  Detail
                </Link>
              ),
              type: "link",
            },
            ...(pesanan.status_pesanan === "selesai" ? [
               { label: (
               <span className="flex item-center gap-2">
                        <ArrowUpCircle className="size-5" />
                        diambil
                      </span>
              ),
              action: async () => {
                const toastId = toast.loading("Memproses...")
                const {error} = await supabase
                .from("pesanan")
                .update({status_pesanan: "diambil"})
                .eq("id_pesanan",pesanan.id_pesanan)
                .select()
                if (error) {
                        toast.error("Gagal update status: " + error.message, {
                          id: toastId,
                        });
                      } else {
                        toast.success(
                          "Status berhasil diupdate menjadi selesai!",
                          {
                            id: toastId,
                          },
                        );
                        queryClient.invalidateQueries({
                          queryKey: ["pesanan_pesanan"],
                        });
                      }
              }
             
            }
            ]: []),
              
            
          ]: [
              {
                    label: (
                      <span className="text-muted-foreground disabled">
                        Operasi selesai
                      </span>
                    ),
                  },
          ]}
        />,
      ];
    });
  }, [pesanan_pesanan]);

  const totalPages = useMemo(() => {
    return pesanan_pesanan && pesanan_pesanan.count !== null
      ? Math.ceil(pesanan_pesanan.count / currentLimit)
      : 0;
  }, [pesanan_pesanan]);
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Pesanan Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog open={openCreateOrder} onOpenChange={setOpenCreateOrder}>
            <DialogTrigger asChild>
              <DialogTitle>
                { profile?.jabatan !== "operator" && (
                  
                <Button variant="outline"  
                >Create</Button>
                )}
              </DialogTitle>
            </DialogTrigger>

            <DialogCreatePesanan
              closeDialog={() => setOpenCreateOrder(false)}
            />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_PESANAN}
        data={filteredData}
        isLoading={isLoading}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalPage={totalPages}
        currentLimit={currentLimit}
        onChangeLimit={handleChangeLimit}
      />
    </div>
  );
}
