import * as z from "zod";

export const loginSchemaForm = z.object({
  email: z
    .string()
    .min(5, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(5, "enter minimum 5 character"),
});

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  nama: z.string().min(1, "Name is required"),
  jabatan: z.string().min(1, "Position is required"),
  nomor_telepon: z.string().min(1, "Phone number is required"),
  avatar_url: z.union([
    z.string().min(1, "Image URL is required"),
    z.instanceof(File),
  ]),
});

export type loginSchemaType = z.infer<typeof loginSchemaForm>;
export type CreateUserForm = z.infer<typeof createUserSchema>;
