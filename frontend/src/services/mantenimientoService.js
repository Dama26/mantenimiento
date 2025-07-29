import api from './api';

export const get = async (filters) => {
  Object.keys(filters).forEach(key => {
      if (filters[key] == null || filters[key] === '') {
        delete filters[key];
      }
    });


  const response = await api.get('/mantenimientos', {
    params: filters,
    paramsSerializer:{
      indexes: null,
    }
  });
  if (response.status !== 200) throw new Error("Error al cargar mantenimientos");
  return response.data;
};

export const getGastosByMantenimientoId = async (id) => {
  const response = await api.get(`/mantenimientos/${id}/gastos`);
  if (response.status !== 200) throw new Error("Error al cargar gastos del mantenimiento");
  return response.data;
};

export const create = async (mantenimiento) => {
  const response = await api.post('/mantenimientos', mantenimiento);
  if (response.status !== 201) throw new Error("Error al crear mantenimiento");
  return response.data;
};

export const update = async (id, mantenimiento) => {
  const response = await api.put(`/mantenimientos/${id}`, mantenimiento);
  if (response.status !== 200) throw new Error("Error al actualizar mantenimiento");
  return response.data;
};

export const remove = async (id) => {
  const response = await api.delete(`/mantenimientos/${id}`);
  if (response.status !== 200 && response.status !== 204) throw new Error("Error al eliminar mantenimiento");
  return response.data;
};



