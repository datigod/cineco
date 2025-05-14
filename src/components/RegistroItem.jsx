import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroItem({ id, onDelete }) {
  const [descripcion, setDescripcion] = useState("");
  const [producto, setProducto] = useState("Crispetas");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [enviado, setEnviado] = useState(false);
  const [tiempos, setTiempos] = useState({
    arribo: null,
    inicioCaja: null,
    finCaja: null,
    finPedido: null
  });

  const marcarTiempo = (campo) => {
    const ahora = new Date().toISOString();
    setTiempos(prev => ({ ...prev, [campo]: ahora }));
  };

  const enviar = async () => {
    await addDoc(collection(db, "registros"), {
      descripcion,
      arribo: tiempos.arribo,
      inicioCaja: tiempos.inicioCaja,
      finCaja: tiempos.finCaja,
      finPedido: tiempos.finPedido,
      metodoPago,
      producto
    });
    setEnviado(true);
    setTimeout(() => setEnviado(false), 2000);
  };

  const formatoHora = (iso) => iso ? new Date(iso).toLocaleTimeString() : "--";

  const botonClase = (seleccionado, valor) =>
    `px-2 py-1 rounded-full text-sm font-semibold ${seleccionado === valor ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`;

  return (
    <div className="grid grid-cols-9 gap-2 items-center border border-white text-black bg-white p-4 rounded-lg shadow mb-6 relative">
      <textarea onChange={e => setDescripcion(e.target.value)} className="col-span-2 p-2 rounded border" placeholder="Descripción" />

      <div className="flex flex-col gap-1 text-sm">
        <button onClick={() => marcarTiempo("arribo")} className="bg-gray-800 text-white px-2 py-1 rounded">Arribo<br/><span className="text-xs">{formatoHora(tiempos.arribo)}</span></button>
        <button onClick={() => marcarTiempo("inicioCaja")} className="bg-gray-800 text-white px-2 py-1 rounded">Inicio Caja<br/><span className="text-xs">{formatoHora(tiempos.inicioCaja)}</span></button>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <button onClick={() => marcarTiempo("finCaja")} className="bg-gray-800 text-white px-2 py-1 rounded">Fin Caja<br/><span className="text-xs">{formatoHora(tiempos.finCaja)}</span></button>
        <button onClick={() => marcarTiempo("finPedido")} className="bg-gray-800 text-white px-2 py-1 rounded">Fin Pedido<br/><span className="text-xs">{formatoHora(tiempos.finPedido)}</span></button>
      </div>

      <div className="flex flex-col gap-1 items-start">
        <button onClick={() => setMetodoPago("Efectivo")} className={botonClase(metodoPago, "Efectivo")}>Efectivo</button>
        <button onClick={() => setMetodoPago("Tarjeta")} className={botonClase(metodoPago, "Tarjeta")}>Tarjeta</button>
        <button onClick={() => setMetodoPago("T.Cineco")} className={botonClase(metodoPago, "T.Cineco")}>T.Cineco</button>
      </div>

      <div className="flex flex-col gap-1 items-start">
        <button onClick={() => setProducto("Crispetas")} className={botonClase(producto, "Crispetas")}>Crispetas</button>
        <button onClick={() => setProducto("Combo Crispetas")} className={botonClase(producto, "Combo Crispetas")}>Combo Crispetas</button>
        <button onClick={() => setProducto("Combo Perro")} className={botonClase(producto, "Combo Perro")}>Combo Perro</button>
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={enviar} className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-4 rounded shadow hover:from-green-500 hover:to-green-700 transition">
          Enviar
        </button>
        <button onClick={onDelete} className="bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-2 px-4 rounded shadow hover:from-red-500 hover:to-red-700 transition">
          Eliminar
        </button>
      </div>

      {enviado && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm px-4 py-2 rounded shadow mt-[-1.5rem]">
          Registro enviado ✔️
        </div>
      )}
    </div>
  );
}
