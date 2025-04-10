import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
      <p>¿No tienes una cuenta? <button onClick={() => navigate('/register')}>Regístrate aquí</button></p>

    </div>
    
  );
}
