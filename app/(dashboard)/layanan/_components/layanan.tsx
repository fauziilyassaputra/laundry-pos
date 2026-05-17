"use client";
import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_LAYANAN } from "@/constants/layanan-constant";
import { HEADER_TABLE_MESIN } from "@/constants/mesin-constant";
import useDataTable from "@/hooks/use-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CreateLayanan from "./create-layanan";
import { Layanan } from "@/validations/layanan-validation";
import UpdateLayanan from "./update-layanan";
import DeleteLayanan from "./delete-layanan";

export default function LayananManagement() {
  const profile = useAuthStore((state) => state.profile);
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
    data: layanan_layanan,
    isLoading,
    refetch: refetchLayanan,
  } = useQuery({
    queryKey: ["layanan_layanan", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("layanan")
        .select("*", { count: "exact" })
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1,
        );
      if (currentSearch) {
        query.or(
          `nama_layanan.ilike.%${currentSearch}%,harga_perkilo.ilike.%${currentSearch}%`,
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
      .channel(`change-layanan`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "layanan",
        },
        () => {
          refetchLayanan();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchLayanan, supabase]);

  const [selectedAction, setSelectedAction] = useState<{
    data: Layanan;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeActions = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (layanan_layanan?.data || []).map((layanan, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        layanan.id_layanan,
        layanan.nama_layanan,
        layanan.harga_perkilo,
        layanan.estimasi_hari,
        profile?.jabatan === "manager" && (
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
                  setSelectedAction({
                    data: layanan,
                    type: "update",
                  });
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
                action: () => {
                  setSelectedAction({
                    data: layanan,
                    type: "delete",
                  });
                },
              },
            ]}
          />
        ),
      ];
    });
  }, [layanan_layanan]);

  const totalPages = useMemo(() => {
    return layanan_layanan && layanan_layanan.count !== null
      ? Math.ceil(layanan_layanan.count / currentLimit)
      : 0;
  }, [layanan_layanan]);
  const [openCreateOrder, setOpenCreateOrder] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Layanan Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog open={openCreateOrder} onOpenChange={setOpenCreateOrder}>
            <DialogTrigger asChild>
              {profile?.jabatan === "manager" && (
                <Button variant="outline">Create</Button>
              )}
            </DialogTrigger>
            <CreateLayanan closeDialog={() => setOpenCreateOrder(false)} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_LAYANAN}
        data={filteredData}
        isLoading={isLoading}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        totalPage={totalPages}
        currentLimit={currentLimit}
        onChangeLimit={handleChangeLimit}
      />
      <UpdateLayanan
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeActions}
        open={setSelectedAction !== null && selectedAction?.type == "update"}
      />
      <DeleteLayanan
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeActions}
        open={setSelectedAction !== null && selectedAction?.type == "delete"}
      />
    </div>
  );
}
