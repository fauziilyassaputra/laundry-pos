import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateLayanan } from "../actions";
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
import {
  Layanan,
  layananFormSchema,
  layananSchema,
} from "@/validations/layanan-validation";
import { INITIAL_STATE_LAYANAN } from "@/constants/layanan-constant";

export default function UpdateLayanan({
  open,
  currentData,
  handleChangeAction,
}: {
  open?: boolean;
  currentData?: Layanan;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<layananSchema>({
    resolver: zodResolver(layananFormSchema),
  });

  const [updateLayananState, updateLayananAction, isPendingLayanan] =
    useActionState(updateLayanan, INITIAL_STATE_LAYANAN);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value).trim());
      } else {
        formData.append(key, "");
      }
    });
    if (currentData?.id_layanan) {
      formData.append("id_layanan", currentData.id_layanan);
    }

    startTransition(() => {
      updateLayananAction(formData);
    });
  });
  useEffect(() => {
    if (updateLayananState?.status === "error") {
      toast.error("Create operasi Failed ", {
        description:
          updateLayananState.message || updateLayananState.errors?._form?.[0],
      });
    }

    if (updateLayananState?.status === "success") {
      toast.success("Update Layanan Success");
      form.reset();
    }
    if (handleChangeAction) {
      handleChangeAction(false);
    }
  }, [updateLayananState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("nama_layanan", currentData.nama_layanan || "");
      form.setValue(
        "harga_perkilo",
        currentData.harga_perkilo ? String(currentData.harga_perkilo) : "",
      );
      form.setValue(
        "estimasi_hari",
        currentData.estimasi_hari ? String(currentData.estimasi_hari) : "",
      );
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Layanan</DialogTitle>
          <DialogDescription>Perbarui informasi pembayaran</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
            <FormInput
              form={form}
              name="nama_layanan"
              label="Nama Layanan"
              type="text"
              placeHolder="Masukkan nama layanan "
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                form={form}
                name="harga_perkilo"
                label="Harga Perkilo"
                type="text"
                placeHolder="Cth: 5000"
              />
              <FormInput
                form={form}
                name="estimasi_hari"
                label="Estimasi Hari"
                type="text"
                placeHolder=""
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isPendingLayanan ? (
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
