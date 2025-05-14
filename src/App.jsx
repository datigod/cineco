import React from 'react';
import RegistroArribo from './components/RegistroArribo';
import RegistroCantidad from './components/RegistroCantidad';
import RegistroProducto from './components/RegistroProducto';

export default function App() {
  const [vista, setVista] = React.useState('arribo');

  const botonClase = (activa) =>
    "px-4 py-2 font-semibold rounded-full transition " +
    (activa ? "bg-blue-600 text-white" : "bg-gray-200 text-black");

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Panel de Registro</h1>

      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setVista('arribo')} className={botonClase(vista === 'arribo')}>
          Registro de Arribo
        </button>
        <button onClick={() => setVista('cantidad')} className={botonClase(vista === 'cantidad')}>
          Registro de Cantidad
        </button>
        <button onClick={() => setVista('producto')} className={botonClase(vista === 'producto')}>
          Registro de Producto
        </button>
      </div>

      {vista === 'arribo' && <RegistroArribo />}
      {vista === 'cantidad' && <RegistroCantidad />}
      {vista === 'producto' && <RegistroProducto />}
    </div>
  );
}