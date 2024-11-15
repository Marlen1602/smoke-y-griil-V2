import  axios from 'axios';
// const API='https://modulo-usuarios-1.onrender.com/api';
const API = 'http://localhost:3000/api'; 

export const registerRequest = (user) => {
    // console.log("Datos enviados:", user);
    return axios.post(`${API}/register`, user);
};

export const loginRequest = (user)=> axios.post(`${API}/login`,user, {withCredentials: 'include'});

export const verifyAuthRequest = (user) => axios.get(`${API}/authenticated`, {withCredentials: 'include'})

export const logoutRequest = () => axios.get(`${API}/logout`, {withCredentials: 'include'})

// Funciones CRUD para políticas
// Obtener todas las políticas
export const getPoliciesRequest = () => {
    return axios.get(`${API}/politicas`, { withCredentials: true });
};

// Crear una nueva política
export const createPolicyRequest = (policy) => {
    return axios.post(`${API}/politicas`, policy, { withCredentials: true });
};

// Actualizar una política existente
export const updatePolicyRequest = (id, policy) => {
    return axios.put(`${API}/politicas/${id}`, policy, { withCredentials: true });
};

// Eliminar una política
export const deletePolicyRequest = (id) => {
    return axios.delete(`${API}/politicas/${id}`, { withCredentials: true });
};

//Funciones crud para terminos y condiciones

export const getTermsRequest = () => {
    return axios.get(`${API}/terminosCondiciones`, { withCredentials: true });
};
export const createTermsRequest = (terms) => {
    return axios.post(`${API}/terminosCondiciones`, terms, { withCredentials: true });
};

// Actualizar términos y condiciones
export const updateTermsRequest = (id, terms) => {
    return axios.put(`${API}/terminosCondiciones/${id}`, terms, { withCredentials: true });
};

// Eliminar términos y condiciones
export const deleteTermsRequest = (id) => {
    return axios.delete(`${API}/terminosCondiciones/${id}`, { withCredentials: true });
};


//Funciones crud para Deslinde legal
export const getDisclaimerRequest = () => {
    return axios.get(`${API}/deslindeLegal`, { withCredentials: true });
};
export const createDeslRequest = (terms) => {
    return axios.post(`${API}/deslindeLegal`, terms, { withCredentials: true });
};

// Actualizar términos y condiciones
export const updateDeslRequest = (id, terms) => {
    return axios.put(`${API}/deslindeLegal/${id}`, terms, { withCredentials: true });
};

// Eliminar términos y condiciones
export const deleteDeslRequest = (id) => {
    return axios.delete(`${API}/deslindeLegal/${id}`, { withCredentials: true });
};