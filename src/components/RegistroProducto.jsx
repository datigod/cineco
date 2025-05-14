import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistroProducto() {
  const productosIniciales = ["Crispetas", "Combo Perro", "Combo Nachos"];
  const [registros, setRegistros] = useState(() =>
    productosIniciales.map(nombre => ({
      nombre,
      inicio: null,
      fin: null,
      cantidad: 0
    }))
  );
  const [enviado, setEnviado] = useState(false);

  const marcarTiempo = (i, tipo) => {
    const ahora = new Date().toISOString();
    setRegistros(prev => {
      const copia = [...prev];
      copia[i][tipo] = ahora;
      return copia;
    });
  };

  const actualizarCantidad = (i, valor) => {
    setRegistros(prev => {
      const copia = [...prev];
      copia[i].cantidad = parseInt(valor) || 0;
      return copia;
    });
  };

  const enviar = async () => {
    try {
      await addDoc(collection(db, "registro_producto"), {
        registros,
        timestamp: new Date().toISOString()
      });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 2000);
      setRegistros(productosIniciales.map(nombre => ({
        nombre,
        inicio: null,
        fin: null,
        cantidad: 0
      })));
    } catch (error) {
      alert("Error al guardar los datos: " + error.message);
    }
  };

  const formato = (iso) => iso ? new Date(iso).toLocaleTimeString() : "--";

  return (
    <div className="text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro por Producto</h2>
      <div className="grid grid-cols-1 gap-6 mb-6">
        {registros.map((item, i) => (
          <div key={item.nombre} className="border p-4 rounded bg-white text-black shadow">
            <h3 className="text-lg font-bold mb-2">{item.nombre}</h3>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => marcarTiempo(i, 'inicio')} className="bg-gray-800 text-white px-4 py-2 rounded">
                Iniciar <br /> <span className="text-xs">{formato(item.inicio)}</span>
              </button>
              <button onClick={() => marcarTiempo(i, 'fin')} className="bg-gray-800 text-white px-4 py-2 rounded">
                Finalizar <br /> <span className="text-xs">{formato(item.fin)}</span>
              </button>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-black">Cantidad</label>
                <input
                  type="number"
                  min="0"
                  value={item.cantidad}
                  onChange={(e) => actualizarCantidad(i, e.target.value)}
                  className="w-20 px-2 py-1 border rounded text-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={enviar} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow">
          Enviar Registros
        </button>
      </div>
      {enviado && (
        <div className="text-center mt-4 text-green-400 font-medium">
          Registro de productos enviado correctamente ✔️
        </div>
      )}
    </div>
  );
}