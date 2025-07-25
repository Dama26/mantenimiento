import api from './api';

export const getAmbulancias = async () => {
  const response = await api.get('/ambulancias');
  if (response.status !== 200) throw new Error("Error al cargar ambulancias");
  return response.data;
};

export const createAmbulancia = async (ambulancia) => {
  const response = await api.post('/ambulancias', ambulancia);
  if (response.status !== 201) throw new Error("Error al crear ambulancia");
  return response.data;
};

export const updateAmbulancia = async (id, ambulancia) => {
  const response = await api.put(`/ambulancias/${id}`, ambulancia);
  if (response.status !== 200) throw new Error("Error al actualizar ambulancia");
  return response.data;
};

export const deleteAmbulancia = async (id) => {
  const response = await api.delete(`/ambulancias/${id}`);
  if (response.status !== 200 && response.status !== 204) throw new Error("Error al eliminar ambulancia");
  return response.data;
};



