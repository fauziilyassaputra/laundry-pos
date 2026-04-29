"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_MESIN } from "@/constants/mesin-constant";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export default function MesinManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const { data: mesin_mesin, isLoading } = useQuery({
    queryKey: ["mesin_mesin", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("mesin")
        .select("*", { count: "exact" })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1,
        );
      if (currentSearch) {
        query.or(
          `nama_mesin.ilike.%${currentSearch}%,tipe_mesin.ilike.%${currentSearch}%,status_mesin.ilike.%${currentSearch}%`,
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
    return (mesin_mesin?.data || []).map((mesin, index) => {
      if (mesin.tanggal_service_terakhir === null) {
        mesin.tanggal_service_terakhir = "tidak ada perbaikan sama sekali";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        mesin.id_mesin,
        mesin.nama_mesin,
        <h4 className="font-bold">{mesin.tipe_mesin}</h4>,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-green-600": mesin.status_mesin === "ready",
            "bg-red-600": mesin.status_mesin === "in use",
            "bg-gray-500": mesin.status_mesin === "broken",
          })}
        >
          {mesin.status_mesin}
        </div>,
        mesin.tanggal_service_terakhir,
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
  }, [mesin_mesin]);

  const totalPages = useMemo(() => {
    return mesin_mesin && mesin_mesin.count !== null
      ? Math.ceil(mesin_mesin.count / currentLimit)
      : 0;
  }, [mesin_mesin]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Mesin Management</h1>
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
        header={HEADER_TABLE_MESIN}
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
