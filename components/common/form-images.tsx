import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileImage } from "lucide-react";
import { getImageData } from "@/lib/utils";
import { Preview } from "@/types/general";
import { Field, FieldError, FieldLabel } from "../ui/field";

export default function FormImage<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, ...rest } }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>

          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 rounded-lg">
              <AvatarImage
                src={preview?.displayUrl}
                alt="preview"
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">
                <FileImage className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              name={rest.name}
              ref={rest.ref}
              onBlur={rest.onBlur}
              disabled={rest.disabled}
              onChange={async (event) => {
                onChange(event);
                const { file, displayUrl } = getImageData(event);
                if (file) {
                  setPreview?.({
                    file,
                    displayUrl,
                  });
                }
              }}
            />
          </div>

          <FieldError className="text-xs" />
        </Field>
      )}
    />
  );
}
