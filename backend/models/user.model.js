const db = require('../config/db');

// Ya existentes
const findUserByEmail = async (correo) => {
  const [rows] = await db.query('SELECT * FROM users WHERE correo = ?', [correo]);
  return rows[0];
};

const createUser = async ({ nombre, correo, rol, contrasena }) => {
  const [result] = await db.query(
    'INSERT INTO users (nombre, correo, rol, contrasena) VALUES (?, ?, ?, ?)',
    [nombre, correo, rol, contrasena]
  );
  return result.insertId;
};

// Nuevos para administración
const getAllUsers = async () => {
  const [rows] = await db.query('SELECT id, nombre, correo, rol FROM users');
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT id, nombre, correo, rol FROM users WHERE id = ?', [id]);
  return rows[0];
};

const updateUser = async (id, { nombre, correo, rol }) => {
  await db.query(
    'UPDATE users SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
    [nombre, correo, rol, id]
  );
};

const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
};

module.exports = {
  findUserByEmail,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

