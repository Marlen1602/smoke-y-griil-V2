import prisma from "../db.js";

const generarPredicciones = (venta1, venta2, semanas = 4, ultimaSemana = 2) => {
  const k = Math.log(venta2 / venta1);
  const p0 = venta2;
  const resultados = [];

  for (let t = 1; t <= semanas; t++) {
    const semanaPredicha = ultimaSemana + t;
    const predicted_kg = p0 * Math.exp(k * t);
    resultados.push({ week_number: semanaPredicha, predicted_kg, k, p0 });
  }

  return resultados;
};

export const guardarVentas = async (req, res) => {
  try {
    const datos = req.body;
    await prisma.ventas_semanales.create({ data: datos });

    const ultimas = await prisma.ventas_semanales.findMany({
      orderBy: { id: "desc" },
      take: 2,
    });

    if (ultimas.length < 2) {
      return res.json({
        message: "✅ Venta registrada. Se necesitan al menos 2 semanas para predecir.",
      });
    }

    const ventaAnterior = ultimas[1].total_meat_kg;
    const ventaReciente = ultimas[0].total_meat_kg;
    const ultimaSemana = ultimas[0].id;

    await prisma.prediccion_carne.deleteMany({});

    const predicciones = generarPredicciones(ventaAnterior, ventaReciente, 4, ultimaSemana);

    await prisma.prediccion_carne.createMany({
      data: predicciones.map((p) => ({
        prediction_date: new Date(),
        week_number: p.week_number,
        predicted_kg: p.predicted_kg,
        k: p.k,
        p0: p.p0,
      })),
    });

    res.json({
      message: "✅ Venta y predicciones guardadas",
      predicciones: predicciones.map((p) => ({
        semana: p.week_number,
        prediccion: p.predicted_kg.toFixed(2),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await prisma.ventas_semanales.findMany({
      select: {
        start_date: true,
        end_date: true,
        hamburguesas: true,
        tacos: true,
        bolillos: true,
        burritos: true,
        gringas: true,
        baguettes: true,
      },
      orderBy: { start_date: "asc" },
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerCarnePorSemana = async (req, res) => {
  try {
    const datos = await prisma.ventas_semanales.findMany({
      select: {
        start_date: true,
        end_date: true,
        total_meat_kg: true,
      },
      orderBy: { start_date: "asc" },
    });
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPredicciones = async (req, res) => {
  try {
    const predicciones = await prisma.prediccion_carne.findMany({
      select: {
        prediction_date: true,
        week_number: true,
        predicted_kg: true,
      },
      orderBy: { week_number: "asc" },
    });
    res.json(predicciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
