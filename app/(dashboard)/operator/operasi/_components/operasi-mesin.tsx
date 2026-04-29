"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_MESIN } from "@/constants/mesin-constant";
import { HEADER_TABLE_OPERASI } from "@/constants/operasi-mesin-constant";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export default function OperasiMesinManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const { data: operasi_mesin, isLoading } = useQuery({
    queryKey: ["operasi_mesin", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("penggunaan_mesin")
        .select("*", { count: "exact" })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1,
        );
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
        mesin.waktu_mulai,
        mesin.waktu_selesai,
        <DropdownAction
          menu={[
            {
              label: (
                <span className="flex item-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {},
            },
            {
              label: (
                <span className="flex item-center gap-2">
                  <Trash2 className="text-red-400" />
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => {},
            },
          ]}
        />,
      ];
    });
  }, [operasi_mesin]);

  const totalPages = useMemo(() => {
    return operasi_mesin && operasi_mesin.count !== null
      ? Math.ceil(operasi_mesin.count / currentLimit)
      : 0;
  }, [operasi_mesin]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
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
