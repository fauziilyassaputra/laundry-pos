import {
  Pelanggan,
  pelangganFormSchema,
  pelangganSchema,
} from "@/validations/pelanggan-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updatePelanggan } from "../actions";
import { INITIAL_STATE_PELANGGAN } from "@/constants/pelanggan-constant";
import { keyof } from "zod";
import { toast } from "sonner";
import FormInput from "@/components/common/form-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormSelect from "@/components/common/form-select";

export default function UpdatePelanggan({
  currentData,
  open,
  handleChangeAction,
}: {
  currentData?: Pelanggan;
  open?: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const form = useForm<pelangganSchema>({
    resolver: zodResolver(pelangganFormSchema),
  });
  const [updatePelangganState, updatePelangganAction, isPendingPelanggan] =
    useActionState(updatePelanggan, INITIAL_STATE_PELANGGAN);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value).trim());
      } else {
        formData.append(key, "");
      }
    });
    if (currentData?.id_pelanggan) {
      formData.append("id_pelanggan", currentData.id_pelanggan);
    }
    startTransition(() => {
      updatePelangganAction(formData);
    });
  });
  useEffect(() => {
    if (updatePelangganState?.status === "error") {
      toast.error("Update Pelanggan Failed ", {
        description:
          updatePelangganState.message ||
          updatePelangganState.errors?._form?.[0],
      });
    }

    if (updatePelangganState?.status === "success") {
      toast.success("Update Pelanggan Success");
      form.reset();
    }
    if (handleChangeAction) {
      handleChangeAction(false);
    }
  }, [updatePelangganState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("nama_pelanggan", currentData?.nama_pelanggan);
      form.setValue("nomor_telepon", currentData?.nomor_telepon);
      form.setValue("alamat_rumah", currentData?.alamat_rumah || "");
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Pelanggan</DialogTitle>
          <DialogDescription>Perbarui informasi pelanggan</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                form={form}
                name="nama_pelanggan"
                label="Nama Pelanggan"
              />
              <FormInput
                form={form}
                name="nomor_telepon"
                label="nomor telepon"
              />
            </div>
            <FormInput
              form={form}
              name="alamat_rumah"
              label="alamat rumah"
              type="textarea"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isPendingPelanggan ? (
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
