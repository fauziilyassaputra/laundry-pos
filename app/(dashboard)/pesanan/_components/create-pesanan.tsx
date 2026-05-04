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
        description: createPesananState.errors?._form?.[0],
      });
    }

    if (createPesananState?.status === "success") {
      toast.success("Create pesanan Success");
      form.reset();
      closeDialog();
    }
  }, [createPesananState]);

  return (
    <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Buat Pesanan Baru</DialogTitle>
        <DialogDescription>Tambahkan pesanan dari customer</DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 ">
        <div className="space-y-4 max-h-[50vh] p-1 overflow-y-auto">
          {/* <FormInput
            form={form}
            name="customer_name"
            label="Customer name"
            placeHolder="Insert customer name here"
          /> */}
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
