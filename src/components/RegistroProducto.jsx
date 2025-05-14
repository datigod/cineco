import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroProducto() {
  const productos = ["Crispetas", "Combo Perro", "Combo Nachos"];
  const [lotes, setLotes] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const iniciarLote = () => {
    const nuevo = {
      producto: "",
      inicio: new Date().toISOString(),
      fin: null,
      cantidad: 0
    };
    setLotes(prev => [...prev, nuevo]);
  };

  const seleccionarProducto = (i, producto) => {
    setLotes(prev => {
      const copia = [...prev];
      copia[i].producto = producto;
      return copia;
    });
  };

  const finalizarLote = (i) => {
    const fin = new Date().toISOString();
    setLotes(prev => {
      const copia = [...prev];
      copia[i].fin = fin;
      return copia;
    });
  };

  const actualizarCantidad = (i, cantidad) => {
    setLotes(prev => {
      const copia = [...prev];
      copia[i].cantidad = parseInt(cantidad) || 0;
      return copia;
    });
  };

  const eliminarLote = (i) => {
    setLotes(prev => prev.filter((_, index) => index !== i));
  };

  const validar = () => {
    return (
      lotes.length > 0 &&
      lotes.every(l => l.producto !== "" && l.fin && l.cantidad > 0)
    );
  };

  const enviar = async () => {
    if (!validar()) {
      alert("Cada lote debe tener producto seleccionado, tiempo finalizado y cantidad mayor a cero.");
      return;
    }
    try {
      await addDoc(collection(db, "registro_producto"), {
        lotes,
        timestamp: new Date().toISOString()
      });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 2000);
      setLotes([]);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const formato = (iso) => iso ? new Date(iso).toLocaleTimeString() : "--";

  return (
    <div className="text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Registro por Producto</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={iniciarLote}
          className="bg-gray-800 text-white px-6 py-2 rounded shadow"
        >
          Iniciar Producción
        </button>
      </div>

      {lotes.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          {lotes.map((lote, i) => (
            <div key={i} className="bg-white text-black p-4 rounded shadow flex flex-col items-center gap-3">
              <div className="font-bold text-center">Inicio: {formato(lote.inicio)}</div>

              <div className="flex flex-wrap justify-center gap-2">
                {productos.map(p => (
                  <button
                    key={p}
                    onClick={() => seleccionarProducto(i, p)}
                    className={
                      "px-3 py-1 rounded-full text-sm font-semibold " +
                      (lote.fin && lote.cantidad > 0 && lote.producto === p
                        ? "bg-green-600 text-white"
                        : lote.producto === p
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-black")
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3 items-center w-full">
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-center">Cantidad</label>
                  <input
                    type="number"
                    min="0"
                    value={lote.cantidad}
                    onChange={(e) => actualizarCantidad(i, e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-center"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-center">Fin</label>
                  <div className="text-xs bg-gray-100 rounded px-3 py-1">{formato(lote.fin)}</div>
                  <button
                    onClick={() => finalizarLote(i)}
                    className="bg-gray-700 text-white px-4 py-1 mt-1 rounded"
                    disabled={!!lote.fin}
                  >
                    Finalizar
                  </button>
                </div>

                <button
                  onClick={() => eliminarLote(i)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lotes.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={enviar}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
          >
            Enviar Registros
          </button>
        </div>
      )}

      {enviado && (
        <div className="text-center mt-4 text-green-400 font-medium">
          Registros enviados correctamente ✔️
        </div>
      )}
    </div>
  );
}
