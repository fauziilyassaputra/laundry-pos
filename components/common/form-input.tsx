import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeHolder,
  type = "text",
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeHolder?: string;
  type?: string;
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { value,...rest }, fieldState }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>
          {type === "textarea" ? (
            <Textarea {...rest} placeholder={placeHolder} autoComplete="off" value={value || " "}
 /> 
          ) : (
            <Input
              {...rest}
              type={type}
              placeholder={placeHolder}
              autoComplete="off"
              value={value || " "}
            />
          )}

          <FieldError errors={[fieldState.error]} className="text-sm" />
        </Field>
      )}
    />
  );
}
