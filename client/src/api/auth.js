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