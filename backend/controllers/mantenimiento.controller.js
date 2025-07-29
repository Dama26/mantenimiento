const Mantenimiento = require("../models/mantenimiento.model");
const Gasto = require("../models/gasto.model");


const getAll = async (req, res) => {
  const whereClauses = [];
  const params = [];
  const { unidad, periodo, tipoTaller, tipoMantenimiento } = req.query;
  
    if (unidad) {
      whereClauses.push('m.ambulancia_id = ?');
      params.push(unidad);
    }

    if(periodo){
      const now = new Date();
      let fechaInicio;

      switch(periodo) {
        case 'current_month':
          fechaInicio = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'bimestre':
          fechaInicio = new Date(now);
          fechaInicio.setMonth(now.getMonth() - 2);
          break;
        case 'semestre':
          fechaInicio = new Date(now);
          fechaInicio.setMonth(now.getMonth() - 6);
          break;
        case 'anio':
          fechaInicio = new Date(now);
          fechaInicio.setFullYear(now.getFullYear() - 1);
          break;
        default:
          return res.status(400).json({ error: "Período no válido" });
      }

      whereClauses.push('m.fecha >= ?');
      params.push(fechaInicio.toISOString().slice(0, 10));
    }

    if (tipoTaller) {
      whereClauses.push('m.tipo_taller = ?');
      params.push(tipoTaller);
    }

    if (tipoMantenimiento) {
      whereClauses.push('m.tipo_mantenimiento = ?');
      params.push(tipoMantenimiento);
    }

  const data = await Mantenimiento.getAllMantenimientos(whereClauses, params);
  res.json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const mantenimiento = await Mantenimiento.getMantenimientoById(id);
  if (!mantenimiento)
    return res.status(404).json({ error: "Mantenimiento no encontrado" });
  res.json(mantenimiento);
};

const getGastosByMantenimientoId = async (req, res) => {
  const { id } = req.params;
  const gastos = await Gasto.getGastosByMantenimientoId(id);
  if (!gastos)
    return res
      .status(404)
      .json({ error: "Gastos no encontrados para este mantenimiento" });
  res.json(gastos);
};

const create = async (req, res) => {
  const { gastos } = req.body;

  const id = await Mantenimiento.createMantenimiento(req.body);
  
  let sumaTotal = 0;

  if (gastos && Array.isArray(gastos)) {
    for (const gasto of gastos) {
      gasto.mantenimiento_id = id;
      const gastoId = await Gasto.createGasto(gasto);
      const gastoTotal = gasto.costo_unitario * gasto.cantidad;
      sumaTotal += gastoTotal;
      gasto.id = gastoId;
    }
    req.body.gastos = gastos;
  }

  req.body.total = sumaTotal;

  res.status(201).json({ id, ...req.body });
};

const update = async (req, res) => {
  const { id } = req.params;
  const { gastos } = req.body;
  
  const exists = await Mantenimiento.getMantenimientoById(id);
  if (!exists)
    return res.status(404).json({ error: "Mantenimiento no encontrado" });

  await Mantenimiento.updateMantenimiento(id, req.body);

  if (gastos && Array.isArray(gastos)) {
    for (const gasto of gastos) {
      const existingGasto = await Gasto.getGastoById(gasto.id);
      if (existingGasto) {
        await Gasto.updateGasto(gasto.id, gasto);
      } else {
        gasto.mantenimiento_id = id;
        const gastoId = await Gasto.createGasto(gasto);
        gasto.id = gastoId;
      }
    }
    req.body.gastos = gastos;
  }

  res.json({ message: "Mantenimiento actualizado" });
};

const remove = async (req, res) => {
  const { id } = req.params;
  const exists = await Mantenimiento.getMantenimientoById(id);
  if (!exists)
    return res.status(404).json({ error: "Mantenimiento no encontrado" });

  await Mantenimiento.deleteMantenimiento(id);
  res.json({ message: "Mantenimiento eliminado" });
};

module.exports = {
  getAll,
  getById,
  getGastosByMantenimientoId,
  create,
  update,
  remove,
};
