import { Pelanggan } from "@/validations/pelanggan-validation";
import { startTransition, useActionState, useEffect } from "react";
import { deletePelanggan } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import DialogDelete from "@/components/common/dialog-delete";

export default function DeletePelanggan({
  open,
  currentData,
  handleChangeAction,
}: {
  open: boolean;
  currentData?: Pelanggan;
  handleChangeAction: (open: boolean) => void;
}) {
  const [
    deletePelangganState,
    deletePelangganAction,
    IspendingDeletePelanggan,
  ] = useActionState(deletePelanggan, INITIAL_STATE_ACTION);
  const onSubmit = () => {
    const formData = new FormData();
    if (currentData?.id_pelanggan) {
      formData.append("id_pelanggan", currentData!.id_pelanggan as string);
    }
    startTransition(() => {
      deletePelangganAction(formData);
    });
  };

  useEffect(() => {
    if (deletePelangganState?.status === "error") {
      toast.error("Delete pelanggan failed", {
        description: deletePelangganState.errors?._form?.[0],
      });
    }
    if (deletePelangganState?.status === "success") {
      toast.success("Delete Pelanggan Success");
      handleChangeAction?.(false);
    }
  }, [deletePelangganState]);

  return (
    <DialogDelete
      isLoading={IspendingDeletePelanggan}
      open={open}
      onOpenChange={handleChangeAction}
      onSubmit={onSubmit}
      title="Pelanggan"
    />
  );
}
