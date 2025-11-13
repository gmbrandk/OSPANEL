export function normalizeOrdenPayload(backendData) {
  const { representante, equipo, tecnico, lineasServicio, ...rest } =
    backendData;

  return {
    cliente: representante,
    equipo,
    tecnico,
    orden: {
      diagnosticoCliente: rest.diagnosticoCliente || '',
      observaciones: rest.observaciones || '',
      fechaIngreso: rest.fechaIngreso,
      total: rest.total || 0,
      lineasServicio: lineasServicio.map((l) => ({
        tipoTrabajo: l.tipoTrabajo,
        descripcion: l.descripcion,
        precioUnitario: l.precioUnitario,
        cantidad: l.cantidad,
      })),
    },
  };
}
