// util para totales y para normalizar payload antes de envío
export function calcularTotal(lineas = []) {
  if (!Array.isArray(lineas)) return 0;
  return lineas.reduce((acc, l) => {
    const precio = Number(l.precioUnitario) || 0;
    const cantidad = Number(l.cantidad) || 1;
    return acc + precio * cantidad;
  }, 0);
}

/**
 * Normaliza el payload listo para enviar al backend.
 * - Convierte tipoTrabajo a _id cuando sea posible.
 * - Asegura campos mínimos
 */
export function getPayloadOS(form) {
  return {
    representante: form.representante,
    equipo: form.equipo,
    tecnico: form.tecnico,
    lineasServicio: (form.lineasServicio || []).map((l) => {
      // si tipoTrabajo es objeto con _id prefierelo, si es string lo dejamos como nombre
      const tipoTrabajoId =
        l.tipoTrabajo && typeof l.tipoTrabajo === 'object'
          ? l.tipoTrabajo._id ?? null
          : null;

      return {
        tipoTrabajo: tipoTrabajoId ? { _id: tipoTrabajoId } : l.tipoTrabajo,
        descripcion: l.descripcion ?? '',
        precioUnitario:
          typeof l.precioUnitario !== 'undefined' ? l.precioUnitario : null,
        cantidad: typeof l.cantidad !== 'undefined' ? l.cantidad : 1,
        _id: l._id ?? null,
      };
    }),
    diagnosticoCliente: form.diagnosticoCliente,
    observaciones: form.observaciones,
    fechaIngreso: form.fechaIngreso,
    total: calcularTotal(form.lineasServicio),
  };
}
