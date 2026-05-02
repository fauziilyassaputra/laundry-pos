"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_PELANGGAN } from "@/constants/pelanggan-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export default function PelangganManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const { data: pelanggan_pelanggan, isLoading } = useQuery({
    queryKey: ["pelanggan_pelanggan", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("pelanggan")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");
      if (currentSearch) {
        query.or(
          `status_pesanan.ilike.%${currentSearch}%,nomor_telepon.ilike.%${currentSearch}%,alamat_rumah.ilike.%${currentSearch}%`,
        );
      }
      const result = await query;

      if (result.error)
        toast.error("get pelanggan data failed: ", {
          description: result.error.message,
        });

      return result;
    },
  });
  const filteredData = useMemo(() => {
    return (pelanggan_pelanggan?.data || []).map((pelanggan, index) => {
      if (pelanggan.alamat_rumah === null) {
        pelanggan.alamat_rumah = "Tidak Dicantumkan";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        pelanggan.id_pelanggan,
        pelanggan.nama_pelanggan,
        pelanggan.nomor_telepon,
        <p
          className={cn("tx-sm", {
            "text-muted-foreground":
              pelanggan.alamat_rumah === "Tidak Dicantumkan",
          })}
        >
          {pelanggan.alamat_rumah}
        </p>,
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
  }, [pelanggan_pelanggan]);

  const totalPages = useMemo(() => {
    return pelanggan_pelanggan && pelanggan_pelanggan.count !== null
      ? Math.ceil(pelanggan_pelanggan.count / currentLimit)
      : 0;
  }, [pelanggan_pelanggan]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Pelanggan Management</h1>
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
        header={HEADER_TABLE_PELANGGAN}
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
