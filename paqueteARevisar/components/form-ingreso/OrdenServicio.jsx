import { useFormIngreso } from '../../context/FormIngresoContext';
import Collapsible from './Collapsible';
import { LineaServicio } from './LineaServicio';

export function OrdenServicio() {
  const {
    form,
    addLineaServicio,
    updateLineaServicio,
    deleteLineaServicio,
    setField,
  } = useFormIngreso();

  const agregarLinea = () => addLineaServicio({ descripcion: '', cantidad: 1 });

  return (
    <>
      <Collapsible title="Líneas de servicio" main={false} initMode="collapsed">
        {(form.lineasServicio || []).map((linea, i) => (
          <LineaServicio
            key={i}
            index={i}
            data={linea}
            onDelete={() => deleteLineaServicio(i)}
            onChange={(changes) => updateLineaServicio(i, changes)}
          />
        ))}

        <button type="button" className="button-add" onClick={agregarLinea}>
          + Agregar línea
        </button>

        <div style={{ marginTop: 12 }}>
          <strong>Total: </strong> S/{(form.total || 0).toFixed(2)}
        </div>
      </Collapsible>

      {/* campos generales */}
      <div className="col" style={{ marginTop: 15 }}>
        <label>Diagnóstico del cliente</label>
        <textarea
          value={form.diagnosticoCliente || ''}
          onChange={(e) => setField('diagnosticoCliente', e.target.value)}
          className="input-field"
        />
      </div>
    </>
  );
}
