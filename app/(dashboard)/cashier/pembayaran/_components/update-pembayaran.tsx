import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updatePembayaran } from "../actions";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
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
import {
  Pembayaran,
  pembayaranFormSchema,
  pembayaranSchema,
} from "@/validations/pembayaran-validation";
import {
  INITIAL_PEMBAYARAN,
  INITIAL_STATE_PEMBAYARAN,
} from "@/constants/pembayaran-constant";

export default function UpdatePembayaran({
  open,
  currentData,
  handleChangeAction,
}: {
  open?: boolean;
  currentData?: Pembayaran;
  handleChangeAction?: (open: boolean) => void;
}) {

 
  const form = useForm<pembayaranSchema>({
    resolver: zodResolver(pembayaranFormSchema),
  });

  const [updatePembayaranState, updatePembayaranAction, isPendingOperasi] =
    useActionState(updatePembayaran, INITIAL_STATE_PEMBAYARAN);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("id_pembayaran", currentData?.id_pembayaran ?? "");
    startTransition(() => {
      updatePembayaranAction(formData);
    });
  });
  useEffect(() => {
    if (updatePembayaranState?.status === "error") {
      toast.error("Create operasi Failed ", {
        description:
          updatePembayaranState.message ||
          updatePembayaranState.errors?._form?.[0],
      });
    }

    if (updatePembayaranState?.status === "success") {
      toast.success("Create operasi Success");
      form.reset();
    }
    if (handleChangeAction) {
        handleChangeAction(false); 
      }
  }, [updatePembayaranState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("id_pesanan", currentData.id_pesanan.toString());
      form.setValue("tanggal_bayar", currentData.tanggal_bayar);
      form.setValue("jumlah_bayar", currentData.jumlah_bayar.toString());
      form.setValue("metode_bayar", currentData.metode_bayar);
      form.setValue("status_pembayaran", currentData.status_pembayaran);
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Pembayaran</DialogTitle>
          <DialogDescription>Perbarui informasi pembayaran</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                form={form}
                name="id_pesanan"
                label="ID Pesanan"
                selectItem={[
                  {
                    disabled: true,
                    label:
                      currentData?.id_pesanan?.toString() ||
                      "Tidak ada pesanan",
                    value: currentData?.id_pesanan?.toString() || "0",
                  },
                ]}
              />

              <FormInput
                form={form}
                name="tanggal_bayar"
                label="Tanggal bayar"
                type="datetime-local"
              />
              <FormInput
                form={form}
                name="jumlah_bayar"
                label="Jumlah bayar"
                placeHolder="Default: 0"
              />
              <FormSelect
                form={form}
                name="metode_bayar"
                label="Metode pembayaran"
                selectItem={[
                  { label: "Cash", value: "cash" },
                  { label: "Transfer", value: "transfer" },
                  { label: "Credit Card", value: "credit card" },
                ]}
              />
              <FormSelect
                form={form}
                name="status_pembayaran"
                label="Status pembayaran"
                selectItem={[
                  { label: "Lunas", value: "lunas" },
                  { label: "Bayar", value: "bayar" },
                  { label: "Uang Muka", value: "uang muka" },
                ]}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isPendingOperasi ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
