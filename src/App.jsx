
import { useState } from 'react';
import RegistroItem from './components/RegistroItem';

export default function App() {
  const [registros, setRegistros] = useState([0]);

  const agregarRegistro = () => setRegistros(prev => [...prev, Date.now()]);
  const eliminarRegistro = (id) => setRegistros(prev => prev.filter(item => item !== id));

  return (
    <div className="bg-black min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Arribo</h1>
      {registros.map((id) => (
        <RegistroItem key={id} id={id} onDelete={() => eliminarRegistro(id)} />
      ))}
      <button onClick={agregarRegistro} className="bg-green-500 mt-4 px-4 py-2">Agregar Registro</button>
    </div>
  );
}
