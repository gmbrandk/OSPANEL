import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { calcularTotal } from '../utils/totales';

// Estructura recomendada del form (ejemplo)
const formInitial = {
  representante: null,
  equipo: null,
  tecnico: null,
  lineasServicio: [], // { tipoTrabajo, descripcion, precioUnitario, cantidad, _id? }
  diagnosticoCliente: '',
  observaciones: '',
  fechaIngreso: null,
  total: 0,
};

const FormIngresoContext = createContext(null);

export function FormIngresoProvider({ children, initialPayload = null }) {
  const [form, setForm] = useState(() => {
    return initialPayload
      ? normalizeInitialPayload(initialPayload)
      : formInitial;
  });

  // recalcula total automáticamente cuando cambian las lineas
  useEffect(() => {
    setForm((prev) => ({ ...prev, total: calcularTotal(prev.lineasServicio) }));
  }, [form.lineasServicio]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Helpers ----------
  function normalizeInitialPayload(payload) {
    // Asegura shape esperado (no destructura profunda por seguridad)
    return {
      representante: payload.representante ?? formInitial.representante,
      equipo: payload.equipo ?? formInitial.equipo,
      tecnico: payload.tecnico ?? formInitial.tecnico,
      lineasServicio: Array.isArray(payload.lineasServicio)
        ? payload.lineasServicio.map((l) => ({
            tipoTrabajo: l.tipoTrabajo ?? null,
            descripcion: l.descripcion ?? '',
            precioUnitario:
              typeof l.precioUnitario !== 'undefined' ? l.precioUnitario : null,
            cantidad: typeof l.cantidad !== 'undefined' ? l.cantidad : 1,
            _id: l._id ?? null,
          }))
        : [],
      diagnosticoCliente: payload.diagnosticoCliente ?? '',
      observaciones: payload.observaciones ?? '',
      fechaIngreso: payload.fechaIngreso ?? null,
      total: payload.total ?? 0,
    };
  }

  // ---------- API para componentes ----------
  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addLineaServicio = (linea = {}) =>
    setForm((prev) => ({
      ...prev,
      lineasServicio: [
        ...(prev.lineasServicio || []),
        {
          tipoTrabajo: linea.tipoTrabajo ?? null,
          descripcion: linea.descripcion ?? '',
          precioUnitario:
            typeof linea.precioUnitario !== 'undefined'
              ? linea.precioUnitario
              : null,
          cantidad: typeof linea.cantidad !== 'undefined' ? linea.cantidad : 1,
          _id: linea._id ?? null,
        },
      ],
    }));

  const updateLineaServicio = (index, changes) =>
    setForm((prev) => {
      const copy = [...(prev.lineasServicio || [])];
      copy[index] = { ...(copy[index] || {}), ...changes };
      return { ...prev, lineasServicio: copy };
    });

  const deleteLineaServicio = (index) =>
    setForm((prev) => {
      const copy = [...(prev.lineasServicio || [])];
      copy.splice(index, 1);
      return { ...prev, lineasServicio: copy };
    });

  const resetForm = (newPayload = null) =>
    setForm(newPayload ? normalizeInitialPayload(newPayload) : formInitial);

  const value = useMemo(
    () => ({
      form,
      setForm,
      setField,
      addLineaServicio,
      updateLineaServicio,
      deleteLineaServicio,
      resetForm,
    }),
    [form]
  );

  return (
    <FormIngresoContext.Provider value={value}>
      {children}
    </FormIngresoContext.Provider>
  );
}

export function useFormIngreso() {
  const ctx = useContext(FormIngresoContext);
  if (!ctx)
    throw new Error('useFormIngreso must be used within FormIngresoProvider');
  return ctx;
}
