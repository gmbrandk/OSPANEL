// src/utils/buildOrdenPayload.js
export function buildOrdenPayload(formState = {}) {
  const { cliente = {}, equipo = {}, tecnico = {}, orden = {} } = formState;

  const {
    lineasServicio = [],
    total = 0,
    fechaIngreso = new Date().toISOString(),
    diagnosticoCliente = '',
    observaciones = '',
  } = orden;

  return {
    representanteId: cliente?._id || null,
    equipoId: equipo?._id || null,
    tecnico: tecnico?._id || null,
    lineasServicio: lineasServicio.map((l) => ({
      tipoTrabajo:
        typeof l.tipoTrabajo === 'object' ? l.tipoTrabajo._id : l.tipoTrabajo,
      descripcion: l.descripcion || '',
      precioUnitario: Number(l.precioUnitario) || 0,
      cantidad: Number(l.cantidad) || 1,
    })),
    total: Number(total),
    fechaIngreso,
    diagnosticoCliente,
    observaciones,
  };
}
