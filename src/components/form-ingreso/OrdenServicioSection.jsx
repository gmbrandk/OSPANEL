import { useEffect } from 'react';
import { useIngresoForm } from '../../context/IngresoFormContext';
import { useAutocompleteTecnico } from '../../hooks/form-ingreso/useAutocompleteTecnico';
import { log } from '../../utils/log'; // ← Logger
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

  // Autocomplete técnico
  const {
    query,
    resultados,
    isOpen,
    selectedTecnico,
    onChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTecnico,
  } = useAutocompleteTecnico(tecnico);

  // Sincroniza selección con el contexto
  useEffect(() => {
    if (selectedTecnico) {
      log('UI:TECNICO', 'Seleccionado técnico', selectedTecnico);
      setTecnico(selectedTecnico);
    }
  }, [selectedTecnico]);

  const agregarLinea = () => {
    log('UI:LINEAS', 'Agregar línea');
    addLinea();
  };

  const eliminarLinea = (i) => {
    log('UI:LINEAS', 'Eliminar línea', { index: i });
    deleteLinea(i);
  };

  const actualizarLinea = (i, patch) => {
    log('UI:LINEAS', 'Actualizar línea', { index: i, patch });
    if (typeof patch === 'function') updateLinea(i, patch);
    else updateLinea(i, (prev) => ({ ...prev, ...patch }));
  };

  const handleOrdenChange = (field, value) => {
    log('UI:ORDEN', `Cambio en campo "${field}"`, { value });
    setOrden((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* TÉCNICO */}
      <div className="row">
        <Autocomplete
          label="Técnico"
          placeholder="Buscar técnico…"
          inputName="tecnico"
          query={query}
          onChange={(v) => {
            log('UI:TECNICO', 'input técnico update', v);
            onChange(v);
          }}
          resultados={resultados}
          isOpen={isOpen}
          onSelect={(t) => {
            log('UI:TECNICO', 'Técnico seleccionado desde Autocomplete', t);
            seleccionarTecnico(t);
          }}
          cerrarResultados={() => {
            log('UI:TECNICO', 'Cerrar lista de técnicos');
            cerrarResultados();
          }}
          abrirResultados={() => {
            log('UI:TECNICO', 'Abrir lista de técnicos');
            abrirResultados();
          }}
          renderItem={(t) => (
            <>
              <strong>
                {t.nombres} {t.apellidos}
              </strong>
              <br />
              <small>{t.email}</small>
            </>
          )}
        />

        <div className="col">
          <label>Email</label>
          <input
            value={selectedTecnico?.email ?? ''}
            readOnly
            className="input-field"
          />
        </div>

        <div className="col">
          <label>Teléfono</label>
          <input
            value={selectedTecnico?.telefono ?? ''}
            readOnly
            className="input-field"
          />
        </div>
      </div>

      {/* LÍNEAS */}
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
