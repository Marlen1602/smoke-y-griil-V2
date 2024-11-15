import { z } from "zod";

export const createTerminosSchema = z.object({
  titulo: z.string().nonempty("El título es obligatorio"),
  contenido: z.string().nonempty("El contenido es obligatorio"),
  fechaVigencia: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Fecha de vigencia inválida",
  }),
});

export const updateTerminosSchema = z.object({
  contenido: z.string().nonempty("El contenido es obligatorio"),
  fechaVigencia: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Fecha de vigencia inválida",
  }),
});
