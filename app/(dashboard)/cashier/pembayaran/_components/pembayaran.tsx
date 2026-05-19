"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_MESIN } from "@/constants/mesin-constant";
import { HEADER_TABLE_PEMBAYARAN } from "@/constants/pembayaran-constant";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn, formatWaktuWib } from "@/lib/utils";
import { Profile } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import UpdatePembayaran from "./update-pembayaran";
import {
  Pembayaran,
  pembayaranSchema,
} from "@/validations/pembayaran-validation";

export default function PembayaranManagement() {
  const supabase = useMemo(() => createClient(), []);
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const {
    data: pembayaran,
    isLoading,
    refetch: refetchPembayaran,
  } = useQuery({
    queryKey: ["pembayaran", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("pembayaran")
        .select("*", { count: "exact" })
        .order("status_pembayaran", { ascending: true })
        .order("tanggal_bayar", { ascending: false })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1,
        );
      if (currentSearch) {
        query.or(
          `jumlah_bayar.ilike.%${currentSearch}%,status_pembayaran.ilike.%${currentSearch}%,metode_bayar.ilike.%${currentSearch}%`,
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

  useEffect(() => {
    const channel = supabase
      .channel(`change-pembayaran`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pembayaran",
        },
        () => {
          refetchPembayaran();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchPembayaran, supabase]);

  const [selectedAction, setSelectedAction] = useState<{
    data: Pembayaran;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (pembayaran?.data || []).map((bayar, index) => {
      if (bayar.metode_bayar === null || "") {
        bayar.metode_bayar = "-";
      }
      return [
        currentLimit * (currentPage - 1) + index + 1,
        bayar.id_pembayaran,
        bayar.id_pesanan,
        bayar.jumlah_bayar,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-green-600": bayar.status_pembayaran === "lunas",
            "bg-red-600": bayar.status_pembayaran === "bayar",
            "bg-blue-400": bayar.status_pembayaran === "uang muka",
          })}
        >
          {bayar.status_pembayaran}
        </div>,
        <p
          className={cn("tx-sm", {
            "text-muted-foreground": bayar.metode_bayar === "Tidak Dicantumkan",
          })}
        >
          {bayar.metode_bayar}
        </p>,
        formatWaktuWib(bayar.tanggal_bayar),

        <DropdownAction
          menu={[
            {
              label: (
                <span className="flex item-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {
                setSelectedAction({ data: bayar, type: "update" });
              },
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
  }, [pembayaran]);

  const totalPages = useMemo(() => {
    return pembayaran && pembayaran.count !== null
      ? Math.ceil(pembayaran.count / currentLimit)
      : 0;
  }, [pembayaran]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Pembayaran Management</h1>
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
        header={HEADER_TABLE_PEMBAYARAN}
        data={filteredData}
        isLoading={isLoading}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalPage={totalPages}
        currentLimit={currentLimit}
        onChangeLimit={handleChangeLimit}
      />
      <UpdatePembayaran
        open={selectedAction !== null && selectedAction.type === "update"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
