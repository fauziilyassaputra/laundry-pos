import { Pelanggan } from "@/validations/pelanggan-validation";
import { startTransition, useActionState, useEffect } from "react";
import { deleteMesin } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog-delete";
import { Mesin } from "@/validations/mesin-validation";

export default function DeleteMesin({
  open,
  currentData,
  handleChangeAction,
}: {
  open: boolean;
  currentData?: Mesin;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteMesinState, deleteMesinAction, ispendingDeleteMesin] =
    useActionState(deleteMesin, INITIAL_STATE_ACTION);
  const onSubmit = () => {
    const formData = new FormData();
    if (currentData?.id_mesin) {
      formData.append("id_mesin", currentData!.id_mesin as string);
    }
    startTransition(() => {
      deleteMesinAction(formData);
    });
  };

  useEffect(() => {
    if (deleteMesinState?.status === "error") {
      toast.error("Delete Mesin failed", {
        description: deleteMesinState.errors?._form?.[0],
      });
    }
    if (deleteMesinState?.status === "success") {
      toast.success("Delete Mesin Success");
      handleChangeAction?.(false);
    }
  }, [deleteMesinState]);

  return (
    <DialogDelete
      isLoading={ispendingDeleteMesin}
      open={open}
      onOpenChange={handleChangeAction}
      onSubmit={onSubmit}
      title="Mesin"
    />
  );
}
