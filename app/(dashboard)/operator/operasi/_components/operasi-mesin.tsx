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
import { HEADER_TABLE_MESIN } from "@/constants/mesin-constant";
import { HEADER_TABLE_OPERASI } from "@/constants/operasi-mesin-constant";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn, formatWaktuWib } from "@/lib/utils";
import { Profile } from "@/types/auth";

import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowBigUpDash,
  ArrowUp,
  ArrowUpCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CreateOperasi from "./create-operasi";
import { useAuthStore } from "@/store/auth-store";

export default function OperasiMesinManagement() {
  const profile = useAuthStore((state) => state.profile )
  const supabase = createClient();
  const queryClient = useQueryClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const { data: operasi_mesin, isLoading } = useQuery({
    queryKey: ["operasi_mesin", currentPage, currentLimit, currentSearch, profile?.id, profile?.jabatan],
    queryFn: async () => {
      let query = supabase
        .from("penggunaan_mesin")
        .select("*, pesanan!inner (id_user)", { count: "exact" })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1,
        );
        if (profile?.jabatan === "operator" && profile?.id){
          query = query.eq("pesanan.id_user", profile.id)
        }
      if (currentSearch) {
        query.or(
          `id_pesanan.ilike.%${currentSearch}%,id_mesin.ilike.%${currentSearch}%,status_proses.ilike.%${currentSearch}%`,
        );
        
      }
      const result = await query;

      if (result.error)
        toast.error("get mesin data failed: ", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!profile?.id,
  });

  const filteredData = useMemo(() => {
    return (operasi_mesin?.data || []).map((mesin, index) => {
      if (mesin.waktu_Selesai === null) {
        mesin.waktu_selesai = "belum selesai";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        mesin.id_penggunaan_mesin,
        mesin.id_pesanan,
        mesin.id_mesin,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-green-600": mesin.status_proses === "selesai",
            "bg-red-600": mesin.status_proses === "berjalan",
          })}
        >
          {mesin.status_proses}
        </div>,
        formatWaktuWib(mesin.waktu_mulai),
        formatWaktuWib(mesin.waktu_selesai),
        <DropdownAction
          menu={
            mesin.status_proses === "berjalan"
              ? [
                  {
                    label: (
                      <span className="flex item-center gap-2">
                        <ArrowUpCircle className="size-5" />
                        Update Status
                      </span>
                    ),
                    action: async () => {
                      const toastId = toast.loading("Memproses...");
                      console.log(
                        "ID yang dikirim:",
                        mesin.id_penggunaan_mesin,
                      );
                      const { error } = await supabase
                        .from("penggunaan_mesin")
                        .update({ status_proses: "selesai" })
                        .eq("id_penggunaan_mesin", mesin.id_penggunaan_mesin)
                        .select();

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
                          queryKey: ["operasi_mesin"],
                        });
                      }
                    },
                  },
                ]
              : [
                  {
                    label: (
                      <span className="text-muted-foreground disabled">
                        Operasi selesai
                      </span>
                    ),
                  },
                ]
          }
        />,
      ];
    });
  }, [operasi_mesin]);

  const totalPages = useMemo(() => {
    return operasi_mesin && operasi_mesin.count !== null
      ? Math.ceil(operasi_mesin.count / currentLimit)
      : 0;
  }, [operasi_mesin]);
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Operation Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog open={openCreateOrder} onOpenChange={setOpenCreateOrder}>
            <DialogTrigger asChild>
              <DialogTitle>
                <Button variant="outline">Create</Button>
              </DialogTitle>
            </DialogTrigger>
            <DialogContent className="max-h-50 overflow-y-auto">
              <CreateOperasi closeDialog={() => setOpenCreateOrder(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_OPERASI}
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
