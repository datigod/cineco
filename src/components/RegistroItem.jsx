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

  return (
    <div className="grid grid-cols-8 gap-2 p-2 border border-white text-black">
      <textarea onChange={e => setDescripcion(e.target.value)} className="col-span-1 p-1" placeholder="Descripción" />
      <button onClick={() => marcarTiempo("arribo")}>{tiempos.arribo ? new Date(tiempos.arribo).toLocaleTimeString() : "Marcar"}</button>
      <button onClick={() => marcarTiempo("inicioCaja")}>{tiempos.inicioCaja ? new Date(tiempos.inicioCaja).toLocaleTimeString() : "Marcar"}</button>
      <button onClick={() => marcarTiempo("finPedido")}>{tiempos.finPedido ? new Date(tiempos.finPedido).toLocaleTimeString() : "Marcar"}</button>
      <button onClick={() => marcarTiempo("finPago")}>{tiempos.finPago ? new Date(tiempos.finPago).toLocaleTimeString() : "Marcar"}</button>
      <select defaultValue="Efectivo"><option>Efectivo</option><option>Tarjeta</option></select>
      <textarea onChange={e => setObservacion(e.target.value)} placeholder="Observación" className="p-1" />
      <div className="flex flex-col gap-1">
        <button onClick={enviar} className="bg-blue-500 text-white px-2 py-1">Enviar</button>
        <button onClick={onDelete} className="bg-red-500 text-white px-2 py-1">Eliminar</button>
      </div>
    </div>
  );
}
