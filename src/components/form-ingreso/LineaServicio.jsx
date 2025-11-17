import { useEffect, useMemo, useRef, useState } from 'react';
import { useIngresoForm } from '../../context/IngresoFormContext';
import { useAutocompleteTipoTrabajo } from '../../hooks/form-ingreso/useAutocompleteTipoTrabajo';
import { log } from '../../utils/log'; // ← logger
import { SelectAutocomplete } from './SelectAutocomplete.jsx';

export function LineaServicio({ index, data = {}, onDelete, onChange }) {
  const { updateLinea, deleteLinea, resetLinea, isLineaModificada } =
    useIngresoForm();

  const modificado = isLineaModificada(index);

  // Normalización del tipoTrabajo
  const initialTrabajo = useMemo(() => {
    log('UI:LINEA', 'Normalizando tipoTrabajo inicial', { index, data });
    if (typeof data.tipoTrabajo === 'object') return data.tipoTrabajo;
    if (typeof data.tipoTrabajo === 'string')
      return { nombre: data.tipoTrabajo };
    return null;
  }, [data.tipoTrabajo]);

  // Autocomplete para tipo de trabajo
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

  const [localDescripcion, setLocalDescripcion] = useState(
    data.descripcion ?? ''
  );
  const [userEditedDescripcion, setUserEditedDescripcion] = useState(false);

  const precioOriginalRef = useRef(null);

  // Sincronizar descripción externa → local
  useEffect(() => {
    if (
      data.descripcion !== undefined &&
      data.descripcion !== localDescripcion
    ) {
      log('UI:DESCRIPCION', 'Sincronizando descripción externa', {
        index,
        externa: data.descripcion,
        local: localDescripcion,
      });
      setLocalDescripcion(data.descripcion ?? '');
    }
  }, [data.descripcion]);

  // Cuando el usuario selecciona un tipo de trabajo
  useEffect(() => {
    if (!selectedTrabajo) return;

    log('UI:TRABAJO', 'Tipo trabajo seleccionado', { index, selectedTrabajo });

    const descripcionFinal =
      !userEditedDescripcion && selectedTrabajo.descripcion
        ? selectedTrabajo.descripcion.trim()
        : localDescripcion;

    const precioNuevo = selectedTrabajo.precioBase ?? data.precioUnitario ?? 0;

    if (precioOriginalRef.current === null)
      precioOriginalRef.current = precioNuevo;

    const patch = {
      tipoTrabajo: selectedTrabajo,
      descripcion: descripcionFinal,
      precioUnitario: precioNuevo,
    };

    log('UI:TRABAJO', 'Aplicando patch por selección de tipoTrabajo', {
      index,
      patch,
    });

    if (onChange) onChange(index, patch);
    else updateLinea(index, patch);
  }, [selectedTrabajo]);

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
      {/* Autocomplete tipo de trabajo */}
      <SelectAutocomplete
        label="Tipo de trabajo"
        placeholder="Buscar tipo de trabajo..."
        query={query}
        onChange={(v) => {
          log('UI:TRABAJO', 'Input tipoTrabajo update', { index, query: v });
          onQueryChange(v);
        }}
        resultados={resultados}
        isOpen={isOpen}
        onSelect={(t) => {
          log('UI:TRABAJO', 'Seleccionado trabajo desde lista', {
            index,
            trabajo: t,
          });
          seleccionarTrabajo(t);
        }}
        cerrarResultados={() => {
          log('UI:TRABAJO', 'Cerrar lista tipoTrabajo', { index });
          cerrarResultados();
        }}
        abrirResultados={() => {
          log('UI:TRABAJO', 'Abrir lista tipoTrabajo', { index });
          abrirResultados();
        }}
        inputName={`tipoTrabajo-${index}`}
        renderItem={(t) => (
          <>
            <div className="autocomplete-title">{t.nombre}</div>
            <div className="autocomplete-sub">
              S/{t.precioBase} — {t.descripcion}
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

            log('UI:DESCRIPCION', 'Descripción editada', { index, val });

            setUserEditedDescripcion(true);
            setLocalDescripcion(val);

            const patch = { descripcion: val };
            if (onChange) onChange(index, patch);
            else updateLinea(index, patch);
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
              const v = e.target.value;

              log('UI:PRECIO', 'Precio editado', { index, raw: v });

              if (v === '') {
                const patch = { precioUnitario: '' };
                if (onChange) onChange(index, patch);
                else updateLinea(index, patch);
                return;
              }

              const num = Number(v);
              if (isNaN(num) || num < 0) return;

              const patch = { precioUnitario: num };
              if (onChange) onChange(index, patch);
              else updateLinea(index, patch);

              log('UI:PRECIO', 'Precio actualizado', { index, num });
            }}
          />
        </div>
      </div>

      {/* Botones */}
      <div
        className="col"
        style={{ width: '70px', display: 'flex', gap: '4px' }}
      >
        <button
          type="button"
          className="button-delete"
          onClick={() => {
            log('UI:LINEA', 'Eliminar línea desde botón', { index });
            onDelete ? onDelete(index) : deleteLinea(index);
          }}
        >
          🗑
        </button>

        <button
          type="button"
          className="button-reset"
          onClick={() => {
            log('UI:LINEA', 'Reset línea a estado original', { index });
            resetLinea(index);
          }}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
