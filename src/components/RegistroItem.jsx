import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroItem({ id, onDelete }) {
  const [descripcion, setDescripcion] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [productos, setProductos] = useState({
    "Crispetas": 0,
    "Combo Crispetas": 0,
    "Combo Perro": 0
  });
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

  const actualizarCantidad = (producto, cantidad) => {
    setProductos(prev => ({ ...prev, [producto]: cantidad }));
  };

  const enviar = async () => {
    try {
      await addDoc(collection(db, "registros"), {
        descripcion,
        metodoPago,
        productos,
        ...tiempos,
        timestamp: new Date().toISOString()
      });
      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
        onDelete(); // eliminar el registro visualmente
      }, 2000);
    } catch (error) {
      alert("Error al guardar el registro: " + error.message);
    }
  };

  const formatoHora = (iso) => iso ? new Date(iso).toLocaleTimeString() : "--";

  const botonClase = (seleccionado, valor) => {
    return "px-2 py-1 rounded-full text-sm font-semibold " +
      (seleccionado === valor ? "bg-blue-600 text-white" : "bg-gray-300 text-black");
  };

  return (
    <div className="flex flex-col gap-4 border border-white text-black bg-white p-6 rounded-lg shadow mb-6 max-w-6xl mx-auto relative">
      <textarea onChange={e => setDescripcion(e.target.value)} className="w-full p-2 rounded border" placeholder="Descripción" />

      <div className="grid grid-cols-4 gap-4 text-sm text-center">
        <button onClick={() => marcarTiempo("arribo")} className="bg-gray-800 text-white py-2 rounded">Arribo<br /><span className="text-xs">{formatoHora(tiempos.arribo)}</span></button>
        <button onClick={() => marcarTiempo("inicioCaja")} className="bg-gray-800 text-white py-2 rounded">Inicio Caja<br /><span className="text-xs">{formatoHora(tiempos.inicioCaja)}</span></button>
        <button onClick={() => marcarTiempo("finCaja")} className="bg-gray-800 text-white py-2 rounded">Fin Caja<br /><span className="text-xs">{formatoHora(tiempos.finCaja)}</span></button>
        <button onClick={() => marcarTiempo("finPedido")} className="bg-gray-800 text-white py-2 rounded">Fin Pedido<br /><span className="text-xs">{formatoHora(tiempos.finPedido)}</span></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-bold mb-2">Método de Pago</h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => setMetodoPago("Efectivo")} className={botonClase(metodoPago, "Efectivo")}>Efectivo</button>
            <button onClick={() => setMetodoPago("Tarjeta")} className={botonClase(metodoPago, "Tarjeta")}>Tarjeta</button>
            <button onClick={() => setMetodoPago("T.Cineco")} className={botonClase(metodoPago, "T.Cineco")}>T.Cineco</button>
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="font-bold mb-2">Productos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(productos).map(prod => (
              <div key={prod} className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium">{prod}</span>
                <input type="number" min="0" value={productos[prod]} onChange={(e) => actualizarCantidad(prod, parseInt(e.target.value) || 0)} className="w-16 px-2 py-1 border rounded text-center" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={enviar} className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-6 rounded shadow hover:from-green-500 hover:to-green-700 transition">
          Enviar
        </button>
        <button onClick={onDelete} className="bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-2 px-6 rounded shadow hover:from-red-500 hover:to-red-700 transition">
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
