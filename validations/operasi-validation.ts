import z from "zod";

export const operasiSchemaForm = z.object({
  id: z.string().min(1, "ID mesin tidak ditemukan"),
});
export const operasiSchema = z.object({
  id: z.string(),
});

export type OperasiSchema = z.infer<typeof operasiSchema>;
export type Operasi = z.infer<typeof operasiSchema> & { id: string };
