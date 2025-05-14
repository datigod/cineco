import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroProducto() {
  const productos = ["Crispetas", "Combo Perro", "Combo Nachos"];
  const [activo, setActivo] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const iniciarLote = (producto) => {
    const nuevo = {
      producto,
      inicio: new Date().toISOString(),
      fin: null,
      cantidad: 0
    };
    setLotes(prev => [...prev, nuevo]);
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

  const enviar = async () => {
    try {
      await addDoc(collection(db, "registro_producto"), {
        lotes,
        timestamp: new Date().toISOString()
      });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 2000);
      setActivo(null);
      setLotes([]);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const formato = (iso) => iso ? new Date(iso).toLocaleTimeString() : "--";

  return (
    <div className="text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Registro por Producto</h2>

      <div className="flex justify-center gap-3 flex-wrap mb-4">
        {productos.map(p => (
          <button
            key={p}
            onClick={() => setActivo(p)}
            className={\`px-4 py-2 rounded-full font-semibold \${activo === p ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}\`}
          >
            {p}
          </button>
        ))}
      </div>

      {activo && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => iniciarLote(activo)}
            className="bg-gray-800 text-white px-6 py-2 rounded shadow"
          >
            Iniciar {activo}
          </button>
        </div>
      )}

      {lotes.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          {lotes.map((lote, i) => (
            <div key={i} className="bg-white text-black p-4 rounded shadow flex flex-col items-center gap-2">
              <div className="font-bold">{lote.producto}</div>
              <div className="flex flex-wrap justify-center gap-3">
                <div>
                  <div className="text-sm font-medium text-center">Inicio</div>
                  <div className="text-xs bg-gray-100 rounded px-3 py-1">{formato(lote.inicio)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-center">Fin</div>
                  <div className="text-xs bg-gray-100 rounded px-3 py-1">{formato(lote.fin)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-center">Cantidad</label>
                  <input
                    type="number"
                    min="0"
                    value={lote.cantidad}
                    onChange={(e) => actualizarCantidad(i, e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-center"
                  />
                </div>
                <div>
                  <button
                    onClick={() => finalizarLote(i)}
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                    disabled={!!lote.fin}
                  >
                    Finalizar
                  </button>
                </div>
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
