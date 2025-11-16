import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAutosave } from '../utils/autoSave';

const LS_KEY = 'formIngresoAutosave_v3';
const EXPIRATION_MS = 3 * 60 * 60 * 1000; // 3h

const IngresoFormContext = createContext(null);

export function IngresoFormProvider({
  children,
  initialPayload = null,
  debug = true,
}) {
  const [loaded, setLoaded] = useState(false);

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

  const originalRef = useRef(null);

  // =====================================================================
  // 🔥 AUTOSAVE
  // =====================================================================
  const autosave = useAutosave({
    key: LS_KEY,
    value: { cliente, equipo, tecnico, orden, timestamp: Date.now() },
    enabled: loaded, // 🔥 saves ONLY after initial payload is mounted
  });

  // =====================================================================
  // 🔥 FIRST LOAD LOGIC: 100% BUG-FREE
  // =====================================================================
  useEffect(() => {
    if (loaded) return;

    if (initialPayload) {
      if (debug) console.log('%c[LOAD] initialPayload', 'color:#ffa500');
      loadPayload(initialPayload);
      setLoaded(true);
      return;
    }

    const saved = autosave.load();
    if (saved && Date.now() - saved.timestamp < EXPIRATION_MS) {
      if (debug) console.log('%c[LOAD] autosave restored', 'color:#4caf50');
      loadPayload(saved);
    }

    setLoaded(true);
  }, [initialPayload]);

  // =====================================================================
  // 🔎 Load Payload (backend OR autosave)
  // =====================================================================
  function loadPayload(data) {
    const normalizedOrden = {
      lineasServicio: normalizeLineas(
        data.orden?.lineasServicio ?? data.lineasServicio ?? []
      ),
      diagnosticoCliente: data.orden?.diagnosticoCliente ?? '',
      observaciones: data.orden?.observaciones ?? '',
      total: Number(data.orden?.total ?? 0),
      fechaIngreso: data.orden?.fechaIngreso ?? new Date().toISOString(),
    };

    setCliente(data.cliente ?? null);
    setEquipo(data.equipo ?? null);
    setTecnico(data.tecnico ?? null);
    setOrden(normalizedOrden);

    originalRef.current = {
      cliente: data.cliente ?? null,
      equipo: data.equipo ?? null,
      tecnico: data.tecnico ?? null,
      orden: normalizedOrden,
    };
  }

  function normalizeLineas(lineas) {
    return lineas.map((l) => ({
      tipoTrabajo: l.tipoTrabajo ?? null,
      descripcion: l.descripcion ?? '',
      precioUnitario: Number(l.precioUnitario ?? l.precio ?? 0),
      cantidad: Number(l.cantidad ?? 1),
    }));
  }

  // =====================================================================
  // 💰 TOTAL AUTOMÁTICO – sin loop infinito
  // =====================================================================
  useEffect(() => {
    if (!orden.lineasServicio) return;
    const total = orden.lineasServicio.reduce(
      (acc, l) => acc + l.precioUnitario * l.cantidad,
      0
    );

    if (total !== orden.total) {
      setOrden((prev) => ({ ...prev, total }));
    }
  }, [orden.lineasServicio]);

  // =====================================================================
  // 🎯 Cambios visuales
  // =====================================================================
  const isLineaModificada = (index) => {
    const orig = originalRef.current?.orden?.lineasServicio?.[index];
    const now = orden.lineasServicio[index];
    if (!orig) return true;
    return (
      orig.descripcion !== now.descripcion ||
      orig.precioUnitario !== now.precioUnitario ||
      orig.cantidad !== now.cantidad ||
      JSON.stringify(orig.tipoTrabajo) !== JSON.stringify(now.tipoTrabajo)
    );
  };

  // =====================================================================
  // 📤 Payload a enviar
  // =====================================================================
  const getFullPayload = () => ({
    cliente,
    equipo,
    tecnico,
    orden,
  });

  const clearAutosave = () => {
    autosave.clear();
    if (debug) console.log('%c[Autosave cleared]', 'color:red');
  };

  const resetLinea = (index) => {
    const orig = originalRef.current?.orden?.lineasServicio?.[index];
    setOrden((prev) => {
      const o = [...prev.lineasServicio];
      o[index] = JSON.parse(JSON.stringify(orig));
      return { ...prev, lineasServicio: o };
    });
  };
  return (
    <IngresoFormContext.Provider
      value={{
        cliente,
        setCliente,
        equipo,
        setEquipo,
        tecnico,
        setTecnico,
        orden,
        setOrden,
        getFullPayload,
        clearAutosave,
        resetLinea,
        isLineaModificada, // ⬅️ ahora SÍ está expuesto
        loaded,
      }}
    >
      {children}
    </IngresoFormContext.Provider>
  );
}

export const useIngresoForm = () => useContext(IngresoFormContext);
