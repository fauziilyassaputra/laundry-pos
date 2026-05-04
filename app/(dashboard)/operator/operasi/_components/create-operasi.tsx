import {
  INITIAL_OPERASI,
  INITIAL_STATE_OPERASI,
} from "@/constants/operasi-mesin-constant";
import {
  operasiFormSchema,
  operasiSchema,
} from "@/validations/operasi-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createOperasi } from "../actions";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/common/form-input";

export default function CreateOperasi({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const form = useForm<operasiSchema>({
    resolver: zodResolver(operasiFormSchema),
    defaultValues: INITIAL_OPERASI,
  });

  const [createOperasiState, createOperasiAction, isPendingOperasi] =
    useActionState(createOperasi, INITIAL_STATE_OPERASI);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createOperasiAction(formData);
    });
  });
  useEffect(() => {
    if (createOperasiState?.status === "error") {
      toast.error("Create operasi Failed ", {
        description:
          createOperasiState.message || createOperasiState.errors?._form?.[0],
      });
    }

    if (createOperasiState?.status === "success") {
      toast.success("Create operasi Success");
      form.reset();
      closeDialog();
    }
  }, [createOperasiState]);

  const supabase = createClient();

  const { data: pesananData, isLoading: loadPesanan } = useQuery({
    queryKey: ["pesanan_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pesanan")
        .select("id_pesanan");

      if (error) throw error;
      return data;
    },
  });

  const { data: mesinData, isLoading: loadMesin } = useQuery({
    queryKey: ["mesin_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mesin")
        .select("id_mesin, nama_mesin")
        .eq("status_mesin", "ready");

      if (error) throw error;
      return data;
    },
  });

  const pilihanPesanan = pesananData?.map((pesanan) => ({
    label: pesanan.id_pesanan,
    value: pesanan.id_pesanan,
  }));

  const pilihanMesin = mesinData?.map((mesin) => ({
    label: mesin.nama_mesin,
    value: mesin.id_mesin,
  }));

  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Buat Operasi Baru</DialogTitle>
        <DialogDescription>
          Tambahkan operasi baru dari pesanan
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              form={form}
              name="id_pesanan"
              label={loadPesanan ? "Loading Pesanan..." : "Pilih Pesanan"}
              selectItem={pilihanPesanan || []}
            />
            <FormSelect
              form={form}
              name="id_mesin"
              label={loadMesin ? "Loading Mesin..." : "Pilih Mesin"}
              selectItem={pilihanMesin || []}
            />

            <FormSelect
              form={form}
              name="status_proses"
              label="Status Proses"
              selectItem={[
                { label: "berjalan", value: "berjalan" },
                { label: "selesai", value: "selesai" },
              ]}
            />
            <FormInput
              form={form}
              name="waktu_mulai"
              label="Waktu Mulai"
              type="datetime-local"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {isPendingOperasi ? <Loader2 className="animate-spin" /> : "create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
