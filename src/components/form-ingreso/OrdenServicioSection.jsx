import { useEffect } from 'react';
import { useIngresoForm } from '../../context/IngresoFormContext';
import { useAutocompleteTecnico } from '../../hooks/form-ingreso/useAutocompleteTecnico';
import { log } from '../../utils/log';
import { Autocomplete } from './Autocomplete';
import Collapsible from './Collapsible';
import { LineaServicio } from './LineaServicio';

export function OrdenServicio() {
  const {
    tecnico,
    setTecnico,
    orden,
    setOrden,
    addLinea,
    deleteLinea,
    updateLinea,
  } = useIngresoForm();

  // ============================
  // AUTOCOMPLETE TÉCNICO
  // ============================
  const {
    query,
    resultados,
    isOpen,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTecnico,
    selectedTecnico, // ← FALTABA
  } = useAutocompleteTecnico(tecnico);

  // ============================
  // SYNC: Autocomplete → Context
  // ============================
  useEffect(() => {
    if (selectedTecnico && selectedTecnico._id) {
      log('UI:TECNICO', 'Sync hacia IngresoFormContext', selectedTecnico);
      setTecnico(selectedTecnico);
    }
  }, [selectedTecnico]);

  // ============================
  // LÍNEAS
  // ============================
  const agregarLinea = () => addLinea();

  const eliminarLinea = (i) => deleteLinea(i);

  const actualizarLinea = (i, patch) => {
    updateLinea(
      i,
      typeof patch === 'function'
        ? patch
        : (prev) => ({
            ...prev,
            ...patch,
          })
    );
  };

  const handleOrdenChange = (field, value) =>
    setOrden((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      {/* TÉCNICO */}
      <div className="row">
        <Autocomplete
          label="Técnico"
          placeholder="Buscar técnico…"
          inputName="tecnico"
          query={query}
          onChange={onQueryChange}
          resultados={resultados}
          isOpen={isOpen}
          onSelect={seleccionarTecnico}
          abrirResultados={abrirResultados}
          cerrarResultados={cerrarResultados}
          renderItem={(t) => (
            <>
              <strong>{t.nombreCompleto}</strong>
              <br />
              {t.email && <small>{t.email}</small>} —
              {t.role && <small>{t.role}</small>}
            </>
          )}
        />

        <div className="col">
          <label>Email</label>
          <input
            value={selectedTecnico?.email || ''}
            readOnly
            className="input-field"
          />
        </div>

        <div className="col">
          <label>Teléfono</label>
          <input
            value={selectedTecnico?.telefono || ''}
            readOnly
            className="input-field"
          />
        </div>
      </div>

      {/* LÍNEAS DE SERVICIO */}
      <Collapsible
        title="Líneas de servicio"
        main={false}
        initMode={orden.lineasServicio.length > 0 ? 'expanded' : 'collapsed'}
      >
        {orden.lineasServicio.map((linea, i) => (
          <LineaServicio
            key={i}
            index={i}
            data={linea}
            onDelete={eliminarLinea}
            onChange={actualizarLinea}
          />
        ))}

        <button type="button" className="button-add" onClick={agregarLinea}>
          + Agregar línea
        </button>
      </Collapsible>

      {/* CAMPOS GENERALES */}
      <div className="col" style={{ marginTop: 15 }}>
        <label>Diagnóstico del cliente</label>
        <textarea
          value={orden.diagnosticoCliente || ''}
          onChange={(e) =>
            handleOrdenChange('diagnosticoCliente', e.target.value)
          }
          className="input-field"
        />
      </div>

      <div className="col" style={{ marginTop: 10 }}>
        <label>Observaciones</label>
        <textarea
          value={orden.observaciones || ''}
          onChange={(e) => handleOrdenChange('observaciones', e.target.value)}
          className="input-field"
        />
      </div>
    </>
  );
}

export default OrdenServicio;
