import { INITIAL_MESIN_STATE } from "@/constants/mesin-constant";
import {
  mesin,
  Mesin,
  mesinForm,
  mesinFormSchema,
  mesinSchema,
} from "@/validations/mesin-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateMesin } from "../actions";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function UpdateMesin({
  open,
  handleChangeAction,
  currentData,
}: {
  open?: boolean;
  handleChangeAction: (open: boolean) => void;
  currentData?: Mesin;
}) {
  const form = useForm<mesin>({
    resolver: zodResolver(mesinForm),
  });
  const [updateMesinState, updateMesinAction, isPendingMesin] = useActionState(
    updateMesin,
    INITIAL_MESIN_STATE,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value).trim());
      } else {
        formData.append(key, "");
      }
    });
    if (currentData?.id_mesin) {
      formData.append("id_mesin", currentData.id_mesin);
    }
    startTransition(() => {
      updateMesinAction(formData);
    });
  });
  useEffect(() => {
    if (updateMesinState?.status === "error") {
      toast.error("update mesin Failed ", {
        description:
          updateMesinState.message || updateMesinState.errors?._form?.[0],
      });
      console.log(updateMesinState.message);
    }

    if (updateMesinState?.status === "success") {
      toast.success("update mesin Success");
      form.reset();
    }
    if (handleChangeAction) {
      handleChangeAction(false);
    }
  }, [updateMesinState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("nama_mesin", currentData?.nama_mesin || "");
      form.setValue("tipe_mesin", currentData?.tipe_mesin || "");
      form.setValue("status_mesin", currentData?.status_mesin || "");
      let formatTanggalSaja = "";
      if (
        currentData?.tanggal_service_terakhir &&
        currentData?.tanggal_service_terakhir !== "-"
      ) {
        formatTanggalSaja = currentData.tanggal_service_terakhir.split("T")[0];
      }
      form.setValue("tanggal_service_terakhir", formatTanggalSaja);
    }
  }, [currentData, form]);
  console.log("ISI ERROR LENGKAP:", updateMesinState);
  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Mesin</DialogTitle>
          <DialogDescription>Perbarui informasi mesin</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <div className="space-y-4 max-h-[20vh] p-1 overflow-y-auto">
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
                  value: "washer",
                },
                {
                  label: "dryer",
                  value: "dryer",
                },
                {
                  label: "setrika",
                  value: "setrika",
                },
              ]}
            />
            <FormSelect
              form={form}
              name="status_mesin"
              label="Status Mesin"
              selectItem={[
                {
                  label: "Ready",
                  value: "ready",
                },
                {
                  label: "In Use",
                  value: "in use",
                },
                {
                  label: "Broken",
                  value: "broken",
                },
              ]}
            />
            <FormInput
              form={form}
              name="tanggal_service_terakhir"
              label="Tanggal Service Terakhir"
              type="date"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isPendingMesin ? <Loader2 className="animate-spin" /> : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
