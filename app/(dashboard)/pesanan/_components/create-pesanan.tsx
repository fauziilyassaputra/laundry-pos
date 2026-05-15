import {
  INITIAL_PESANAN,
  INITIAL_STATE_PESANAN,
} from "@/constants/pesanan-constant";
import {
  pesananFormSchema,
  pesananSchema,
} from "@/validations/pesanan-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createPesanan } from "../actions";
import { toast } from "sonner";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormSelect from "@/components/common/form-select";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export default function DialogCreatePesanan({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const form = useForm<pesananSchema>({
    resolver: zodResolver(pesananFormSchema),
    defaultValues: INITIAL_PESANAN,
  });

  const [createPesananState, createPesananAction, isPendingPesanan] =
    useActionState(createPesanan, INITIAL_STATE_PESANAN);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createPesananAction(formData);
    });
  });
  useEffect(() => {
    if (createPesananState?.status === "error") {
      toast.error("Create pesanan Failed ", {
        description:
          createPesananState.message || createPesananState.errors?._form?.[0],
      });
    }

    if (createPesananState?.status === "success") {
      toast.success("Create pesanan Success");
      form.reset();
      closeDialog();
    }
  }, [createPesananState]);

  const supabase = createClient();

  const { data: pelangganData, isLoading: loadPelanggan } = useQuery({
    queryKey: ["pelanggan_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pelanggan")
        .select("id_pelanggan, nama_pelanggan");

      if (error) throw error;
      return data;
    },
  });

  const { data: layananData, isLoading: loadLayanan } = useQuery({
    queryKey: ["layanan_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("layanan")
        .select("id_layanan, nama_layanan");

      if (error) throw error;
      return data;
    },
  });

   const {data: profileData, isLoading:profileLoading} =useQuery({
    queryKey: ["profile"],
    queryFn: async() => {
      const {data, error} = await supabase.from("profiles").select("id,nama").eq("jabatan", "operator");
      if (error) throw error;
      return data;
    }
  })

  const pilihOperator = profileData?.map((operator) => ({
    label: operator.nama,
    value: operator.id,
  }) )


  const pilihanPelangggan = pelangganData?.map((pelanggan) => ({
    label: pelanggan.nama_pelanggan,
    value: pelanggan.id_pelanggan,
  }));

  const pilihanLayanan = layananData?.map((layanan) => ({
    label: layanan.nama_layanan,
    value: layanan.id_layanan,
  }));

  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Buat Pesanan Baru</DialogTitle>
        <DialogDescription>Tambahkan pesanan dari customer</DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              form={form}
              name="id_pelanggan"
              label={loadPelanggan ? "Loading Pelanggan..." : "Pilih Pelanggan"}
              selectItem={pilihanPelangggan || []}
            />
            <FormSelect
              form={form}
              name="id_layanan"
              label={loadLayanan ? "Loading Layanan..." : "Pilih Layanan"}
              selectItem={pilihanLayanan || []}
            />

            <FormSelect
              form={form}
              name="id_user"
              label={profileLoading ? "Loading Operator..." : "Pilih Operator"}
              selectItem={pilihOperator || []}
            />

            <FormSelect
              form={form}
              name="tipe_pesanan"
              label="Tipe Pesanan"
              selectItem={[
                { label: "Ambil Pesanan", value: "ambil pesanan" },
                { label: "Antar Pesanan", value: "antar pesanan" },
              ]}
            />

           
          </div>

          <FormInput
            form={form}
            name="catatan"
            label="Catatan Tambahan"
            type="textarea"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {isPendingPesanan ? <Loader2 className="animate-spin" /> : "create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
