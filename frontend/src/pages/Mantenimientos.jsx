import { useState, useEffect } from "react";
import { getAmbulancias } from "../services/ambulanciasService";
import * as MantenimientosService  from "../services/mantenimientoService";
import EditableSpendsGrid from "../components/EditableGrid";
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('es', es);


const Mantenimientos = () => {
  const [tipoMantenimiento, setTipoMantenimiento] = useState("preventivo");
  const [tipoTaller, setTipoTaller] = useState("interno");
  const [taller, setTaller] = useState("");
  const [tipoServicio, setTipoServicio] = useState("menor");
  const [kilometraje, setKilometraje] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [factura, setFactura] = useState("");
  const [ambulanciaSeleccionadaId, setAmbulanciaSeleccionadaId] = useState("");
  const [gastos, setGastos] = useState([]);

  const [ambulancias, setAmbulancias] = useState([]);

  const [historial, setHistorial] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mantenimientoEnEdicionId, setMantenimientoEnEdicionId] = useState(0);


  const cargarAmbulancias = async () => {
    try {
      const data = await getAmbulancias();
      setAmbulancias(data);
    } catch (error) {
      console.error("Error al cargar ambulancias:", error);
      alert("No se pudieron cargar las ambulancias.");
    }
  };

  const cargarHistorial = async () => {
    try {
      const data = await MantenimientosService.get();
      setHistorial(data);
    } catch (error) {
      console.error("Error al cargar el historial de mantenimientos:", error);
      alert("No se pudo cargar el historial de mantenimientos.");
    }
  };

  const cargarGastos = async (id) => {
    try {
      const data = await MantenimientosService.getGastosByMantenimientoId(id);
      setGastos(data)
    } catch (error) {
      console.error("Error al cargar los gastos del mantenimiento:", error);
      alert("No se pudieron cargar los gastos del mantenimiento.");
    }
  };

  useEffect(() => {
    cargarAmbulancias();
    cargarHistorial();
  }, []);

  const handleAgregar = async (e) => {
    e.preventDefault();

    // if (
    //   !descripcion ||
    //   !fecha ||
    //   !unidad ||
    //   !taller ||
    //   !costo ||
    //   !factura
    // )
    //   return;

    const mantenimientoObject = {
      id: modoEdicion ? mantenimientoEnEdicionId :  Date.now(),
      ambulancia_id: ambulanciaSeleccionadaId,
      tipo_mantenimiento: tipoMantenimiento,
      tipo_servicio: tipoServicio,
      fecha,
      descripcion,
      kilometraje,
      factura,
      tipo_taller: tipoTaller,
      taller,
      gastos
    };

    console.log(mantenimientoObject);

    try {
      if(modoEdicion) {
        console.log("Actualizando mantenimiento:", mantenimientoEnEdicionId);
        await MantenimientosService.update(mantenimientoEnEdicionId, mantenimientoObject);
        await cargarHistorial();

        console.log("Mantenimiento actualizado:", mantenimientoObject);
      }
      else {
        const data = await MantenimientosService.create(mantenimientoObject);  
        setHistorial((prev) => [...prev, data]);
        console.log("Mantenimiento creado:", mantenimientoObject);
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      if (modoEdicion) {
        console.error("Error al actualizar mantenimiento:", error);
        alert("No se pudo actualizar el mantenimiento.");
      } else {
        console.error("Error al crear mantenimiento:", error);
        alert("No se pudo crear el mantenimiento.");  
      }
    }

  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Deseas eliminar este mantenimiento?")) {
      setHistorial(historial.filter((item) => item.id !== id));
    }
  };

  const handleChange = (e) => {
    setAmbulanciaSeleccionadaId(e.target.value);
    console.log("Selected Ambulance ID:", e.target.value);
  };

  const handleEditar = async (mantenimiento) => {
    cargarGastos(mantenimiento.id);
    setTipoMantenimiento(mantenimiento.tipo_mantenimiento);
    setTipoTaller(mantenimiento.tipo_taller);
    setTaller(mantenimiento.taller);  
    setTipoServicio(mantenimiento.tipo_servicio);
    setKilometraje(mantenimiento.kilometraje);
    setDescripcion(mantenimiento.descripcion);
    setFecha(mantenimiento.fecha);  
    setFactura(mantenimiento.factura);
    setAmbulanciaSeleccionadaId(mantenimiento.ambulancia_id);
    setShowForm(true);
    setModoEdicion(true);
    setMantenimientoEnEdicionId(mantenimiento.id);
    console.log("Editando mantenimiento:", mantenimiento.id);
    console.log("Editando mantenimiento:", mantenimientoEnEdicionId);
  };

  const resetForm = () => {
    setDescripcion("");
    setFecha("");
    setAmbulanciaSeleccionadaId(0);
    setTipoMantenimiento("preventivo");
    setTipoTaller("interno");
    setTipoServicio("interno");
    setKilometraje(0);
    setFactura("");
    setTaller("");
    setShowForm(false);
    setModoEdicion(false)
  };

  function formatNumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold text-red-700">
        Gestión de Mantenimientos
      </h1>

      <section
        className="bg-white p-6 rounded-lg shadow-lg mx-auto"
        style={{ display: showForm ? "block" : "none" }}
      >
        <h1 className="text-2xl font-bold text-red-700 mb-4">Mantenimientos</h1>

        <form
          onSubmit={handleAgregar}
          className="bg-white p-6 rounded shadow grid md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium">Unidad</label>

            <select
              id="ambulancia"
              value={ambulanciaSeleccionadaId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Selecciona --</option>
              {ambulancias.map((amb) => (
                <option key={amb.id} value={amb.id}>
                  {amb.unidad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              value={tipoMantenimiento}
              onChange={(e) => setTipoMantenimiento(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo de taller</label>
            <select
              value={tipoTaller}
              onChange={(e) => setTipoTaller(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="externo">Externo</option>
              <option value="interno">Interno</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Nombre del taller
            </label>
            <input
              type="text"
              value={taller}
              onChange={(e) => setTaller(e.target.value)}
              placeholder="Ej. Taller Rodríguez"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          

          <div>
            <label className="block text-sm font-medium">Tipo de servicio</label>
            <select
              value={tipoServicio}
              onChange={(e) => setTipoServicio(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="mayor">Mayor</option>
              <option value="menor">Menor</option>
            
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Kilometraje
            </label>
            <input
              type="text"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
              placeholder="Ej.12345 km"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>


          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder=""
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
            
            {/* <DatePicker
          selected={fecha}
          onChange={(date) => setFecha(date)}
          locale="es"
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/aaaa"
              className="w-full border border-gray-300 p-2 rounded"

        /> */}

          </div>

          <div>
            <label className="block text-sm font-medium">Factura</label>
            <input
              type="text"
              value={factura}
              onChange={(e) => setFactura(e.target.value)}
              placeholder="Ej. F-00123"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>


          <div className="md:col-span-2">
            <hr className="border-gray-300" />
          </div>

          <div className="md:col-span-2">
            <EditableSpendsGrid rows={gastos} setRows={setGastos}/>
          </div>

          <div className="md:col-span-2 text-right">

            <button className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 mr-2">
              { modoEdicion ? "Actualizar": "Guardar"}
            </button>

            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              onClick={resetForm}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <hr className="border-gray-300" />

      <div className="mt-8" style={{ display: showForm ? "none" : "block" }}>
        <div>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            onClick={() => setShowForm(true)}
          >
            Añadir Mantenimiento
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-red-700 mb-4 text-center">
          Historial de Mantenimientos
        </h2>
        {historial.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-center">
              <thead className="bg-red-100 text-red-700">
                <tr>
                  <th className="border px-3 py-2">Unidad</th>
                  <th className="border px-3 py-2">Fecha</th>
                  <th className="border px-3 py-2">Tipo de Mantenimiento</th>
                  <th className="border px-3 py-2">Kilometraje</th>
                  <th className="border px-3 py-2">Factura</th>
                  <th className="border px-3 py-2">Tipo de Taller</th>
                  <th className="border px-3 py-2">Nombre del taller</th>
                  <th className="border px-3 py-2">Total</th>
                  <th className="border px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{m.unidad}</td>
                    <td className="border px-2 py-1">{m.fecha}</td>
                    
                    <td className="border px-2 py-1 capitalize">
                      {m.tipo_mantenimiento}
                    </td>
                    <td className="border px-2 py-1 capitalize">
                      { formatNumberWithCommas(m.kilometraje)}km
                    </td>
                    <td className="border px-2 py-1">{m.factura}</td>
                    <td className="border px-2 py-1">{m.tipo_taller}</td>
                    <td className="border px-2 py-1">{m.taller}</td>
                    <td className="border px-2 py-1">${ formatNumberWithCommas(m.total)}</td>
                    <td className="border px-2 py-1">
                      <button
                        onClick={() => handleEditar(m)}
                        className="text-red-900 hover:underline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            No hay mantenimientos registrados.
          </p>
        )}
      </div>
    </div>
  );
};

export default Mantenimientos;
