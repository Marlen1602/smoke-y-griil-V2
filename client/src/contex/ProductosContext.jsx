import { createContext, useContext, useState, useEffect } from "react";
import {
    getProductosRequest,
    createProductoRequest,
    updateProductoRequest,
    deleteProductoRequest,
    uploadImagenRequest
  } from "../api/auth.js";  // Asegúrate de que la ruta sea correcta
  

const ProductosContext = createContext();

// Hook personalizado para usar el contexto
export const useProductos = () => {
  return useContext(ProductosContext);
};

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar productos desde la API
  useEffect(() => {
    async function loadProductos() {
      try {
        const res = await getProductosRequest();
        setProductos(res.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    }
    loadProductos();
  }, []);

  // 🔹 Crear un nuevo producto
  const createProducto = async (producto, imagen) => {
    try {
      setLoading(true);

      // Subir imagen a Cloudinary si hay una imagen
      let imageUrl = null;
      if (imagen) {
        const res = await uploadImagenRequest(imagen);
        imageUrl = res.data.url;
      }

      // Guardar el producto con la imagen en la BD
      const res = await createProductoRequest({ ...producto, Imagen: imageUrl });
      setProductos([...productos, res.data]);
    } catch (error) {
      console.error("Error al crear producto:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar un producto
  const deleteProducto = async (id) => {
    try {
      await deleteProductoRequest(id);
      setProductos(productos.filter((prod) => prod.ID_Producto !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // 🔹 Actualizar un producto
  const updateProducto = async (id, producto) => {
    try {
      const res = await updateProductoRequest(id, producto);
      setProductos(productos.map((prod) => (prod.ID_Producto === id ? res.data : prod)));
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  return (
    <ProductosContext.Provider value={{
      productos,
      createProducto,
      deleteProducto,
      updateProducto,
      loading
    }}>
      {children}
    </ProductosContext.Provider>
  );
};
