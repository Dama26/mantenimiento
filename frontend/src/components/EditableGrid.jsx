import { useState } from "react";
import axios from "axios";

const EditableSpendsGrid = ({ rows, setRows }) => {
  const [isEditing, setIsEditing] = useState(true);

  const handleInputChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, [field]: field === "nombre" ? value : Number(value) }
          : row
      )
    );
  };

  const addRow = (e) => {
    e.preventDefault();

    const newRow = {
      id: Date.now(),
      nombre: "",
      cantidad: 0,
      costo_unitario: 0,
    };
    setRows((prev) => [...prev, newRow]);
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const calculateSubtotal = (row) => row.cantidad * row.costo_unitario;

  const calculateTotal = () =>
    rows.reduce((sum, row) => sum + calculateSubtotal(row), 0);

  const editGrid = () => {
    setIsEditing(true);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mt-4  text-right">
        {isEditing && (
          <button
            onClick={addRow}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
          > Agregar Gasto
          </button>
        )}
        {isEditing ??
          (<button
            onClick={editGrid}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Modificar
          </button>
        )}
      </div>

      <table className="w-full border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-sm font-medium">Nombre</th>
            <th className="p-2 border text-sm font-medium">Cantidad</th>
            <th className="p-2 border text-sm font-medium">Costo Unitario</th>
            <th className="p-2 border text-sm font-medium">Subtotal</th>
            {isEditing && <th className="p-2 border">Acción</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="p-2 border">
                {isEditing ? (
                  <input
                    type="text"
                    value={row.nombre}
                    onChange={(e) =>
                      handleInputChange(row.id, "nombre", e.target.value)
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  row.nombre
                )}
              </td>
              <td className="p-2 border">
                {isEditing ? (
                  <input
                    type="number"
                    value={row.cantidad}
                    onChange={(e) =>
                      handleInputChange(row.id, "cantidad", e.target.value)
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  row.cantidad
                )}
              </td>
              <td className="p-2 border">
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={row.costo_unitario}
                    onChange={(e) =>
                      handleInputChange(
                        row.id,
                        "costo_unitario",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  `$${row.costo_unitario.toFixed(2)}`
                )}
              </td>
              <td className="p-2 border">
                ${calculateSubtotal(row).toFixed(2)}
              </td>
              {isEditing && (
                <td className="p-2 border text-center">
                  <button
                    onClick={() => deleteRow(row.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold bg-gray-50">
            <td className="p-2 border text-sm font-medium" colSpan={3}>
              Total
            </td>
            <td
              className="p-2 border text-sm font-medium"
              colSpan={isEditing ? 2 : 1}
            >
              ${calculateTotal().toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default EditableSpendsGrid;
