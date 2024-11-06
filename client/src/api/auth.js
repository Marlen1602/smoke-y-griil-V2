import  axios from 'axios';
// const API='https://modulo-usuarios-1.onrender.com/api';
const API = 'http://localhost:3000/api'; 

export const registerRequest = (user) => {
    // console.log("Datos enviados:", user);
    return axios.post(`${API}/register`, user);
};

export const loginRequest = (user)=> axios.post(`${API}/login`,user, {withCredentials: 'include'});

export const verifyAuthRequest = (user) => axios.get(`${API}/autenticated`, {withCredentials: 'include'})