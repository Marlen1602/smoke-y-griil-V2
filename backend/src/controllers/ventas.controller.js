import VentasSemanales from "../models/ventas.model.js";
import PrediccionCarne from "../models/PrediccionCarne.js";

const generarPredicciones = (venta1, venta2, semanas = 4, ultimaSemana = 2) => {
    const k = Math.log(venta2 / venta1);
    const p0 = venta2; //última venta conocida
  
    const resultados = [];
  
    for (let t = 1; t <= semanas; t++) {
      const semanaPredicha = ultimaSemana + t;
      const predicted_kg = p0 * Math.exp(k * t); // se proyecta desde la última venta
      resultados.push({ week_number: semanaPredicha, predicted_kg, k, p0 });
    }
  
    return resultados;
  };
  
  

  export const guardarVentas = async (req, res) => {
    try {
      const datos = req.body;
      await VentasSemanales.create(datos);
  
      const ultimas = await VentasSemanales.findAll({
        order: [["id", "DESC"]],
        limit: 2
      });
  
      if (ultimas.length < 2) {
        return res.json({
          message: "✅ Venta registrada. Se necesitan al menos 2 semanas para predecir."
        });
      }
  
      const ventaAnterior = ultimas[1].total_meat_kg;
      const ventaReciente = ultimas[0].total_meat_kg;
  
      // Suponiendo que ID es igual a semana
      const ultimaSemana = ultimas[0].id;
  
      // Limpiamos predicciones anteriores
      await PrediccionCarne.destroy({ where: {} });
  
      // Generar nuevas predicciones
      const predicciones = generarPredicciones(ventaAnterior, ventaReciente, 4, ultimaSemana);
  
      await PrediccionCarne.bulkCreate(
        predicciones.map(p => ({
          prediction_date: new Date(),
          week_number: p.week_number,
          predicted_kg: p.predicted_kg,
          k: p.k,
          p0: p.p0
        }))
      );
  
      res.json({
        message: "✅ Venta y predicciones guardadas",
        predicciones: predicciones.map(p => ({
          semana: p.week_number,
          prediccion: p.predicted_kg.toFixed(2)
        }))
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
  

export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await VentasSemanales.findAll({
      attributes: ["start_date","end_date", "hamburguesas", "tacos", "bolillos", "burritos", "gringas", "baguettes"],
      order: [["start_date", "ASC"]]
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerCarnePorSemana = async (req, res) => {
  try {
    const ventas = await VentasSemanales.findAll({ order: [["start_date", "ASC"]] });
    const datos = ventas.map(v => ({
      start_date: v.start_date,
      end_date: v.end_date,
      total_meat_kg: v.total_meat_kg
    }));
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPredicciones = async (req, res) => {
  try {
    const predicciones = await PrediccionCarne.findAll({
      attributes: ["prediction_date", "week_number", "predicted_kg"],
      order: [["week_number", "ASC"]]
    });
    res.json(predicciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
