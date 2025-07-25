const db = require('../config/db');

// Obtener todos los gastos
const getAllGastos = async () => {
  const [rows] = await db.query(`
    SELECT g.*, m.factura AS factura_mantenimiento
    FROM gastos g
    LEFT JOIN mantenimientos m ON g.mantenimiento_id = m.id
    ORDER BY g.id DESC
  `);
  return rows;
};

// Obtener gasto por ID
const getGastoById = async (id) => {
  const [rows] = await db.query('SELECT id, nombre, cantidad, costo_unitario, mantenimiento_id FROM gastos WHERE id = ?', [id]);
  return rows[0];
};

const getGastosByMantenimientoId = async (id) => {
  const [rows] = await db.query('SELECT id, nombre, cantidad, costo_unitario, mantenimiento_id FROM gastos WHERE mantenimiento_id = ?', [id]);
  return rows;
};

// Validar si existe el mantenimiento
const validateMantenimientoId = async (mantenimiento_id) => {
  const [rows] = await db.query('SELECT id FROM mantenimientos WHERE id = ?', [mantenimiento_id]);
  return rows.length > 0;
};

// Crear nuevo gasto
const createGasto = async ({ nombre, cantidad, costo_unitario, mantenimiento_id }) => {
  const [result] = await db.query(
    `INSERT INTO gastos (
    nombre, 
    cantidad, 
    costo_unitario, 
    mantenimiento_id) 
    VALUES (?, ?, ?, ?)`,
    [nombre, cantidad, costo_unitario, mantenimiento_id]
  );
  return result.insertId;
};

// Actualizar gasto existente
const updateGasto = async (id, data) => {
  const { nombre, cantidad, costo_unitario, mantenimiento_id } = data;
  await db.query(
    'UPDATE gastos SET nombre = ?, cantidad = ?, costo_unitario = ? WHERE id = ? and mantenimiento_id = ?',
    [nombre, cantidad, costo_unitario, id, mantenimiento_id]
  );
};

// Eliminar gasto
const deleteGasto = async (id) => {
  await db.query('DELETE FROM gastos WHERE id = ?', [id]);
};

module.exports = {
  getAllGastos,
  getGastoById,
  getGastosByMantenimientoId,
  createGasto,
  updateGasto,
  deleteGasto,
  validateMantenimientoId,
};
