import  axios from 'axios';
const API='http://localhost:3000/api';
//const API = 'http://localhost:3000/api'; 

export const registerRequest = (user) => {
    // console.log("Datos enviados:", user);
    return axios.post(`${API}/register`, user);
};

export const loginRequest = (user)=> axios.post(`${API}/login`,user, {withCredentials: true});

export const verifyAuthRequest = (user) => axios.get(`${API}/authenticated`, {withCredentials: true})

export const logoutRequest = () => axios.post(`${API}/logout`, {}, { withCredentials: true });

//funciones CRUD para Perfil de la empresa
export const getEmpresaProfile = async () =>
  axios.get(`${API}/empresa`, { withCredentials: true });

export const updateEmpresaProfile = async (id, data) => {
  return axios.put(`${API}/empresa/${id}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};


export const getIncidencias = async () => axios.get(`${API}/incidencias`);
export const createIncidencia = async (data) => axios.post(`${API}/incidencias`, data);
export const updateIncidencia = async (id, data) => axios.put(`${API}/incidencias${id}`, data);
export const deleteIncidencia = async (id) => axios.delete(`${API}/incidencias${id}`);



//lista de usuarios 
export const getUsuarios = async () => axios.get(`${API}/usuarios`, { withCredentials: true });
export const unlock = async (id) => {
  return axios.put(`${API}/unlock/${id}`, {}, { withCredentials: true });
};
export const blockUser = async (id) => {
  return axios.put(`${API}/block/${id}`, {}, { withCredentials: true });
};

// Obtener todas las preguntas frecuentes
export const getPreguntasRequest = () => axios.get(`${API}/preguntas`);

// Crear una nueva pregunta frecuente
export const createPreguntaRequest = (pregunta) =>
  axios.post(`${API}/preguntas`, pregunta);

// Eliminar una pregunta por ID
export const deletePreguntaRequest = (id) =>
  axios.delete(`${API}/preguntas/${id}`);


//CRUD redes sociales
export const getRedesSociales = () => axios.get(`${API}/redes_sociales`);
export const createRedSocial = (data) => axios.post(`${API}/redes_sociales`, data, { withCredentials: true });
export const updateRedSocial = (id, data) => axios.put(`${API}/redes_sociales/${id}`, data, { withCredentials: true });
export const deleteRedSocial = (id) => axios.delete(`${API}/redes_sociales/${id}`, { withCredentials: true });

// 🔹 CRUD de Productos
export const getProductosRequest = () => axios.get(`${API}/productos`);
export const getProductoRequest = (id) => axios.get(`${API}/productos/${id}`);
export const createProductoRequest = (producto) => {
  return axios.post(`${API}/productos`, producto, {
      headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProductoRequest = (id, producto) => {
  console.log(`Actualizando producto ${id} con datos:`, producto)

   // y que los datos son correctos antes de enviar
  const productoJSON = {
    Nombre: producto.Nombre,
    Descripcion: producto.Descripcion,
    ID_Categoria: Number(producto.ID_Categoria),
    TieneTamanos: producto.TieneTamanos === true || producto.TieneTamanos === 1 ? 1 : 0,
    Disponible: producto.Disponible === true || producto.Disponible === 1 ? 1 : 0,
    Precio: producto.TieneTamanos ? null : Number(producto.Precio || 0),
  }

  console.log("Datos JSON a enviar:", productoJSON)

  return axios.put(`${API}/productos/${id}`, productoJSON, {
    headers: { "Content-Type": "application/json" },
  })
}


export const deleteProductoRequest = (id) => axios.delete(`${API}/productos/${id}`);

// 🔹 CRUD de Tamaños
export const getTamanosRequest = () => axios.get(`${API}/tamanos`);
export const getTamanoRequest = (id) => axios.get(`${API}/tamanos/${id}`);
export const createTamanoRequest = (tamano) => axios.post(`${API}/tamanos`, tamano);
export const updateTamanoRequest = (id, tamano) => axios.put(`${API}/tamanos/${id}`, tamano);
export const deleteTamanoRequest = (id) => axios.delete(`${API}/tamanos/${id}`);

// 🔹 Subir imagen a Cloudinary
export const uploadImagenRequest = (id, imagen) => {
  return axios.post(`${API}/productos/${id}/upload`, imagen, {
      headers: { "Content-Type": "multipart/form-data" },
  });
};
//Obtener categoria 

export const getCategorias = () => axios.get(`${API}/categorias`);

//CRUD documentos legales
export const obtenerDocumentos=()=> axios.get(`${API}/documentos_legales`);
export const obtenerDocumentoPorId = (id) => axios.get(`${API}/documentos_legales/${id}`);
export const crearDocumento = (documento) => axios.post(`${API}/documentos_legales`, documento);
export const actualizarDocumento = (id, documento) => axios.put(`${API}/documentos_legales/${id}`, documento);
export const eliminarDocumento = (id) => axios.delete(`${API}/documentos_legales/${id}`);
