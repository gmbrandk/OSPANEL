import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAutosave } from '../hooks/useAutosave';
import { log } from '../utils/log';

const LS_KEY = 'formIngresoAutosave_v3';
const EXPIRATION_MS = 3 * 60 * 60 * 1000; // 3 horas

const IngresoFormContext = createContext(null);

export function IngresoFormProvider({ children, initialPayload = null }) {
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
  const initialLoadDoneRef = useRef(false);

  const [persistEnabled, setPersistEnabled] = useState(true); // ← 🔥 Nuevo

  const autosaveValue = useMemo(() => {
    return { cliente, equipo, tecnico, orden };
  }, [cliente, equipo, tecnico, orden]);

  const autosaveReady = initialLoadDoneRef.current;

  const autosave = useAutosave({
    key: LS_KEY,
    value: autosaveValue,
    enabled: persistEnabled && autosaveReady, // ← 🔥 Control real
    delay: 300,
    skipInitialSave: true,
  });

  useEffect(() => {
    log('PROVIDER:LOAD', 'montando Provider → iniciando secuencia inicial');

    if (loaded) {
      log('PROVIDER:LOAD', 'loaded ya estaba en true → saltando carga');
      return;
    }

    const apply = (data) => {
      log('PROVIDER:LOAD', 'aplicando payload (loadPayload)', data);
      loadPayload(data);
    };

    // Si existe autosave válido → usarlo primero
    const saved = autosave.load();
    if (saved && Date.now() - saved.timestamp < EXPIRATION_MS) {
      log(
        'PROVIDER:LOAD',
        'autosave restaurado → prioridad sobre initialPayload'
      );
      apply(saved);
    } else if (initialPayload) {
      log('PROVIDER:LOAD', 'initialPayload aplicado (no hay autosave)');
      apply(initialPayload);
    } else {
      log('PROVIDER:LOAD', 'sin autosave ni initialPayload');
    }

    setLoaded(true);
    autosave.markReady();
    initialLoadDoneRef.current = true;
  }, []);

  function loadPayload(data) {
    if (!data) return;

    const ficha = data.equipo?.fichaTecnicaManual;

    const normalizedEquipo = ficha
      ? {
          ...data.equipo,
          procesador: ficha.cpu ?? '',
          ram: ficha.ram ?? '',
          almacenamiento: ficha.almacenamiento ?? '',
          gpu: ficha.gpu ?? '',
        }
      : data.equipo ?? null; // <-- mantiene compatibilidad con versiones anteriores

    const normalizedOrden = {
      lineasServicio: normalizeLineas(
        data.orden?.lineasServicio ?? data.lineasServicio ?? []
      ),
      diagnosticoCliente:
        data.orden?.diagnosticoCliente ?? data.diagnosticoCliente ?? '',
      observaciones: data.orden?.observaciones ?? data.observaciones ?? '',
      total: Number(data.orden?.total ?? data.total ?? 0),
      fechaIngreso:
        data.orden?.fechaIngreso ??
        data.fechaIngreso ??
        new Date().toISOString(),
    };

    setCliente(data.cliente ?? null);
    setEquipo(normalizedEquipo);
    setTecnico(data.tecnico ?? null);
    setOrden(normalizedOrden);

    originalRef.current = {
      cliente: data.cliente ?? null,
      equipo: normalizedEquipo,
      tecnico: data.tecnico ?? null,
      orden: normalizedOrden,
    };
  }

  function normalizeLineas(lineas) {
    return (lineas || []).map((l) => ({
      tipoTrabajo: l.tipoTrabajo ?? null,
      descripcion: l.descripcion ?? '',
      precioUnitario: Number(l.precioUnitario ?? l.precio ?? 0),
      cantidad: Number(l.cantidad ?? 1),
    }));
  }

  useEffect(() => {
    if (!orden.lineasServicio) return;

    const total = orden.lineasServicio.reduce(
      (acc, l) =>
        acc + (Number(l.precioUnitario) || 0) * (Number(l.cantidad) || 0),
      0
    );

    if (total !== orden.total) {
      setOrden((prev) => ({ ...prev, total }));
    }
  }, [orden.lineasServicio]);

  const addLinea = () => {
    setOrden((prev) => ({
      ...prev,
      lineasServicio: [
        ...prev.lineasServicio,
        {
          descripcion: '',
          precioUnitario: 0,
          cantidad: 1,
          tipoTrabajo: null,
        },
      ],
    }));
  };

  const deleteLinea = (index) => {
    setOrden((prev) => ({
      ...prev,
      lineasServicio: prev.lineasServicio.filter((_, i) => i !== index),
    }));
  };

  const updateLinea = (index, patchOrFn) =>
    setOrden((prev) => {
      const lineas = [...prev.lineasServicio];
      const current = lineas[index];
      const next =
        typeof patchOrFn === 'function'
          ? patchOrFn(current)
          : { ...current, ...patchOrFn };

      if (JSON.stringify(current) === JSON.stringify(next)) return prev;

      lineas[index] = next;
      return { ...prev, lineasServicio: lineas };
    });

  const resetLinea = (index) => {
    const orig = originalRef.current?.orden?.lineasServicio?.[index];
    if (!orig) return;
    updateLinea(index, orig);
  };

  const isLineaModificada = (index) => {
    const orig = originalRef.current?.orden?.lineasServicio?.[index];
    const now = orden.lineasServicio[index];
    if (!orig && !now) return false;
    if (!orig && now) return true;
    if (!now) return true;

    return (
      orig.descripcion !== now.descripcion ||
      Number(orig.precioUnitario) !== Number(now.precioUnitario) ||
      Number(orig.cantidad) !== Number(now.cantidad) ||
      JSON.stringify(orig.tipoTrabajo) !== JSON.stringify(now.tipoTrabajo)
    );
  };

  const getFullPayload = () => ({
    cliente,
    equipo,
    tecnico,
    orden,
  });

  const clearAutosave = () => {
    autosave.clear();
    log('PROVIDER:AUTOSAVE', 'autosave limpiado manualmente');
  };

  const submitAndClear = () => {
    autosave.clear();
    log('PROVIDER:AUTOSAVE', 'autosave limpiado después de submit');
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

        addLinea,
        deleteLinea,
        updateLinea,
        resetLinea,

        getFullPayload,
        isLineaModificada,
        clearAutosave,
        submitAndClear, // ← Nuevo

        persistEnabled, // ← Nuevo
        setPersistEnabled, // ← Nuevo

        loaded,
        autosave,
        autosaveReady,
      }}
    >
      {children}
    </IngresoFormContext.Provider>
  );
}

export const useIngresoForm = () => useContext(IngresoFormContext);
