import React, { useState } from 'react';
import RegistroItem from './RegistroItem';

export default function RegistroArribo() {
  const [registros, setRegistros] = useState([Date.now()]);

  const agregarRegistro = () => setRegistros(prev => [...prev, Date.now()]);
  const eliminarRegistro = (id) => setRegistros(prev => prev.filter(r => r !== id));

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro de Arribo</h2>
      {registros.map(id => (
        <RegistroItem key={id} id={id} onDelete={() => eliminarRegistro(id)} />
      ))}
      <div className="flex justify-center mt-4">
        <button onClick={agregarRegistro} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow">
          Agregar Registro
        </button>
      </div>
    </div>
  );
}