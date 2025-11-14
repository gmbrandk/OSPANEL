import { useEffect, useRef } from 'react';
import { useAutocompleteTipoTrabajo } from '../../hooks/form-ingreso/useAutocompleteTipoTrabajo';
import { SelectAutocomplete } from './SelectAutocomplete';

export function LineaServicio({ index, data = {}, onDelete, onChange }) {
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

  // Guardar precioOriginal cuando seleccionamos desde el autocomplete
  const precioOriginalRef = useRef(null);

  useEffect(() => {
    if (selectedTrabajo) {
      const desc = data.descripcion ?? selectedTrabajo.nombre ?? '';
      const precio = data.precioUnitario ?? selectedTrabajo.precioBase ?? null;

      // si no existe precioUnitario en data, llenamos con precioBase
      if (
        typeof data.precioUnitario === 'undefined' ||
        data.precioUnitario === null
      ) {
        onChange({
          tipoTrabajo: selectedTrabajo,
          descripcion: desc,
          precioUnitario: precio,
        });
      } else {
        // si ya hay precioUnitario (viene del backend), solo actualizamos tipoTrabajo y descripcion
        onChange({ tipoTrabajo: selectedTrabajo, descripcion: desc });
      }

      // guardamos original para comparación visual
      precioOriginalRef.current = precio;
    }
  }, [selectedTrabajo]); // eslint-disable-line react-hooks/exhaustive-deps

  const precioActual =
    typeof data.precioUnitario !== 'undefined' && data.precioUnitario !== null
      ? data.precioUnitario
      : '';
  const precioOriginal = precioOriginalRef.current;
  const precioModificado =
    precioOriginal != null &&
    precioActual !== '' &&
    Number(precioActual) !== Number(precioOriginal);

  return (
    <div className="row linea-servicio" style={{ marginTop: '10px' }}>
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

      <div className="col">
        <label>Descripción</label>
        <input
          type="text"
          className="input-field"
          value={data.descripcion ?? ''}
          onChange={(e) => onChange({ descripcion: e.target.value })}
        />
      </div>

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
            className={
              precioModificado ? 'input-field precio-modificado' : 'input-field'
            }
            value={precioActual}
            min="0"
            step="0.1"
            onChange={(e) => {
              const v = e.target.value;
              if (v === '') {
                onChange({ precioUnitario: '' });
                return;
              }
              const num = Number(v);
              if (Number.isNaN(num) || num < 0) return;
              onChange({ precioUnitario: num });
            }}
          />
        </div>
      </div>

      <div className="col" style={{ width: '50px' }}>
        <button type="button" className="button-delete" onClick={onDelete}>
          🗑
        </button>
      </div>
    </div>
  );
}
