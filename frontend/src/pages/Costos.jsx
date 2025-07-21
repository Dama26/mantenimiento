import { useState } from "react";

const formatosPeriodo = {
  anual: "Año",
  semestral: "Semestre",
  bimestral: "Bimestre",
  mensual: "Mes",
};

const getPeriodoClave = (fecha, tipo) => {
  const d = new Date(fecha);
  const year = d.getFullYear();

  switch (tipo) {
    case "anual":
      return `${year}`;
    case "semestral": {
      const sem = Math.floor(d.getMonth() / 6) + 1; // 1 o 2
      return `${year}-S${sem}`;
    }
    case "bimestral": {
      const bim = Math.floor(d.getMonth() / 2) + 1; // 1 a 6
      return `${year}-B${bim}`;
    }
    case "mensual": {
      const mes = d.getMonth() + 1; // 1 a 12
      return `${year}-${mes.toString().padStart(2, "0")}`;
    }
    default:
      return "";
  }
};

const Costos = () => {
  const [unidad, setUnidad] = useState("");
  const [fecha, setFecha] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [gastos, setGastos] = useState([]);
  const [periodoFiltro, setPeriodoFiltro] = useState("anual");

  const handleAgregarGasto = (e) => {
    e.preventDefault();
    if (!unidad || !fecha || !concepto || !monto || !kilometraje) return;

    const nuevoGasto = {
      id: Date.now(),
      unidad,
      fecha,
      kilometraje: parseFloat(kilometraje),
      concepto,
      monto: parseFloat(monto),
    };

    setGastos([...gastos, nuevoGasto]);
    setUnidad("");
    setFecha("");
    setKilometraje("");
    setConcepto("");
    setMonto("");
  };

  const gastosPorUnidad = gastos.reduce((acc, gasto) => {
    if (!acc[gasto.unidad]) acc[gasto.unidad] = [];
    acc[gasto.unidad].push(gasto);
    return acc;
  }, {});

  const gastosPorPeriodo = gastos.reduce((acc, gasto) => {
    const clavePeriodo = getPeriodoClave(gasto.fecha, periodoFiltro);
    if (!acc[clavePeriodo]) acc[clavePeriodo] = 0;
    acc[clavePeriodo] += gasto.monto;
    return acc;
  }, {});

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Costos por Unidad</h1>

      <form onSubmit={handleAgregarGasto} className="bg-white p-4 rounded shadow space-y-4 mb-8">
        <div>
          <label className="block font-medium mb-1">Unidad </label>
          <input
            type="text"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Nombre o número de unidad"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha del gasto</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Kilometraje</label>
          <input
            type="number"
            step="1"
            min="0"
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej. 125000"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Concepto</label>
          <input
            type="text"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej. Reemplazo de bujía"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Monto</label>
          <input
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej. 250.00"
          />
        </div>

        <button
          type="submit"
          className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800"
        >
          Agregar gasto
        </button>
      </form>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Gastos por Unidad</h2>
        {Object.keys(gastosPorUnidad).length === 0 ? (
          <p className="text-gray-500">No hay gastos registrados.</p>
        ) : (
          Object.entries(gastosPorUnidad).map(([unidadKey, lista]) => {
            const totalUnidad = lista.reduce((sum, g) => sum + g.monto, 0);
            return (
              <div key={unidadKey} className="mb-6 border rounded p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{unidadKey}</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-red-100 text-red-700">
                      <th className="border px-2 py-1">Fecha</th>
                      <th className="border px-2 py-1">Kilometraje</th>
                      <th className="border px-2 py-1">Concepto</th>
                      <th className="border px-2 py-1 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((gasto) => (
                      <tr key={gasto.id} className="hover:bg-gray-100">
                        <td className="border px-2 py-1">{gasto.fecha}</td>
                        <td className="border px-2 py-1">{gasto.kilometraje}</td>
                        <td className="border px-2 py-1">{gasto.concepto}</td>
                        <td className="border px-2 py-1 text-right">${gasto.monto.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-red-200">
                      <td className="border px-2 py-1" colSpan={3}>Total</td>
                      <td className="border px-2 py-1 text-right">${totalUnidad.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>

      <div className="mb-4">
        <label className="font-semibold mr-4">Ver gastos agrupados por:</label>
        <select
          value={periodoFiltro}
          onChange={(e) => setPeriodoFiltro(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="anual">Anual</option>
          <option value="semestral">Semestral</option>
          <option value="bimestral">Bimestral</option>
          <option value="mensual">Mensual</option>
        </select>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Gastos Totales por {formatosPeriodo[periodoFiltro]}</h2>
        {Object.keys(gastosPorPeriodo).length === 0 ? (
          <p className="text-gray-500">No hay gastos registrados.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-100 text-red-700">
                <th className="border px-2 py-1">Periodo</th>
                <th className="border px-2 py-1 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(gastosPorPeriodo).map(([periodo, monto]) => (
                <tr key={periodo} className="hover:bg-gray-100">
                  <td className="border px-2 py-1">{periodo}</td>
                  <td className="border px-2 py-1 text-right">${monto.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-red-200">
                <td className="border px-2 py-1">Total General</td>
                <td className="border px-2 py-1 text-right">
                  ${Object.values(gastosPorPeriodo).reduce((a, b) => a + b, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Costos;
