import { z } from "zod";

export const createDeslindeSchema = z.object({
  titulo: z.string().nonempty("El título es obligatorio"),
  contenido: z.string().nonempty("El contenido es obligatorio"),
  fechaVigencia: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Fecha de vigencia inválida",
  }),
});

export const updateDeslindeSchema = z.object({
  contenido: z.string().nonempty("El contenido es obligatorio"),
  fechaVigencia: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Fecha de vigencia inválida",
  }),
});
