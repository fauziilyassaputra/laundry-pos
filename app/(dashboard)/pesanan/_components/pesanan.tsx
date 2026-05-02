"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_PESANAN } from "@/constants/pesanan-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export default function PesananManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const { data: pesanan_pesanan, isLoading } = useQuery({
    queryKey: ["pesanan_pesanan", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("pesanan")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");
      if (currentSearch) {
        query.or(
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
  const filteredData = useMemo(() => {
    return (pesanan_pesanan?.data || []).map((pesanan, index) => {
      // if (pesanan.catatan === null) {
      //   pesanan.catatan = "Belum Dihitung";
      // }
      if (pesanan.tanggal_selesai === null) {
        pesanan.tanggal_selesai = "Pesanan belum selesai";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        pesanan.id_pesanan,
        pesanan.id_pelanggan,
        pesanan.id_user,
        pesanan.id_layanan,

        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit ", {
            "bg-green-600":
              pesanan.status_pesanan === "diterima" ||
              "selesai dicuci" ||
              "selesai dikeringkan",
            "bg-red-600":
              pesanan.status_pesanan === "dicuci" ||
              "dikeringkan" ||
              "di setrika",
            "bg-yellow-500": pesanan.status_pesanan === "selesai",
            "bg-gray-500": pesanan.status_pesanan === "diambil",
          })}
        >
          {pesanan.status_pesanan}
        </div>,
        <h1 className="text-xl font-semibold">{pesanan.total_harga}</h1>,
        <p
          className={cn("tx-sm", {
            "text-muted-foreground": pesanan.catatan === "Tidak Dicantumkan",
          })}
        >
          {pesanan.catatan}
        </p>,
        pesanan.tanggal_masuk,
        pesanan.tanggal_estimasi_selesai,
        pesanan.tanggal_selesai,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit ", {
            "bg-blue-600": pesanan.tipe_pesanan === "ambil pesanan",
            "bg-orange-400": pesanan.tipe_pesanan === "antar pesanan",
          })}
        >
          {pesanan.tipe_pesanan}
        </div>,
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
  }, [pesanan_pesanan]);

  const totalPages = useMemo(() => {
    return pesanan_pesanan && pesanan_pesanan.count !== null
      ? Math.ceil(pesanan_pesanan.count / currentLimit)
      : 0;
  }, [pesanan_pesanan]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Pesanan Management</h1>
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
