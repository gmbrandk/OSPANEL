import { useEffect, useState } from 'react';
import { useAutocompleteTipoTrabajo } from '../../hooks/form-ingreso/useAutocompleteTipoTrabajo.js';
import { SelectAutocomplete } from './SelectAutocomplete.jsx';

export function LineaServicio({ index, data = {}, onDelete, onChange }) {
  useEffect(() => {
    console.log(
      `%c[LineaServicio] 🧾 Línea #${index} montada con data:`,
      'color: #0af',
      data
    );
  }, [index, data]);

  // Hook con soporte para valor inicial
  const {
    query,
    resultados,
    isOpen,
    selectedTrabajo,
    onChange: onQueryChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTrabajo,
  } = useAutocompleteTipoTrabajo(
    typeof data.tipoTrabajo === 'object'
      ? data.tipoTrabajo
      : data.tipoTrabajo
      ? { nombre: data.tipoTrabajo }
      : null
  );

  const [localDescripcion, setLocalDescripcion] = useState(
    data.descripcion || ''
  );
  const [localPrecio, setLocalPrecio] = useState(data.precioUnitario || '');

  // 🧠 Cuando el usuario selecciona un tipo de trabajo del autocompletado
  useEffect(() => {
    if (selectedTrabajo) {
      setLocalDescripcion(selectedTrabajo.categoria);
      setLocalPrecio(selectedTrabajo.precioBase);

      onChange(index, {
        tipoTrabajo: selectedTrabajo,
        descripcion: selectedTrabajo.categoria,
        precioUnitario: selectedTrabajo.precioBase,
      });
    }
  }, [selectedTrabajo, index, onChange]);

  // 🔄 Cuando se escribe manualmente un nuevo tipo de trabajo
  useEffect(() => {
    if (!selectedTrabajo && query) {
      onChange(index, {
        tipoTrabajo: query,
      });
    }
  }, [query, selectedTrabajo, index, onChange]);

  // 🔄 Si el padre actualiza la data
  useEffect(() => {
    setLocalDescripcion(data.descripcion || '');
    setLocalPrecio(data.precioUnitario || '');
  }, [data]);

  return (
    <div className="row linea-servicio" style={{ marginTop: '10px' }}>
      {/* Tipo de trabajo */}
      <SelectAutocomplete
        label="Tipo de trabajo"
        placeholder="Buscar o escribir tipo de trabajo..."
        query={query}
        onChange={onQueryChange}
        resultados={resultados}
        isOpen={isOpen}
        onSelect={seleccionarTrabajo}
        cerrarResultados={cerrarResultados}
        abrirResultados={abrirResultados}
        inputName={`tipoTrabajo-${index}`}
        renderItem={(t) => (
          <>
            <div className="autocomplete-title">{t.nombre}</div>
            <div className="autocomplete-sub">
              S/{t.precioBase} — {t.categoria} — {t.tipo}
            </div>
          </>
        )}
      />

      {/* Descripción */}
      <div className="col">
        <label>Descripción</label>
        <input
          type="text"
          name="descripcion"
          className="input-field"
          value={localDescripcion}
          onChange={(e) => {
            const val = e.target.value;
            setLocalDescripcion(val);
            onChange(index, { descripcion: val });
          }}
        />
      </div>

      {/* Precio */}
      <div className="col">
        <label>Precio</label>
        <input
          type="number"
          className="input-field"
          value={localPrecio}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLocalPrecio(v);
            onChange(index, { precioUnitario: v });
          }}
        />
      </div>

      {/* Eliminar línea */}
      <div className="col" style={{ width: '50px' }}>
        <button
          type="button"
          className="button-delete"
          onClick={() => onDelete(index)}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
