
const db = require('../config/db');
const { format } = require('date-fns');

const generarReporte = async (filtros) => {
  let query = `
    SELECT 
      m.id, 
      a.unidad, 
      m.ambulancia_id, 
      m.descripcion, 
      DATE_FORMAT(m.fecha, '%Y-%m-%d') as fecha, 
      m.tipo_mantenimiento, 
      m.tipo_servicio, 
      m.kilometraje, 
      m.factura, 
      m.tipo_taller, 
      m.taller, 
      m.razon_social_taller, 
      SUM((costo_unitario * cantidad)) as total 
    FROM mantenimientos m 
    INNER JOIN gastos g ON m.id = g.mantenimiento_id
    INNER JOIN ambulancias a ON m.ambulancia_id = a.id
  `;

  const whereClauses = [];
  const params = [];

  // Filtro por unidad
  if (filtros.unidad) {
    whereClauses.push('m.ambulancia_id = ?');
    params.push(filtros.unidad);
  }

  // Filtro por razón social
  if (filtros.razonSocial) {
    whereClauses.push('m.razon_social_taller LIKE ?');
    params.push(`%${filtros.razonSocial}%`);
  }

  // Filtro por período
  if (filtros.periodo) {
    const now = new Date();
    let fechaInicio;

    switch(filtros.periodo) {
      case 'mes':
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
    }

    whereClauses.push('m.fecha >= ?');
    params.push(format(fechaInicio, 'yyyy-MM-dd'));
  }

  // Agregar WHERE si hay filtros
  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  // Agrupar y ordenar
  query += ' GROUP BY m.id ORDER BY m.fecha DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

module.exports = {
  generarReporte
};