import api from './api';

export const getByMantenimientoId = async (id) => {
  const response = await api.get('/mantenimientos');
  if (response.status !== 200) throw new Error("Error al cargar mantenimientos");
  return response.data;
};