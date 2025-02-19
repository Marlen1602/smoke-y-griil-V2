import Menu from "../models/menu.js";

// Obtener todos los elementos del menú
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los elementos del menú" });
  }
};

// Obtener elementos por categoría
export const getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await Menu.find({ category });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los elementos de la categoría" });
  }
};

// Crear un nuevo elemento del menú
export const createMenuItem = async (req, res) => {
  try {
    const { category, specialty, price, image } = req.body;

    const newMenuItem = new Menu({
      category,
      specialty,
      price,
      image,
    });

    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ error: "Error al crear un nuevo elemento del menú" });
  }
};

// Eliminar un elemento del menú
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.status(200).json({ message: "Elemento del menú eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el elemento del menú" });
  }
};

export const searchMenuItems = async (req, res) => {
  try {
    const { query } = req.query; // Obtiene el parámetro "query" de la URL
    const filter = {
      $or: [
        { category: { $regex: query, $options: "i" } }, // Coincidencia en categoría
        { specialty: { $regex: query, $options: "i" } } // Coincidencia en especialidad
      ]
    };

    console.log("Filtro de búsqueda:", filter); // Depuración

    const results = await Menu.find(filter); // Realiza la búsqueda
    console.log("Resultados encontrados:", results); // Depuración

    res.status(200).json(results); // Devuelve los resultados
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    res.status(500).json({ error: "Error al realizar la búsqueda" });
  }
};


