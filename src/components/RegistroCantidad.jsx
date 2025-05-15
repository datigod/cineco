import React, { useState } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroCantidad() {
  const [cantidades, setCantidades] = useState({
    "Combo Crispetas": 0,
    "Combo Perro": 0,
    "Combo Nachos": 0,
  });
  const [confirmacion, setConfirmacion] = useState(false);

  const actualizar = (key, delta) => {
    setCantidades(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const enviar = async () => {
    const total = Object.values(cantidades).reduce((a, b) => a + b, 0);
    if (total === 0) {
      alert("Debes ingresar al menos un producto.");
      return;
    }

    try {
      await addDoc(collection(db, "registro_cantidad"), {
        ...cantidades,
        timestamp: new Date().toISOString()
      });
      setConfirmacion(true);
      setCantidades({
        "Combo Crispetas": 0,
        "Combo Perro": 0,
        "Combo Nachos": 0,
      });
      setTimeout(() => setConfirmacion(false), 2000);
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  };

  const eliminarUltimo = async () => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar el último registro de cantidades?");
    if (!confirmar) return;

    try {
      const q = query(collection(db, "registro_cantidad"), orderBy("timestamp", "desc"), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const ultimo = snap.docs[0];
        await deleteDoc(doc(db, "registro_cantidad", ultimo.id));
        alert("Último registro eliminado correctamente.");
      } else {
        alert("No hay registros para eliminar.");
      }
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  };

  return (
    <div className="text-white max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de Cantidad</h2>

      <div className="flex justify-center gap-6 flex-wrap mb-6">
        {Object.entries(cantidades).map(([nombre, valor]) => (
          <div key={nombre} className="bg-white text-black p-4 rounded shadow text-center min-w-[140px]">
            <div className="font-semibold mb-2">{nombre}</div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => actualizar(nombre, -1)}
                className="bg-gray-300 px-3 rounded text-lg"
              >−</button>
              <span className="font-bold text-lg w-8 text-center">{valor}</span>
              <button
                onClick={() => actualizar(nombre, 1)}
                className="bg-gray-300 px-3 rounded text-lg"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={enviar}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          Enviar Cantidades
        </button>
        <button
          onClick={eliminarUltimo}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
        >
          Eliminar Último
        </button>
      </div>

      {confirmacion && (
        <div className="text-center mt-4 text-green-400 font-medium">
          ✔️ Cantidades registradas correctamente
        </div>
      )}
    </div>
  );
}
