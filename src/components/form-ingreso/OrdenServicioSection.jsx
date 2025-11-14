// src/components/form-ingreso/OrdenServicio.jsx
import { useEffect } from 'react';
import { useIngresoForm } from '../../context/IngresoFormContext';
import { useAutocompleteTecnico } from '../../hooks/form-ingreso/useAutocompleteTecnico';
import { Autocomplete } from './Autocomplete';
import Collapsible from './Collapsible'; // según ruta
import { LineaServicio } from './LineaServicio';

export function OrdenServicio() {
  const { tecnico, setTecnico, orden, setOrden } = useIngresoForm();
  console.log('[ORDENSERVICIO] Orden actual:', orden);

  const {
    query,
    resultados,
    isOpen,
    selectedTecnico,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTecnico,
  } = useAutocompleteTecnico(tecnico);

  /* ======================================================
     🔄 Sincronización con el contexto global
  ====================================================== */
  useEffect(() => {
    setTecnico(selectedTecnico);
  }, [selectedTecnico, setTecnico]);

  /* ======================================================
     🧩 Manejo de líneas de servicio
  ====================================================== */
  const agregarLinea = () =>
    setOrden((prev) => ({
      ...prev,
      lineasServicio: [...(prev.lineasServicio || []), {}],
    }));

  const eliminarLinea = (index) =>
    setOrden((prev) => ({
      ...prev,
      lineasServicio: prev.lineasServicio.filter((_, i) => i !== index),
    }));

  const actualizarLinea = (index, data) =>
    setOrden((prev) => {
      const lineas = [...prev.lineasServicio];
      lineas[index] = { ...lineas[index], ...data };
      return { ...prev, lineasServicio: lineas };
    });

  const handleOrdenChange = (field, value) => {
    setOrden((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="row">
        {/* ======================================================
            👨‍🔧 AUTOCOMPLETADO TÉCNICO
        ======================================================= */}
        <Autocomplete
          label="Técnico"
          placeholder="Buscar técnico…"
          inputName="tecnico"
          query={query}
          onChange={onQueryChange}
          resultados={resultados}
          isOpen={isOpen}
          onSelect={seleccionarTecnico}
          cerrarResultados={cerrarResultados}
          abrirResultados={abrirResultados}
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

      {/* ======================================================
    🧾 LÍNEAS DE SERVICIO
====================================================== */}
      <Collapsible title="Líneas de servicio" main={false} initMode="collapsed">
        {orden.lineasServicio?.map((linea, i) => (
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
      {/* ======================================================
          🧠 CAMPOS GENERALES DE LA ORDEN
      ======================================================= */}
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
