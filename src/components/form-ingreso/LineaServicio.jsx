import { useEffect, useRef, useState } from 'react';
import { useAutocompleteTipoTrabajo } from '../../hooks/form-ingreso/useAutocompleteTipoTrabajo.js';
import { SelectAutocomplete } from './SelectAutocomplete.jsx';

export function LineaServicio({ index, data = {}, onDelete, onChange }) {
  // ================================
  // AUTOCOMPLETE
  // ================================
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

  // ================================
  // DESCRIPCIÓN (con control de usuario)
  // ================================
  const [localDescripcion, setLocalDescripcion] = useState(
    data.descripcion || ''
  );
  const [userEditedDescripcion, setUserEditedDescripcion] = useState(false);

  // Precio original
  const precioOriginalRef = useRef(null);

  // ================================
  // CUANDO CAMBIA EL TIPO DE TRABAJO
  // ================================
  useEffect(() => {
    if (!selectedTrabajo) return;

    const nuevaDescripcion = !userEditedDescripcion
      ? selectedTrabajo.descripcion?.trim() ||
        selectedTrabajo.nombre?.trim() ||
        ''
      : localDescripcion;

    const nuevoPrecio = data.precioUnitario ?? selectedTrabajo.precioBase ?? '';

    precioOriginalRef.current = nuevoPrecio;

    setLocalDescripcion(nuevaDescripcion);

    onChange(index, {
      tipoTrabajo: selectedTrabajo,
      descripcion: nuevaDescripcion,
      precioUnitario: nuevoPrecio,
    });
  }, [selectedTrabajo]);

  // ================================
  // CUANDO BACKEND ACTUALIZA DESCRIPCIÓN
  // ================================
  useEffect(() => {
    setLocalDescripcion(data.descripcion || '');
  }, [data.descripcion]);

  // ================================
  // VALORES DERIVADOS
  // ================================
  const precioActual = data.precioUnitario ?? '';
  const precioOriginal = precioOriginalRef.current;

  const precioModificado =
    precioOriginal !== null &&
    precioActual !== '' &&
    Number(precioActual) !== Number(precioOriginal);

  const precioClass = precioModificado
    ? 'input-field precio-modificado'
    : 'input-field';

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
              S/{t.precioBase} — {t.descripcion || ''} — {t.tipo}
            </div>
          </>
        )}
      />

      {/* Descripción */}
      <div className="col">
        <label>Descripción</label>
        <input
          type="text"
          className="input-field"
          value={localDescripcion}
          onChange={(e) => {
            const val = e.target.value;
            setUserEditedDescripcion(true);
            setLocalDescripcion(val);
            onChange(index, { descripcion: val });
          }}
        />
      </div>

      {/* Precio */}
      <div className="col precio-col">
        <label>
          Precio{' '}
          {precioModificado && (
            <span className="badge-modificado">Modificado</span>
          )}
        </label>

        <div
          className="precio-wrapper"
          title={
            precioOriginal != null ? `Precio original: S/${precioOriginal}` : ''
          }
        >
          <input
            type="number"
            className={precioClass}
            value={precioActual}
            min="0"
            step="0.1"
            onChange={(e) => {
              let v = e.target.value;

              if (v === '') {
                onChange(index, { precioUnitario: '' });
                return;
              }

              const num = Number(v);
              if (Number.isNaN(num) || num < 0) return;

              onChange(index, { precioUnitario: num });
            }}
          />
        </div>
      </div>

      {/* Eliminar */}
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
