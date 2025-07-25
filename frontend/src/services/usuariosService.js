import api from "./api";

export const get = async () => {
  const response = await api.get("/usuarios");
  if (response.status !== 200) throw new Error("Error al cargar usuarios");
  return response.data;
};
export const create = async (usuario) => {
  const response = await api.post("/usuarios", usuario);
  if (response.status !== 201) throw new Error("Error al crear usuario");
  return response.data;
};

export const update = async (id, usuario) => {
  const response = await api.put(`/usuarios/${id}`, usuario);
  if (response.status !== 200) throw new Error("Error al actualizar usuario");
  return response.data;
};

export const remove = async (id) => {
  const response = await api.delete(`/usuarios/${id}`);
  if (response.status !== 200 && response.status !== 204)
    throw new Error("Error al eliminar usuario");
  return response.data;
};
