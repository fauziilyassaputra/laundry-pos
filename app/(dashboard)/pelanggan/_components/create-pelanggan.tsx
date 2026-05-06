import {
  INITIAL_PELANGGAN,
  INITIAL_STATE_PELANGGAN,
} from "@/constants/pelanggan-constant";
import {
  pelangganFormSchema,
  pelangganSchema,
} from "@/validations/pelanggan-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createPelanggan } from "../actions";
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

export default function CreatePelanggan({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const form = useForm<pelangganSchema>({
    resolver: zodResolver(pelangganFormSchema),
    defaultValues: INITIAL_PELANGGAN,
  });

  const [createPelangganState, createPelangganAction, isPendingPelanggan] =
    useActionState(createPelanggan, INITIAL_STATE_PELANGGAN);
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createPelangganAction(formData);
    });
  });
  useEffect(() => {
    if (createPelangganState?.status === "error") {
      toast.error("Create pesanan Failed ", {
        description:
          createPelangganState.message ||
          createPelangganState.errors?._form?.[0],
      });
    }

    if (createPelangganState?.status === "success") {
      toast.success("Create pesanan Success");
      form.reset();
      closeDialog();
    }
  }, [createPelangganState]);

  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Buat Pelanggan Baru</DialogTitle>
        <DialogDescription>
          Tambahkan pelanggan baru ke dalam sistem
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
          <FormInput
            form={form}
            name="nama_pelanggan"
            label="Nama Pelanggan"
            placeHolder=" Masukkan nama"
          />
          <FormInput
            form={form}
            name="nomor_telepon"
            label="Nomor Telepon"
            placeHolder=" Masukkan nomor telepon"
          />
          <FormInput
            form={form}
            name="alamat_rumah"
            label="Alamat Rumah"
            placeHolder=" Masukkan alamat rumah (opsional)"
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
              "create"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
