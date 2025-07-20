import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo JSON (ahora es un arreglo directamente)
const reglas = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/reglas_asociacion.json"), "utf-8")
);

if (!Array.isArray(reglas)) {
  throw new Error("❌ El archivo de reglas no es un arreglo JSON válido.");
}

export const getRecomendacionesPorProducto = async (nombreProducto, topN = 5) => {
  const recomendaciones = new Set();

  const reglasFiltradas = reglas
    .filter((r) => r.antecedents.includes(nombreProducto))
    .sort((a, b) => b.lift - a.lift || b.confidence - a.confidence);

  for (const regla of reglasFiltradas) {
    for (const conseq of regla.consequents) {
      if (conseq !== nombreProducto && !recomendaciones.has(conseq)) {
        recomendaciones.add(conseq);
        if (recomendaciones.size >= topN) break;
      }
    }
    if (recomendaciones.size >= topN) break;
  }

  if (recomendaciones.size === 0) {
    const producto = await prisma.productos.findFirst({
      where: { Nombre: nombreProducto },
    });

    if (producto) {
      return await prisma.productos.findMany({
        where: {
          ID_Categoria: producto.ID_Categoria,
          Nombre: { not: nombreProducto },
        },
        take: topN,
      });
    }

    return [];
  }

  return await prisma.productos.findMany({
    where: {
      Nombre: { in: Array.from(recomendaciones) },
    },
  });
};
