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

// Funciones CRUD para políticas

export const getPoliciesRequest = () => axios.get(`${API}/politicas`, { withCredentials: true });

export const createPolicyRequest = (policy) => axios.post(`${API}/politicas`, policy, { withCredentials: true });

export const updatePolicyRequest = (id, policy) => axios.put(`${API}/politicas/${id}`, policy, { withCredentials: true });

export const deletePolicyRequest = (id) => axios.delete(`${API}/politicas/${id}`, { withCredentials: true });

export const getPolicyHistoryRequest = (id) => axios.get(`${API}/politicas/${id}/history`, { withCredentials: true });


// Funciones CRUD para Términos y Condiciones
export const getTermsRequest = () => axios.get(`${API}/terminosCondiciones`, { withCredentials: true });
export const createTermsRequest = (term) => axios.post(`${API}/terminosCondiciones`, term, { withCredentials: true });
export const updateTermsRequest = (id, term) => axios.put(`${API}/terminosCondiciones/${id}`, term, { withCredentials: true });
export const deleteTermsRequest = (id) => axios.delete(`${API}/terminosCondiciones/${id}`, { withCredentials: true });
export const getTermsHistoryRequest = (id) => axios.get(`${API}/terminosCondiciones/history/${id}`, { withCredentials: true });

// Funciones CRUD para Deslinde legal
export const getDeslindeLegalRequest = () => axios.get(`${API}/deslindeLegal`, { withCredentials: true });
export const createDeslindeLegalRequest = (term) => axios.post(`${API}/deslindeLegal`, term, { withCredentials: true });
export const updateDeslindeLegalRequest = (id, term) => axios.put(`${API}/deslindeLegal/${id}`, term, { withCredentials: true });
export const deleteDeslindeLegalRequest = (id) => axios.delete(`${API}/deslindeLegal/${id}`, { withCredentials: true });
export const getDeslindeLegalHistoryRequest = (id) => axios.get(`${API}/deslindeLegal/history/${id}`, { withCredentials: true });

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
export const getRedesSociales = async () => axios.get(API, { withCredentials: true });
export const createRedSocial = async (data) => axios.post(API, data, { withCredentials: true });
export const updateRedSocial = async (id, data) => axios.put(`${API}/${id}`, data, { withCredentials: true });
export const deleteRedSocial = async (id) => axios.delete(`${API}/${id}`, { withCredentials: true });

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

