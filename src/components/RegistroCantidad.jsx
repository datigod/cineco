import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroCantidad() {
  const [cantidades, setCantidades] = useState({
    "Combo Crispetas": 0,
    "Combo Perro": 0,
    "Combo Nachos": 0
  });
  const [enviado, setEnviado] = useState(false);

  const actualizarCantidad = (producto, cantidad) => {
    setCantidades(prev => ({ ...prev, [producto]: parseInt(cantidad) || 0 }));
  };

  const enviar = async () => {
    try {
      await addDoc(collection(db, "registro_cantidad"), {
        cantidades,
        timestamp: new Date().toISOString()
      });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 2000);
      setCantidades({ "Combo Crispetas": 0, "Combo Perro": 0, "Combo Nachos": 0 });
    } catch (error) {
      alert("Error al guardar cantidades: " + error.message);
    }
  };

  return (
    <div className="text-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro de Cantidad</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Object.keys(cantidades).map(producto => (
          <div key={producto} className="flex flex-col items-center gap-1">
            <label className="text-sm font-semibold">{producto}</label>
            <input
              type="number"
              min="0"
              value={cantidades[producto]}
              onChange={(e) => actualizarCantidad(producto, e.target.value)}
              className="w-20 text-center px-2 py-1 border rounded text-black"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={enviar} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow">
          Enviar Cantidades
        </button>
      </div>
      {enviado && (
        <div className="text-center mt-4 text-green-400 font-medium">
          Cantidades registradas correctamente ✔️
        </div>
      )}
    </div>
  );
}