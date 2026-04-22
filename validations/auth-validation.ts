import * as z from "zod";

export const loginSchemaForm = z.object({
  email: z
    .string()
    .min(5, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(5, "enter minimum 5 character"),
});

export type loginSchemaType = z.infer<typeof loginSchemaForm>;
