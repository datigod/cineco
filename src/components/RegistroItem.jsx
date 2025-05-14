import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroItem({ id, onDelete }) {
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [tiempos, setTiempos] = useState({
    arribo: null,
    inicioCaja: null,
    finPedido: null,
    finPago: null
  });

  const marcarTiempo = (campo) => {
    const ahora = new Date().toISOString();
    setTiempos(prev => ({ ...prev, [campo]: ahora }));
  };

  const enviar = async () => {
    await addDoc(collection(db, "registros"), {
      descripcion,
      ...tiempos,
      metodoPago: "Efectivo",
      observacion
    });
    alert("Guardado");
  };

  const formatoHora = (iso) => iso ? new Date(iso).toLocaleTimeString() : "--";

  return (
    <div className="grid grid-cols-9 gap-2 items-center border border-white text-black bg-white p-2 rounded-lg shadow mb-4">
      <textarea onChange={e => setDescripcion(e.target.value)} className="col-span-2 p-2 rounded border" placeholder="Descripción" />
      <div className="flex flex-col gap-1 text-sm">
        <button onClick={() => marcarTiempo("arribo")} className="bg-gray-800 text-white px-2 py-1 rounded">Arribo<br/><span className="text-xs">{formatoHora(tiempos.arribo)}</span></button>
        <button onClick={() => marcarTiempo("inicioCaja")} className="bg-gray-800 text-white px-2 py-1 rounded">Inicio Caja<br/><span className="text-xs">{formatoHora(tiempos.inicioCaja)}</span></button>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <button onClick={() => marcarTiempo("finPedido")} className="bg-gray-800 text-white px-2 py-1 rounded">Fin Pedido<br/><span className="text-xs">{formatoHora(tiempos.finPedido)}</span></button>
        <button onClick={() => marcarTiempo("finPago")} className="bg-gray-800 text-white px-2 py-1 rounded">Fin Pago<br/><span className="text-xs">{formatoHora(tiempos.finPago)}</span></button>
      </div>
      <select defaultValue="Efectivo" className="p-2 rounded border col-span-1">
        <option>Efectivo</option>
        <option>Tarjeta</option>
      </select>
      <textarea onChange={e => setObservacion(e.target.value)} placeholder="Observación" className="col-span-2 p-2 rounded border" />
      <div className="flex flex-col gap-1">
        <button onClick={enviar} className="bg-blue-500 text-white px-3 py-2 rounded">Enviar</button>
        <button onClick={onDelete} className="bg-red-500 text-white px-3 py-2 rounded">Eliminar</button>
      </div>
    </div>
  );
}
