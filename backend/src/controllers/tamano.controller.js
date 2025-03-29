import { sequelize } from "../db.js";

// Obtener todos los tamaños
export const getTamanos = async (req, res) => {
  try {
    const [tamanos] = await sequelize.query("SELECT * FROM tamanosproductos ORDER BY ID_Tamaño DESC");
    res.json(tamanos);
  } catch (error) {
    console.error("Error al obtener los tamaños:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener un tamaño por ID
export const getTamanoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [tamano] = await sequelize.query("SELECT * FROM tamanosproductos WHERE ID_Tamaño = ?", {
      replacements: [id],
    });
    if (tamano.length === 0) {
      return res.status(404).json({ message: "Tamaño no encontrado" });
    }
    res.json(tamano[0]);
  } catch (error) {
    console.error("Error al obtener tamaño:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Crear un nuevo tamaño
export const createTamano = async (req, res) => {
  const { ID_Producto, Nombre, Precio } = req.body;
  try {
    const [result] = await sequelize.query(
      "INSERT INTO tamanosproductos (ID_Producto, Nombre, Precio) VALUES (?, ?, ?)",
      { replacements: [ID_Producto, Nombre, Precio] }
    );
    res.json({ message: "Tamaño creado correctamente", ID_Tamaño: result.insertId });
  } catch (error) {
    console.error("Error al crear tamaño:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar un tamaño
export const updateTamano = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Precio } = req.body;
  try {
    await sequelize.query("UPDATE tamanosproductos SET Nombre = ?, Precio = ? WHERE ID_Tamaño = ?", {
      replacements: [Nombre, Precio, id],
    });
    res.json({ message: "Tamaño actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar tamaño:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar un tamaño
export const deleteTamano = async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query("DELETE FROM tamanosproductos WHERE ID_Tamaño = ?", {
      replacements: [id],
    });
    res.json({ message: "Tamaño eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar tamaño:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
