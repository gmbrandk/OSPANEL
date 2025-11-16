import { useEffect, useRef, useState } from 'react';
import { useIngresoForm } from '../../context/IngresoFormContext';
import { useAutocompleteTipoTrabajo } from '../../hooks/form-ingreso/useAutocompleteTipoTrabajo.js';
import { SelectAutocomplete } from './SelectAutocomplete.jsx';

export function LineaServicio({ index, data = {}, onDelete, onChange }) {
  // Snapshot inicial (NO CAMBIA)
  const initialRef = useRef(data);
  const { updateLinea, deleteLinea, resetLinea, isLineaModificada } =
    useIngresoForm();

  const modificado = isLineaModificada(index);
  // console.groupCollapsed(
  //   `%c[LineaServicio] render index=${index}`,
  //   'color:#00aaff;font-weight:bold'
  // );
  // console.log('data:', data);
  // console.groupEnd();

  // ================================
  // AUTOCOMPLETE
  // ================================
  const initialTrabajo =
    typeof data.tipoTrabajo === 'object'
      ? data.tipoTrabajo
      : data.tipoTrabajo
      ? { nombre: data.tipoTrabajo }
      : null;

  const {
    query,
    resultados,
    isOpen,
    selectedTrabajo,
    onChange: onQueryChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTrabajo,
  } = useAutocompleteTipoTrabajo(initialTrabajo);

  // ================================
  // DESCRIPCIÓN CONTROLADA
  // ================================
  const [localDescripcion, setLocalDescripcion] = useState(
    data.descripcion ?? ''
  );
  const [userEditedDescripcion, setUserEditedDescripcion] = useState(false);

  // Solo se guarda la primera vez
  const precioOriginalRef = useRef(null);

  // ================================
  // RESET
  // ================================
  const handleReset = () => {
    const original = initialRef.current;

    console.log(
      '%c[LineaServicio] RESET → estado original:',
      'color:#ff4444',
      original
    );

    setLocalDescripcion(original.descripcion ?? '');
    setUserEditedDescripcion(false);

    onChange(index, {
      tipoTrabajo: original.tipoTrabajo,
      descripcion: original.descripcion ?? '',
      precioUnitario: original.precioUnitario ?? 0,
      cantidad: original.cantidad ?? 1,
    });
  };

  // ================================
  // CUANDO CAMBIA selectedTrabajo (autocomplete)
  // ================================
  useEffect(() => {
    if (!selectedTrabajo) return;

    console.log(
      `%c[LineaServicio] selectedTrabajo change index=${index}`,
      'color:#ff00aa;font-weight:bold',
      selectedTrabajo
    );

    // Regla de oro: NO USAR nombre como fallback
    const nuevaDescripcion =
      !userEditedDescripcion && selectedTrabajo.descripcion
        ? selectedTrabajo.descripcion.trim()
        : localDescripcion;

    const nuevoPrecio = selectedTrabajo.precioBase ?? data.precioUnitario ?? 0;

    if (precioOriginalRef.current === null) {
      precioOriginalRef.current = nuevoPrecio;
    }

    setLocalDescripcion(nuevaDescripcion);

    onChange(index, {
      tipoTrabajo: selectedTrabajo,
      descripcion: nuevaDescripcion,
      precioUnitario: nuevoPrecio,
    });
  }, [selectedTrabajo]);

  // ================================
  // SI BACKEND ACTUALIZA DESCRIPCIÓN
  // ================================
  useEffect(() => {
    setLocalDescripcion(data.descripcion ?? '');
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

  return (
    <div
      className="row linea-servicio"
      style={{
        marginTop: '10px',
        borderLeft: precioModificado
          ? '4px solid #f6c743'
          : '4px solid transparent',
      }}
    >
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
            className={`input-field ${
              precioModificado ? 'precio-modificado' : ''
            }`}
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

      {/* Eliminar / Reset */}
      <div
        className="col"
        style={{ width: '70px', display: 'flex', gap: '4px' }}
      >
        <button
          type="button"
          className="button-delete"
          onClick={() => onDelete(index)}
        >
          🗑
        </button>
        <button
          type="button"
          className="button-reset"
          onClick={() => resetLinea(index)}
          title="Restaurar cambios"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
