import {
  INITIAL_CUCIAN,
  INITIAL_STATE_CUCIAN,
} from "@/constants/cucian-constant";
import {
  cucianFormSchema,
  cucianSchema,
} from "@/validations/cucian-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createCucian } from "../actions";
import { toast } from "sonner";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormSelect from "@/components/common/form-select";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CreateCucian({
  closeDialog,
id_pesanan}: {
  closeDialog: () => void;
  id_pesanan: string
}) {
  const form = useForm<cucianSchema>({
    resolver: zodResolver(cucianFormSchema),
    defaultValues: INITIAL_CUCIAN,
  });

  const [createCucianState, createCucianAction, isPendingCucian] =
    useActionState(createCucian, INITIAL_STATE_CUCIAN);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createCucianAction(formData);
    });
  });
  useEffect(() => {
    if (createCucianState?.status === "error") {
      toast.error("Create cucian Failed ", {
        description:
          createCucianState.message || createCucianState.errors?._form?.[0],
      });
    }

    if (createCucianState?.status === "success") {
      toast.success("Create cucian Success");
      form.reset();
      closeDialog();
    }
  }, [createCucianState]);

  const supabase = createClient();

  const { data: pesananData, isLoading: loadPesanan } = useQuery({
    queryKey: ["pesanan_list", id_pesanan],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pesanan")
        .select("id_pesanan")
        .eq("id_pesanan", id_pesanan)
        .single();

      if (error) throw error;
      return data;
    },
  });

  
  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Buat cucian Baru</DialogTitle>
        <DialogDescription>
          Tambahkan cucian dari pesanan customer
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              form={form}
              name="id_pesanan"
              label={loadPesanan ? "Loading Pesanan..." : "Pilih Pesanan"}
              selectItem={ [
                {
                  label: id_pesanan || "tidak ada id",
                  value: id_pesanan || "0"
                },
              ] }
            />

            <FormInput
              form={form}
              name="jenis_pakaian"
              label="Jenis Pakaian"
              type="text"
              placeHolder="Masukkan jenis pakaian"
            />
          </div>

          <FormInput
            form={form}
            name="berat_kg"
            label="Berat per-Kilo"
            type="number"
            placeHolder="Masukkan berat pakaian"
          />
          <FormInput
            form={form}
            name="kondisi_cucian"
            label="Kondisi Cucian"
            type="textarea"
            placeHolder="Masukkan kondisi cucian (opsional)"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {isPendingCucian ? <Loader2 className="animate-spin" /> : "create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
