const db = require('../config/db');
const Ambulancia = require('./ambulancia.model');
const Taller = require('./taller.model');

const getAllMantenimientos = async () => {
  const [rows] = await db.query(`
    select m.id, a.unidad, m.ambulancia_id, m.descripcion, DATE_FORMAT(m.fecha, '%m/%d/%Y') as fecha, m.tipo_mantenimiento, m.tipo_servicio, m.kilometraje, m.factura, m.tipo_taller, m.taller, m.razon_social_taller, SUM((costo_unitario * cantidad)) total 
    from mantenimientos m 
    inner join gastos g on m.id = g.mantenimiento_id
    inner join ambulancias a on m.ambulancia_id=a.id
    group by m.id;
  `);
  return rows;
};

const getMantenimientoById = async (id) => {
  const [rows] = await db.query('SELECT * FROM mantenimientos WHERE id = ?', [id]);
  return rows[0];
};

// ✅ Nueva función para validar existencia de relaciones
const validateForeignKeys = async (ambulancia_id) => {
  const [[amb], [tall]] = await Promise.all([
    Ambulancia.getAmbulanciaById(ambulancia_id)
  ]);

  if (!amb) return { ok: false, field: 'ambulancia' };
  return { ok: true };
};

const createMantenimiento = async (data) => {
  const {
    ambulancia_id,
    tipo_mantenimiento,
    tipo_servicio,
    fecha,
    descripcion,
    kilometraje,
    factura,
    taller,
    razon_social_taller,
    tipo_taller,
    
  } = data;

  const [result] = await db.query(
    `INSERT INTO mantenimientos (
      ambulancia_id, 
      tipo_mantenimiento, 
      tipo_servicio, 
      fecha, 
      descripcion,
      kilometraje,
      factura,
      taller,
      razon_social_taller, 
      tipo_taller
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
    [
      ambulancia_id,
      tipo_mantenimiento,
      tipo_servicio,
      fecha,
      descripcion,
      kilometraje,
      factura,
      taller,
      razon_social_taller,
      tipo_taller,
    ]
  );
  return result.insertId;
};

const updateMantenimiento = async (id, data) => {
  const {
    ambulancia_id,
    tipo_mantenimiento,
    tipo_servicio,
    fecha,
    descripcion,
    kilometraje,
    factura,
    taller,
    razon_social_taller,
    tipo_taller,
  } = data;

  await db.query(
    `UPDATE mantenimientos SET
      ambulancia_id = ?, tipo_mantenimiento = ?, tipo_servicio = ?, fecha = ?,
      descripcion = ?, kilometraje = ?, factura = ?, taller= ?, razon_social_taller = ?, tipo_taller = ?
     WHERE id = ?`,
    [
      ambulancia_id,
      tipo_mantenimiento,
      tipo_servicio,
      fecha,
      descripcion,
      kilometraje,
      factura,
      taller,
      razon_social_taller,
      tipo_taller,
      id,
    ]
  );
};

const deleteMantenimiento = async (id) => {
  await db.query('DELETE FROM mantenimientos WHERE id = ?', [id]);
};

module.exports = {
  getAllMantenimientos,
  getMantenimientoById,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento,
  validateForeignKeys, // <- Importante exportar esto
};


