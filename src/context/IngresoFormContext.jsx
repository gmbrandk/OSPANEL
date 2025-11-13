import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const IngresoFormContext = createContext(null);

export function IngresoFormProvider({ children, initialPayload = null }) {
  const [cliente, setCliente] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [tecnico, setTecnico] = useState(null);
  const [orden, setOrden] = useState({
    lineasServicio: [],
    diagnosticoCliente: '',
    observaciones: '',
    total: 0,
    fechaIngreso: new Date().toISOString(),
  });

  // ==== Normalización del initialPayload (acepta varias formas) ====
  useEffect(() => {
    if (!initialPayload) return;

    // soporte para payloads que vengan con keys: cliente / equipo / tecnico / orden
    // o con keys: representante / equipo / tecnico / lineasServicio (backend-style)
    const clienteObj =
      initialPayload.cliente || initialPayload.representante || null;
    const equipoObj = initialPayload.equipo || initialPayload.equipoId || null;
    const tecnicoObj =
      initialPayload.tecnico || initialPayload.tecnicoId || null;

    // Construir lineas de orden defensivamente
    let lineas = [];
    if (initialPayload.orden?.lineasServicio) {
      lineas = initialPayload.orden.lineasServicio;
    } else if (initialPayload.lineasServicio) {
      lineas = initialPayload.lineasServicio;
    } else if (initialPayload.orden && Array.isArray(initialPayload.orden)) {
      lineas = initialPayload.orden;
    }

    // Normalizar cada línea (tipoTrabajo puede ser objeto o id)
    const normalizedLineas = (lineas || []).map((l) => ({
      tipoTrabajo:
        l.tipoTrabajo && typeof l.tipoTrabajo === 'object'
          ? l.tipoTrabajo
          : l.tipoTrabajo,
      descripcion: l.descripcion ?? l.descripcion ?? '',
      precioUnitario: l.precioUnitario ?? l.precio ?? 0,
      cantidad: l.cantidad ?? 1,
    }));

    setCliente(clienteObj);
    setEquipo(equipoObj);
    setTecnico(tecnicoObj);

    setOrden({
      lineasServicio: normalizedLineas,
      diagnosticoCliente:
        initialPayload.orden?.diagnosticoCliente ??
        initialPayload.diagnosticoCliente ??
        '',
      observaciones:
        initialPayload.orden?.observaciones ??
        initialPayload.observaciones ??
        '',
      total: initialPayload.orden?.total ?? initialPayload.total ?? 0,
      fechaIngreso:
        initialPayload.orden?.fechaIngreso ??
        initialPayload.fechaIngreso ??
        new Date().toISOString(),
    });
  }, [initialPayload]);

  // ==== getFullPayload: convierte el estado del form al formato backend-ready ====
  const getFullPayload = useMemo(() => {
    return () => {
      const lineasServicio = (orden.lineasServicio || []).map((l) => ({
        // si tipoTrabajo es objeto, tomar su _id, si es string tomarlo tal cual
        tipoTrabajo:
          l.tipoTrabajo && typeof l.tipoTrabajo === 'object'
            ? l.tipoTrabajo._id || l.tipoTrabajo.id
            : l.tipoTrabajo,
        descripcion: l.descripcion ?? '',
        precioUnitario: Number(l.precioUnitario ?? l.precio ?? 0),
        cantidad: Number(l.cantidad ?? 1),
      }));

      const totalFromLines = lineasServicio.reduce(
        (sum, ln) => sum + ln.precioUnitario * ln.cantidad,
        0
      );

      return {
        representanteId: cliente?._id || cliente?.id || null,
        equipoId: equipo?._id || equipo?.id || null,
        tecnico: tecnico?._id || tecnico?.id || tecnico || null,
        lineasServicio,
        total: orden.total ?? totalFromLines,
        fechaIngreso: orden.fechaIngreso ?? new Date().toISOString(),
        diagnosticoCliente: orden.diagnosticoCliente ?? '',
        observaciones: orden.observaciones ?? '',
      };
    };
  }, [cliente, equipo, tecnico, orden]);

  const contextValue = {
    cliente,
    setCliente,
    equipo,
    setEquipo,
    tecnico,
    setTecnico,
    orden,
    setOrden,
    getFullPayload, // nombre usado en el form
  };

  return (
    <IngresoFormContext.Provider value={contextValue}>
      {children}
    </IngresoFormContext.Provider>
  );
}

export const useIngresoForm = () => useContext(IngresoFormContext);
