import  axios from 'axios';
const API=import.meta.env.VITE_API_URL;

export const registerRequest = (user) => {
    // console.log("Datos enviados:", user);
    return axios.post(`${API}/register`, user);
};

export const loginRequest = (user)=> axios.post(`${API}/login`,user, {withCredentials: true});

export const verifyAuthRequest = () => axios.get(`${API}/profile`, { withCredentials: true });

export const logoutRequest = () => axios.post(`${API}/logout`, {}, { withCredentials: true });

// Función para hacer la solicitud POST para agregar un nuevo usuario
export const addUserRequest = (user) => {
  return axios.post(`${API}/add-user`, user, { withCredentials: true });
};
//Funcion para actualizar el tipo de usuario
export const updateUserTypeRequest = (id, tipoUsuarioId) => {
  return axios.put(`${API}/update-user-type`, { id, tipoUsuarioId }, { withCredentials: true });
};


//funciones CRUD para Perfil de la empresa
export const getEmpresaProfile = async () =>
  axios.get(`${API}/empresa`);

export const updateEmpresaProfile = async (id, data) => {
  return axios.put(`${API}/empresa/${id}`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};


export const getIncidencias = async () => axios.get(`${API}/incidencias`,{ withCredentials: true });



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
export const createPreguntaRequest = (pregunta) =>
  axios.post(`${API}/preguntas`, pregunta);
export const deletePreguntaRequest = (id) =>
  axios.delete(`${API}/preguntas/${id}`);


//CRUD redes sociales
export const getRedesSociales = () => axios.get(`${API}/redes_sociales`,{ withCredentials: true });
export const createRedSocial = (data) => axios.post(`${API}/redes_sociales`, data, { withCredentials: true });
export const updateRedSocial = (id, data) => axios.put(`${API}/redes_sociales/${id}`, data, { withCredentials: true });
export const deleteRedSocial = (id) => axios.delete(`${API}/redes_sociales/${id}`, { withCredentials: true });

// 🔹 CRUD de Productos
export const getProductosRequest = () => axios.get(`${API}/productos`);
export const getProductoRequest = (id) => axios.get(`${API}/productos/${id}`,{ withCredentials: true });
export const createProductoRequest = (producto) => {
  return axios.post(`${API}/productos`, producto, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
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
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  })
}


export const deleteProductoRequest = (id) => axios.delete(`${API}/productos/${id}`, {withCredentials: true});

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
      withCredentials: true,
  });
};
//Obtener categoria 

export const getCategorias = () => axios.get(`${API}/categorias`);

// CRUD Obtener todos los documentos
export const obtenerDocumentos = () => axios.get(`${API}/documentos_legales`);
export const obtenerDocumentoPorId = (id) => axios.get(`${API}/documentos_legales/${id}`, { withCredentials: true });
export const crearDocumento = (documento) => axios.post(`${API}/documentos_legales`, documento, { withCredentials: true });
export const actualizarDocumento = (id, documento) => axios.put(`${API}/documentos_legales/${id}`, documento, { withCredentials: true });
export const eliminarDocumento = (id) => axios.delete(`${API}/documentos_legales/${id}`, { withCredentials: true });

// 📌 Enviar código de recuperación al correo
export const sendEmailResetPassword = async (email) => {
  return axios.post(`${API}/send-code-for-reset`, { email });
};

// 📌 Verificar código ingresado
export const verifyCodeForPassword = async (email, code) => {
  return axios.post(`${API}/verify-code-password`, { email, code });
};

// 📌 Actualizar la contraseña después de la verificación
export const updatePassword = async (email, newPassword) => {
  return axios.put(`${API}/update-password`, { email, password: newPassword });
};


//Rutas para la prediccion
// 📌 Registrar ventas y generar predicción
export const registrarVentas = async (datos) => {
  return axios.post(`${API}/ventas`, datos);
};

// 📌 Obtener platillos vendidos por semana
export const obtenerVentas = async () => {
  return axios.get(`${API}/ventas`);
};

// 📌 Obtener carne usada por semana
export const obtenerCarneUsada = async () => {
  return axios.get(`${API}/carne-por-semana`);
};

// 📌 Obtener predicciones generadas
export const obtenerPredicciones = async () => {
  return axios.get(`${API}/predicciones`);
};

//RUTAS PARA EL PERFIL DE USUARIO
// Agregar pregunta secreta
export const agregarPreguntaSecreta = (preguntaSecretaId, respuestaSecreta) => axios.put(`${API}/pregunta-secreta`,{ preguntaSecretaId,respuestaSecreta},{ withCredentials: true }
);

// Obtener todas las preguntas secretas
export const obtenerPreguntasSecretas = () => axios.get(`${API}/preguntas-secretas`, { withCredentials: true });

  // Buscar la pregunta secreta asociada a un correo
export const getPreguntaSecretaPorCorreo = (email) =>
  axios.post(`${API}/pregunta-secreta/buscar`, { email });

//  Verificar la respuesta secreta del usuario
export const verificarRespuestaSecreta = ({ email, respuesta }) =>
  axios.post(`${API}/pregunta-secreta/verificar`, { email, respuesta });

//  Verificar el token enviado por correo (tras responder la pregunta)
export const verificarTokenSecreto = ({ email, token }) =>
  axios.post(`${API}/pregunta-secreta/verificar-token`, { email, token });

//  Restablecer la contraseña
export const restablecerPasswordConPregunta = ({ email, token, nuevaPassword }) =>
  axios.put(`${API}/pregunta-secreta/restablecer-password`, {
    email,
    token,
    nuevaPassword,
  });
//Modificar numero de telefono
  export const updateTelefono = async (telefono) => {
  try {
    const response = await axios.put(
      `${API}/usuario-telefono`,
      { telefono }, 
      { withCredentials: true },
    )
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Error al actualizar el teléfono" }
  }
}
//Funcion para cambiar la contraseña
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API}/change-password`,
      { currentPassword, newPassword },
      { withCredentials: true },
    )
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Error al cambiar la contraseña" }
  }
}

//FUNCIONES PARA REPORTES 
// Función para obtener platillos más vendidos
export const obtenerPlatillosMasVendidos = async () => {
  try {
    const response = await axios.get(`${API}/reportes/platillos-mas-vendidos`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener platillos más vendidos" }
  }
}

// Función para obtener zonas con más envíos
export const obtenerZonasConMasEnvios = async () => {
  try {
    const response = await axios.get(`${API}/reportes/zonas-mas-envios`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener zonas con más envíos" }
  }
}

// Función para obtener ingresos por día
export const obtenerIngresosPorDia = async () => {
  try {
    const response = await axios.get(`${API}/reportes/ingresos-por-dia`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener ingresos por día" }
  }
}

// Función para obtener clientes frecuentes
export const obtenerClientesFrecuentes = async () => {
  try {
    const response = await axios.get(`${API}/reportes/clientes-frecuentes`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Error al obtener clientes frecuentes" }
  }
}

export const obtenerRecomendaciones = async (producto) => {
  try {
    const res = await axios.post(
      `${API}/recomendaciones`,
      { producto },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener recomendaciones:", error);
    return [];
  }
};