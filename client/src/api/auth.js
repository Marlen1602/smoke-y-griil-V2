import  axios from 'axios';
const API='https://modulo-usuarios-1.onrender.com/api';

export const registerRequest = (user) => {
    console.log("Datos enviados:", user);
    return axios.post(`${API}/register`, user);
};

export const loginRequest = (user)=> axios.post(`${API}/login`,user);