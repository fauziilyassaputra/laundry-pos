"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_CUCIAN } from "@/constants/cucian-constant";
import { HEADER_TABLE_PESANAN } from "@/constants/pesanan-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, ScrollText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CreateCucian from "./create-cucian";
import CardCucian from "./card-cucian";
import CardStruk from "./struk";

export default function ItemCucianManagement({ id: id }: { id: string }) {
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
          `id_pesanan.ilike.%${currentSearch}%,jenis_pakaian.ilike.%${currentSearch}%,kondisi_cucian.ilike.%${currentSearch}%,tipe_pesanan.ilike.%${currentSearch}%`,
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
      if (item.kondisi_cucian === null) {
        item.kondisi_cucian = "catatan kosong";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        item.id_pesanan,
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
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
        <div>
        <h1 className="text-2xl font-bold mb-2">Cucian Management</h1>

        <Dialog open={openCreateOrder} onOpenChange={setOpenCreateOrder}>
          <DialogTrigger asChild>
            <Button variant="outline">buat cucian</Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-transparent border-none shadow-none p-0">
            <DialogTitle className="sr-only">Tampilan Struk</DialogTitle>
            <CreateCucian closeDialog={() => setOpenCreateOrder(false)} id_pesanan={id} />
          </DialogContent>
        </Dialog>
        </div>
       
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-slate-800 dark:bg-white">
              Lihat Struk
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-transparent border-none shadow-none p-0">
            <DialogTitle className="sr-only">Tampilan Struk</DialogTitle>
            <CardStruk id={id} item_cucian={item_cucian?.data} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        <div className="lg:col-span-2 w-full overflow-hidden">
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
        <div className="lg:col-span-1 w-full sticky top-4">
          <CardCucian id={id} />
        </div>
      </div>
    </div>
  );
}
