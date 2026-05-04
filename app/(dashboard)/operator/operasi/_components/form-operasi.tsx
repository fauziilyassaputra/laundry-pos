import { Button } from "@/components/ui/button";

import { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
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
import { STATUS_OPERASI_LIST } from "@/constants/operasi-mesin-constant";

export default function FormOperasi<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}) {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Update Operasi Mesin</DialogTitle>
          <DialogDescription>
            {"pilih 'Selesai' untuk mengakhiri operasi mesin"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="">
            <FormSelect
              form={form}
              label="status"
              name={"status" as Path<T>}
              selectItem={STATUS_OPERASI_LIST}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : "update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
