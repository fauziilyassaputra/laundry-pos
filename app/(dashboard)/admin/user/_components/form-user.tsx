import FormImage from "@/components/common/form-images";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JABATAN_LIST } from "@/constants/auth-constant";
import { Preview } from "@/types/general";

import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormUser<T extends FieldValues>({
  form,
  onSubmit,
  type,
  isLoading,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <DialogContent className="sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle> {type} User</DialogTitle>
        <DialogDescription>
          {type === "Create" ? "Membuat user baru" : "Ubah data user"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          form={form}
          name={"nama" as Path<T>}
          label="Nama"
          placeHolder="Masukkan nama Lengkap"
        />

        {type === "Create" && (
          <FormInput
            form={form}
            name={"email" as Path<T>}
            label="Email"
            placeHolder="Masukkan email"
            type="email"
          />
        )}
        <FormInput
          form={form}
          name={"nomor_telepon" as Path<T>}
          label="Nomor Telepon"
          placeHolder="Masukkan nomor telepon"
        />

        <FormImage
          form={form}
          name={"avatar_url" as Path<T>}
          label="Avatar"
          preview={preview}
          setPreview={setPreview}
        />
        <FormSelect
          form={form}
          name={"jabatan" as Path<T>}
          label="Jabatan"
          selectItem={JABATAN_LIST}
        />
        {type === "Create" && (
          <FormInput
            form={form}
            name={"password" as Path<T>}
            label="Password"
            placeHolder="******"
            type="password"
          />
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {isLoading ? <Loader2 className="animate-spin" /> : type}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
