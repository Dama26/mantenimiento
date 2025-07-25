const db = require('../config/db');

const getAllTalleres = async () => {
  const [rows] = await db.query('SELECT * FROM talleres');
  return rows;
};

const getTallerById = async (id) => {
  const [rows] = await db.query('SELECT * FROM talleres WHERE id = ?', [id]);
  return rows[0];
};

const createTaller = async (data) => {
  const { nombre_taller, responsable, direccion, telefono } = data;
  const [result] = await db.query(
    'INSERT INTO talleres (nombre_taller, responsable, direccion, telefono) VALUES (?, ?, ?, ?)',
    [nombre_taller, responsable, direccion, telefono]
  );
  return result.insertId;
};

const updateTaller = async (id, data) => {
  const { nombre_taller, responsable, direccion, telefono } = data;
  await db.query(
    'UPDATE talleres SET nombre_taller = ?, responsable = ?, direccion = ?, telefono = ? WHERE id = ?',
    [nombre_taller, responsable, direccion, telefono, id]
  );
};

const deleteTaller = async (id) => {
  await db.query('DELETE FROM talleres WHERE id = ?', [id]);
};

module.exports = {
  getAllTalleres,
  getTallerById,
  createTaller,
  updateTaller,
  deleteTaller,
};
