import { z } from "zod";

export const createPoliticaschema = z.object({
  title: z.string({
    required_error: "Titulo requerido",
  }),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
});