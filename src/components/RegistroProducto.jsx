import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroProducto() {
  const [lotes, setLotes] = useState([]);
  const productos = ["Crispetas", "Combo Perro", "Combo Nachos"];

  const iniciarProduccion = () => {
    setLotes(prev => [...prev, {
      producto: '',
      cantidad: 0,
      inicio: new Date().toISOString(),
      fin: null
    }]);
  };

  const actualizarProducto = (index, producto) => {
    setLotes(prev => {
      const copia = [...prev];
      copia[index].producto = producto;
      return copia;
    });
  };

  const cambiarCantidad = (index, delta) => {
    setLotes(prev => {
      const copia = [...prev];
      const nueva = copia[index].cantidad + delta;
      if (nueva >= 0) copia[index].cantidad = nueva;
      return copia;
    });
  };

  const finalizarLote = (index) => {
    setLotes(prev => {
      const copia = [...prev];
      copia[index].fin = new Date().toISOString();
      return copia;
    });
  };

  const enviarLote = async (index) => {
    const lote = lotes[index];
    if (!lote.producto || !lote.fin || lote.cantidad === 0) {
      alert("Completa el producto, la cantidad y finaliza el lote antes de enviarlo.");
      return;
    }

    try {
      await addDoc(collection(db, "registro_producto"), lote);
      setLotes(prev => prev.filter((_, i) => i !== index));
    } catch (e) {
      alert("Error al enviar: " + e.message);
    }
  };

  const eliminarLote = (index) => {
    const confirmar = window.confirm("¿Eliminar este registro?");
    if (confirmar) {
      setLotes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const format = (t) => t ? new Date(t).toLocaleTimeString() : "--";

  return (
    <div className="text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Registro por Producto</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={iniciarProduccion}
          className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded text-lg shadow"
        >
          Iniciar Producción
        </button>
      </div>

      {lotes.map((lote, i) => (
        <div key={i} className="bg-white text-black p-6 rounded shadow mb-6 text-center">
          <div className="font-bold mb-2">Inicio: {format(lote.inicio)}</div>

          <div className="flex justify-center gap-2 flex-wrap mb-3">
            {productos.map(p => (
              <button
                key={p}
                onClick={() => actualizarProducto(i, p)}
                className={
                  "px-4 py-1 rounded-full font-semibold " +
                  (lote.producto === p ? "bg-blue-600 text-white" : "bg-gray-300 text-black")
                }
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mb-4">
            <button onClick={() => cambiarCantidad(i, -1)} className="bg-gray-300 px-3 py-1 rounded">−</button>
            <div className="text-lg font-bold">{lote.cantidad}</div>
            <button onClick={() => cambiarCantidad(i, 1)} className="bg-gray-300 px-3 py-1 rounded">+</button>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-center">Fin</label>
              <button
                onClick={() => finalizarLote(i)}
                className="bg-gray-800 text-white px-4 py-2 rounded w-24"
                disabled={!!lote.fin}
              >
                {format(lote.fin)}
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => enviarLote(i)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
            >
              Enviar
            </button>
            <button
              onClick={() => eliminarLote(i)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded shadow"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
