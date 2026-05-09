import { INITIAL_LAYANAN, INITIAL_STATE_LAYANAN } from "@/constants/layanan-constant";
import { layananFormSchema, layananSchema } from "@/validations/layanan-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createLayanan } from "../actions";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CreateLayanan(
    {closeDialog} : {closeDialog: () => void}
){
    const form = useForm<layananSchema>({
        resolver: zodResolver(layananFormSchema),
        defaultValues: INITIAL_LAYANAN
    })
     const [createLayananState, createLayananAction, isPendingLayanan] =
    useActionState(createLayanan, INITIAL_STATE_LAYANAN);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createLayananAction(formData);
    });
  });
  useEffect(() => {
    if (createLayananState?.status === "error") {
      toast.error("Create layanan Failed ", {
        description:
          createLayananState.message || createLayananState.errors?._form?.[0],
      });
    }

    if (createLayananState?.status === "success") {
      toast.success("Create layanan Success");
      form.reset();
      closeDialog();
    }
  }, [createLayananState]);
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
          
            <FormInput
              form={form}
              name="nama_layanan"
              label="Nama Layanan"
              type="text"
              placeHolder="Masukkan nama layanan "
            />
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
              placeHolder="Cth: 1"
            />
          </div>

        
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {isPendingLayanan ? <Loader2 className="animate-spin" /> : "create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
    )
}