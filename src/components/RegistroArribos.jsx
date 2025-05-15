import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroArribos() {
  const [confirmacion, setConfirmacion] = useState(false);
  const [ultimoId, setUltimoId] = useState(null);

  const obtenerUltimo = async () => {
    const q = query(collection(db, "registro_arribos"), orderBy("timestamp", "desc"), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const ultimo = snap.docs[0];
      setUltimoId(ultimo.id);
    }
  };

  useEffect(() => {
    obtenerUltimo();
  }, []);

  const enviarArribo = async () => {
    try {
      const docRef = await addDoc(collection(db, "registro_arribos"), {
        timestamp: new Date().toISOString()
      });
      setConfirmacion(true);
      setUltimoId(docRef.id);
      setTimeout(() => setConfirmacion(false), 2000);
    } catch (error) {
      alert("Error al registrar arribo: " + error.message);
    }
  };

  const eliminarUltimo = async () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar el último arribo?");
    if (!confirmar || !ultimoId) return;

    try {
      await deleteDoc(doc(db, "registro_arribos", ultimoId));
      alert("Último arribo eliminado correctamente.");
      setUltimoId(null);
      obtenerUltimo();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="text-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de Arribos</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={enviarArribo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg shadow"
        >
          Registrar Arribo
        </button>
        <button
          onClick={eliminarUltimo}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded text-lg shadow"
          disabled={!ultimoId}
        >
          Eliminar Último
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
