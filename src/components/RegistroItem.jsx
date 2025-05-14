import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroItem({ id, onDelete }) {
  const [descripcion, setDescripcion] = useState('');
  const [arribo, setArribo] = useState(null);
  const [inicioCaja, setInicioCaja] = useState(null);
  const [finCaja, setFinCaja] = useState(null);
  const [metodoPago, setMetodoPago] = useState('');
  const [enviado, setEnviado] = useState(false);

  const now = () => new Date().toISOString();

  const validar = () => arribo && inicioCaja && finCaja && metodoPago;

  const enviarRegistro = async () => {
    if (!validar()) {
      alert("Debes completar todos los campos obligatorios antes de enviar.");
      return;
    }

    try {
      await addDoc(collection(db, 'registro_arribo'), {
        descripcion,
        arribo,
        inicioCaja,
        finCaja,
        metodoPago,
        timestamp: now()
      });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 2000);
      onDelete();
    } catch (err) {
      alert("Error al guardar el registro: " + err.message);
    }
  };

  const botonClase = (activo, valor) =>
    "px-3 py-1 rounded-full text-sm font-semibold " +
    (activo === valor ? "bg-blue-600 text-white" : "bg-gray-300 text-black");

  const format = (valor) => valor ? new Date(valor).toLocaleTimeString() : "--";

  return (
    <div className="bg-white text-black p-4 rounded shadow mb-4 max-w-5xl mx-auto">
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
        className="w-full p-2 border rounded mb-4"
      />

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-900 text-white text-center rounded p-3">
          <div className="font-bold mb-1">Arribo</div>
          <button
            onClick={() => setArribo(now())}
            className={"w-full py-1 rounded " + (arribo ? "bg-green-600 text-white" : "bg-gray-700 text-white")}
          >
            {format(arribo)}
          </button>
        </div>
        <div className="bg-gray-900 text-white text-center rounded p-3">
          <div className="font-bold mb-1">Inicio Caja</div>
          <button
            onClick={() => setInicioCaja(now())}
            className={"w-full py-1 rounded " + (inicioCaja ? "bg-green-600 text-white" : "bg-gray-700 text-white")}
          >
            {format(inicioCaja)}
          </button>
        </div>
        <div className="bg-gray-900 text-white text-center rounded p-3">
          <div className="font-bold mb-1">Fin Caja</div>
          <button
            onClick={() => setFinCaja(now())}
            className={"w-full py-1 rounded " + (finCaja ? "bg-green-600 text-white" : "bg-gray-700 text-white")}
          >
            {format(finCaja)}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-bold mb-2">Método de Pago</div>
        <div className="flex gap-2 justify-center">
          {["Efectivo", "Tarjeta", "T.Cineco"].map(m => (
            <button
              key={m}
              onClick={() => setMetodoPago(m)}
              className={botonClase(metodoPago, m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={enviarRegistro}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Enviar
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Eliminar
        </button>
      </div>

      {enviado && (
        <div className="text-center mt-4 text-green-500 font-medium">
          Registro enviado correctamente ✔️
        </div>
      )}
    </div>
  );
}
