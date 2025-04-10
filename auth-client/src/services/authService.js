import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // Ajusta el puerto si tu backend usa otro

export const register = (username, password) => {
  return axios.post('http://localhost:3000/api/auth/register', {
    username,
    password,
    first_name: '',
    last_name: '',
    address_id: 3,  // usa los mismos que el backend espera
    store_id: 1
  });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/login`, { username,password });
};
