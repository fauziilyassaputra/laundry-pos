"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_CUCIAN } from "@/constants/cucian-constant";
import { HEADER_TABLE_PESANAN } from "@/constants/pesanan-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, ScrollText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";

export default function ItemCucianManagement({ id }: { id: string }) {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const { data: item_cucian, isLoading } = useQuery({
    queryKey: ["item_cucian", id],
    queryFn: async () => {
      const query = supabase
        .from("item_cucian")
        .select("*", { count: "exact" })
        .eq("id_pesanan", id);
      if (currentSearch) {
        query.or(
          `id_pesanan.ilike.%${currentSearch}%,jenis_pakaian.ilike.%${currentSearch}%,kondisi_cucianz.ilike.%${currentSearch}%,tipe_pesanan.ilike.%${currentSearch}%`,
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
  const filteredData = useMemo(() => {
    return (item_cucian?.data || []).map((item, index) => {
      if (item.kondisi_cucian === "null") {
        item.kondisi_cucian = "Tidak dicanatumkan";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        item.id_cucian,
        item.jenis_pakaian,
        item.berat_kg,
        item.kondisi_cucian,
      ];
    });
  }, [item_cucian]);

  const totalPages = useMemo(() => {
    return item_cucian && item_cucian.count !== null
      ? Math.ceil(item_cucian.count / currentLimit)
      : 0;
  }, [item_cucian]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Cucian Management</h1>
      </div>

      <DataTable
        header={HEADER_TABLE_CUCIAN}
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
