import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(username, password);
      alert('Registrado exitosamente');
      navigate('/login');
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response) {
        const data = error.response.data;

        if (data.errors && Array.isArray(data.errors)) {
          alert('Error al registrar: ' + data.errors.map(e => e.msg).join(' - '));
        } else if (data.message) {
          alert('Error al registrar: ' + data.message);
        } else if (data.error) {
          alert('Error al registrar: ' + data.error);
        } else {
          alert('Error al registrar: respuesta inesperada');
        }
      } else {
        alert('Error al registrar: no se pudo conectar al servidor');
      }
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <input
        placeholder="Usuario"
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrarse</button>

      <p>¿Ya tienes una cuenta? <button onClick={() => navigate('/login')}>Inicia sesión</button></p>
    </div>
  );
}
