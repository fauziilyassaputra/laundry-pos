import { Pelanggan } from "@/validations/pelanggan-validation";
import { startTransition, useActionState, useEffect } from "react";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog-delete";
import { Mesin } from "@/validations/mesin-validation";
import { deleteLayanan } from "../actions";
import { Layanan } from "@/validations/layanan-validation";

export default function DeleteLayanan({
  open,
  currentData,
  handleChangeAction,
}: {
  open: boolean;
  currentData?: Layanan;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteLayananState, deleteLayananAction, ispendingDeleteLayanan] =
    useActionState(deleteLayanan, INITIAL_STATE_ACTION);
  const onSubmit = () => {
    const formData = new FormData();
    if (currentData?.id_layanan) {
      formData.append("id_layanan", currentData!.id_layanan as string);
    }
    startTransition(() => {
      deleteLayananAction(formData);
    });
  };

  useEffect(() => {
    if (deleteLayananState?.status === "error") {
      toast.error("Delete Layanan failed", {
        description: deleteLayananState.errors?._form?.[0],
      });
    }
    if (deleteLayananState?.status === "success") {
      toast.success("Delete Layanan Success");
      handleChangeAction?.(false);
    }
  }, [deleteLayananState]);

  return (
    <DialogDelete
      isLoading={ispendingDeleteLayanan}
      open={open}
      onOpenChange={handleChangeAction}
      onSubmit={onSubmit}
      title="Layanan"
    />
  );
}
