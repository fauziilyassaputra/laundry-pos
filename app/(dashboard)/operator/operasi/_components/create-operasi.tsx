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
import { useAuthStore } from "@/store/auth-store";

export default function CreateOperasi({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const profile = useAuthStore((state) => state.profile);
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
    queryKey: ["pesanan_list", profile?.id],
    queryFn: async () => {
      const query =  supabase
        .from("pesanan")
        .select("id_pesanan, status_pesanan")
        .eq("id_user", profile?.id)
        .not("status_pesanan", "in", '("dicuci","dikeringkan","disetrika","selesai","diambil")')

        

        const {data,error} = await query
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id
  });
  const status_pesanan = pesananData?.[0]?.status_pesanan
  

  const { data: mesinData, isLoading: loadMesin } = useQuery({
    queryKey: ["mesin_list", status_pesanan],
    queryFn: async () => {
      let query =  supabase
        .from("mesin")
        .select("id_mesin, tipe_mesin, nama_mesin")
        .eq("status_mesin", "ready");
      if (status_pesanan === "diterima") {
      query = query.eq("tipe_mesin", "washer");
    } 
    else if (status_pesanan === "selesai dicuci") {
      query = query.eq("tipe_mesin", "dryer");
    } 
    else if (status_pesanan === "selesai dikeringkan") {
      query = query.eq("tipe_mesin", "setrika");
    } 
      const {data,error} = await query
      if (error) throw error;
      return data;
    },
    enabled: !!status_pesanan
  });

  const pilihanPesanan = pesananData?.map((pesanan) => ({
    label: `${pesanan.id_pesanan} (${pesanan.status_pesanan})`,
    value: pesanan.id_pesanan,
  }));

  const pilihanMesin = mesinData?.map((mesin) => ({
    label: `${mesin.tipe_mesin} - ${mesin.nama_mesin}`,
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
              selectItem={
                pilihanPesanan && pilihanPesanan?.length > 0 ?
                pilihanPesanan : [
                  { label: "Tidak ada pesanan yang siap dioperasikan", value: null  },
                ]
              }
            />
            <FormSelect
              form={form}
              name="id_mesin"
              label={loadMesin ? "Loading Mesin..." : "Pilih Mesin"}
              selectItem={ pilihanMesin && pilihanMesin.length > 0 ?
                pilihanMesin : [
                  { label: "Tidak ada mesin yang tersedia", value: null },
                ]
              }
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
