const db = require('../config/db');

const getAllAmbulancias = async () => {
  const [rows] = await db.query('SELECT id, numero_serie, unidad, modelo, nombre_conductor FROM ambulancias');
  return rows;
};

const getAmbulanciaByUnidad = async (unidadid) => {
  const [rows] = await db.query('SELECT numero_serie, unidad, modelo, nombre_conductor FROM ambulancias WHERE unidad = ?', [unidad]);
  return rows[0];
};

const getAmbulanciaById = async (id) => {
  const [rows] = await db.query('SELECT numero_serie, unidad, modelo, nombre_conductor FROM ambulancias WHERE id = ?', [id]);
  return rows[0];
};

const createAmbulancia = async (data) => {
  const { numero_serie, unidad, modelo, nombre_conductor } = data;
  const [result] = await db.query(
    'INSERT INTO ambulancias (numero_serie, unidad, modelo, nombre_conductor) VALUES (?, ?, ?, ?)',
    [numero_serie, unidad, modelo, nombre_conductor]
  );
  return result.insertId;
};

const updateAmbulancia = async (id, data) => {
  const { numero_serie, unidad, modelo, nombre_conductor } = data;
  await db.query(
    'UPDATE ambulancias SET numero_serie = ?, unidad = ?, modelo = ?, nombre_conductor = ? WHERE id = ?',
    [numero_serie, unidad, modelo, nombre_conductor, id]
  );
};

const deleteAmbulancia = async (id) => {
  await db.query('DELETE FROM ambulancias WHERE id = ?', [id]);
};

module.exports = {
  getAllAmbulancias,
  getAmbulanciaByUnidad,
  getAmbulanciaById,
  createAmbulancia,
  updateAmbulancia,
  deleteAmbulancia,
};
