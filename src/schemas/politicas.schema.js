import { z } from "zod";

export const createPoliticaschema = z.object({
  title: z.string().min(1, "Titulo requerido"),
  descripcion: z.string().min(1, "Descripción requerida"),
  date: z.string().datetime().optional(),
});
