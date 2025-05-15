import React, { useState } from 'react';
import RegistroItem from './components/RegistroItem';
import RegistroCantidad from './components/RegistroCantidad';
import RegistroProducto from './components/RegistroProducto';
import RegistroArribos from './components/RegistroArribos';

export default function App() {
  const [vista, setVista] = useState('arribo');
  const [registros, setRegistros] = useState([Date.now()]);

  const agregarRegistro = () => setRegistros(prev => [...prev, Date.now()]);
  const eliminarRegistro = (id) => setRegistros(prev => prev.filter(item => item !== id));

  const tabs = [
    { id: 'arribo', label: 'Registro de Arribo' },
    { id: 'cantidad', label: 'Registro de Cantidad' },
    { id: 'producto', label: 'Registro de Producto' },
    { id: 'arribos', label: 'Registro de Arribos' }
  ];

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Panel de Registro</h1>

      <div className="flex justify-center gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setVista(tab.id)}
            className={
              "px-4 py-2 rounded-full font-semibold " +
              (vista === tab.id ? "bg-blue-600 text-white" : "bg-gray-200 text-black")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {vista === 'arribo' && (
        <>
          <h2 className="text-2xl font-bold text-center mb-4">Registro de Arribo</h2>
          {registros.map((id) => (
            <RegistroItem key={id} id={id} onDelete={() => eliminarRegistro(id)} />
          ))}
          <div className="flex justify-center mt-6">
            <button
              onClick={agregarRegistro}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              Agregar Registro
            </button>
          </div>
        </>
      )}

      {vista === 'cantidad' && <RegistroCantidad />}
      {vista === 'producto' && <RegistroProducto />}
      {vista === 'arribos' && <RegistroArribos />}
    </div>
  );
}
