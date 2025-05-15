import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroArribos() {
  const [confirmacion, setConfirmacion] = useState(false);

  const enviarArribo = async () => {
    try {
      await addDoc(collection(db, "registro_arribos"), {
        timestamp: new Date().toISOString()
      });
      setConfirmacion(true);
      setTimeout(() => setConfirmacion(false), 2000);
    } catch (error) {
      alert("Error al registrar arribo: " + error.message);
    }
  };

  return (
    <div className="text-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de Arribos</h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={enviarArribo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg shadow"
        >
          Registrar Arribo
        </button>
      </div>

      {confirmacion && (
        <div className="text-center mt-2 text-green-400 font-medium">
          Arribo registrado correctamente ✔️
        </div>
      )}
    </div>
  );
}
