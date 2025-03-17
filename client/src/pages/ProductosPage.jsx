import React, { useState } from "react";
import { useProductos } from "../contex/ProductosContext";

const ProductosPage = () => {
  const { productos, createProducto, deleteProducto, updateProducto, loading } = useProductos();
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: "",
    ID_Categoria: "",
    TieneTamanos: false,
    Disponible: true,
  });
  const [imagen, setImagen] = useState(null);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  // 🔹 Manejar cambio en la imagen
  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  // 🔹 Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProducto(nuevoProducto, imagen);
    setNuevoProducto({
      Nombre: "",
      Descripcion: "",
      Precio: "",
      ID_Categoria: "",
      TieneTamanos: false,
      Disponible: true,
    });
    setImagen(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Gestión de Productos</h1>

      {/* Formulario para agregar producto */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <input type="text" name="Nombre" value={nuevoProducto.Nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 w-full mb-2" required />
        <textarea name="Descripcion" value={nuevoProducto.Descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 w-full mb-2" required></textarea>
        <input type="number" name="Precio" value={nuevoProducto.Precio} onChange={handleChange} placeholder="Precio" className="border p-2 w-full mb-2" />
        <input type="number" name="ID_Categoria" value={nuevoProducto.ID_Categoria} onChange={handleChange} placeholder="ID de Categoría" className="border p-2 w-full mb-2" required />
        <label className="flex items-center">
          <input type="checkbox" name="TieneTamanos" checked={nuevoProducto.TieneTamanos} onChange={(e) => setNuevoProducto({ ...nuevoProducto, TieneTamanos: e.target.checked })} className="mr-2" />
          Tiene Tamaños
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="Disponible" checked={nuevoProducto.Disponible} onChange={(e) => setNuevoProducto({ ...nuevoProducto, Disponible: e.target.checked })} className="mr-2" />
          Disponible
        </label>
        <input type="file" onChange={handleImageChange} className="border p-2 w-full mb-2" />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {loading ? "Cargando..." : "Agregar Producto"}
        </button>
      </form>

      {/* Lista de productos */}
      <ul className="mt-6">
        {productos.map((producto) => (
          <li key={producto.ID_Producto} className="border p-4 mb-2 flex justify-between">
            <span>{producto.Nombre}</span>
            <button onClick={() => deleteProducto(producto.ID_Producto)} className="text-red-500">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductosPage;
