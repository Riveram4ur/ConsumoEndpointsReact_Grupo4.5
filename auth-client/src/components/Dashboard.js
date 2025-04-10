import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>Cerrar sesión</button>
    </div>
  );
}
