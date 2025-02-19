import  axios from 'axios';
const API='https://backend-gamma-nine-68.vercel.app/api';
//const API = 'http://localhost:3000/api'; 

export const registerRequest = (user) => {
    // console.log("Datos enviados:", user);
    return axios.post(`${API}/register`, user);
};

export const loginRequest = (user)=> axios.post(`${API}/login`,user, {withCredentials: true});

export const verifyAuthRequest = (user) => axios.get(`${API}/authenticated`, {withCredentials: true})

export const logoutRequest = () => axios.get(`${API}/logout`, {withCredentials: true})

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
// Obtener perfil
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
export const getUsuarios = async () => axios.get(`${API}/usuarios`);
export const unlock = async (id) => {
  return axios.put(`${API}/unlock/${id}`, {}, { withCredentials: true });
};

export const blockUser = async (id) => {
  return axios.put(`${API}/block/${id}`, {}, { withCredentials: true });
};

