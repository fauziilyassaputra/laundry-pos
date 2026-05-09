import { INITIAL_MESIN, INITIAL_MESIN_STATE } from "@/constants/mesin-constant";
import { mesinFormSchema, mesinSchema } from "@/validations/mesin-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createMesin } from "../actions";
import { toast } from "sonner";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";

export default function CreateMesin(
    {closeDialog} : {closeDialog: () => void}
){
    const form = useForm<mesinSchema>({
        resolver: zodResolver(mesinFormSchema),
        defaultValues: INITIAL_MESIN
    })
     const [createMesinState, createMesinAction, isPendingMesin] =
    useActionState(createMesin, INITIAL_MESIN_STATE);

const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createMesinAction(formData);
    });
  });
  useEffect(() => {
    if (createMesinState?.status === "error") {
      toast.error("Create layanan Failed ", {
        description:
          createMesinState.message || createMesinState.errors?._form?.[0],
      });
    }

    if (createMesinState?.status === "success") {
      toast.success("Create layanan Success");
      form.reset();
      closeDialog();
    }
  }, [createMesinState]);

   return (
         <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Buat mesin Baru</DialogTitle>
        <DialogDescription>
          Tambahkan mesin untuk operasi
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
          
            <FormInput
              form={form}
              name="nama_mesin"
              label="Nama Mesin"
              type="text"
              placeHolder="Masukkan nama mesin "
            />
            <FormSelect
              form={form}
              name="tipe_mesin"
              label="Tipe Mesin"
             selectItem={[
                {
                label: "washer",
                value: "washer"
             },
                {
                label: "dryer",
                value: "dryer"
             },
                {
                label: "setrika",
                value: "setrika"
             },
            ]}
            />
       
          </div>

        
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {isPendingMesin ? <Loader2 className="animate-spin" /> : "create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
    )
}