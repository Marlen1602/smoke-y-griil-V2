import  axios from 'axios';
const API='http://localhost:3000/api';

export const registerRequest = (user) => {
    console.log("Datos enviados:", user);  // Depura lo que estás enviando al backend
    return axios.post(`${API}/register`, user);
};
export const loginRequest = (user)=> {axios.post(`${API}/login`,user);}