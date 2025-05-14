import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroCantidad() {
  const [cantidades, setCantidades] = useState({
    'Combo Crispetas': 0,
    'Combo Perro': 0,
    'Combo Nachos': 0
  });
  const [enviado, setEnviado] = useState(false);

  const actualizar = (producto, valor) => {
    setCantidades(prev => ({ ...prev, [producto]: parseInt(valor) || 0 }));
  };

  const total = Object.values(cantidades).reduce((a, b) => a + b, 0);

  const enviar = async () => {
    if (total === 0) {
      alert("Debes registrar al menos 1 producto para enviar.");
      return;
    }

    try {
      await addDoc(collection(db, "registro_cantidad"), {
        cantidades,
        timestamp: new Date().toISOString()
      });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 2000);
      setCantidades({ 'Combo Crispetas': 0, 'Combo Perro': 0, 'Combo Nachos': 0 });
    } catch (e) {
      alert("Error al enviar: " + e.message);
    }
  };

  return (
    <div className="text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de Cantidad</h2>
      <div className="flex justify-center gap-6 mb-6 flex-wrap">
        {Object.keys(cantidades).map((producto) => (
          <div key={producto} className="bg-white text-black p-4 rounded shadow flex flex-col items-center">
            <div className="font-semibold mb-2">{producto}</div>
            <input
              type="number"
              min="0"
              value={cantidades[producto]}
              onChange={(e) => actualizar(producto, e.target.value)}
              className="w-20 px-2 py-1 border rounded text-center"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={enviar}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
        >
          Enviar Cantidades
        </button>
      </div>

      {enviado && (
        <div className="text-center mt-4 text-green-400 font-medium">
          Cantidades enviadas correctamente ✔️
        </div>
      )}
    </div>
  );
}
