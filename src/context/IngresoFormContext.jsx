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

// 🔥 IMPORTAR LOS CONTEXT NECESARIOS
import { useClientes } from '../context/clientesContext';
import { useEquipos } from '../context/equiposContext';
import { useTecnicos } from '../context/tecnicosContext';
import { useTiposTrabajo } from '../context/tiposTrabajoContext';

const LS_KEY = 'formIngresoAutosave_v3';
const LS_PERSIST = 'formPersistEnabled_v1';
const EXPIRATION_MS = 3 * 60 * 60 * 1000; // 3 horas

const IngresoFormContext = createContext(null);

export function IngresoFormProvider({ children, initialPayload = null }) {
  // Lookup providers
  const { buscarClientePorId } = useClientes();
  const { buscarEquipoPorId } = useEquipos();
  const { buscarTecnicoPorId } = useTecnicos();
  const { buscarTipoTrabajoPorId } = useTiposTrabajo();

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

  // ==========================================================
  //  🔥 persistEnabled con soporte real de LocalStorage
  // ==========================================================
  const [persistEnabled, setPersistEnabled] = useState(() => {
    const saved = localStorage.getItem(LS_PERSIST);
    return saved ? saved === 'true' : true; // por default ON
  });

  useEffect(() => {
    localStorage.setItem(LS_PERSIST, persistEnabled);
  }, [persistEnabled]);

  const autosaveValue = useMemo(() => {
    return { cliente, equipo, tecnico, orden };
  }, [cliente, equipo, tecnico, orden]);

  const autosaveReady = initialLoadDoneRef.current;

  const autosave = useAutosave({
    key: LS_KEY,
    value: autosaveValue,
    enabled: persistEnabled && autosaveReady,
    delay: 300,
    skipInitialSave: true,
  });

  // ============================================================
  // 🔄 CARGA INICIAL (autosave o initialPayload)
  // ============================================================
  useEffect(() => {
    if (loaded) return;

    log('PROVIDER:LOAD', 'montando Provider → iniciando secuencia inicial');

    const apply = (data) => {
      log('PROVIDER:LOAD', 'aplicando payload (loadPayload)', data);
      loadPayload(data);
    };

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

  function extractRecord(res, label = 'UNKNOWN') {
    console.group(`🟦 extractRecord(${label})`);

    console.log('📥 RAW response:', res);

    let final = null;

    if (!res) {
      console.warn('❌ No response');
      console.groupEnd();
      return null;
    }

    // Caso: backend tipo { data: {...} }
    if (res.data && typeof res.data === 'object' && !res.details) {
      console.log('➡️ Extracted from res.data');
      final = res.data;
      console.log('📤 FINAL:', final);
      console.groupEnd();
      return final;
    }

    // Caso: backend tipo { success, details }
    if (res.details) {
      const values = Object.values(res.details);
      if (values.length === 1 && values[0]?._id) {
        console.log('➡️ Extracted from res.details.<entity>');
        final = values[0];
        console.log('📤 FINAL:', final);
        console.groupEnd();
        return final;
      }
    }

    // Ya es un objeto directo
    if (res._id) {
      console.log('➡️ Passed-through raw object');
      final = res;
      console.log('📤 FINAL:', final);
      console.groupEnd();
      return final;
    }

    console.warn('⚠️ NO MATCHING FORMAT, returning null');
    console.groupEnd();
    return null;
  }

  // ============================================================
  // 🔥 RESOLVE + NORMALIZE PAYLOAD
  // ============================================================
  async function loadPayload(data) {
    console.group('🔥 loadPayload INIT');
    console.log('📥 Incoming payload:', data);

    // -------------------------------------------
    // 1) Cliente
    // -------------------------------------------
    let clienteObj = null;

    if (data.representanteId) {
      console.log('🔍 Fetching CLIENTE by ID:', data.representanteId);
      const raw = await buscarClientePorId(data.representanteId);
      console.log('📥 Cliente lookup RAW:', raw);
      clienteObj = extractRecord(raw, 'cliente');
    } else if (data.cliente?._id) {
      console.log('🔍 Using direct cliente object');
      clienteObj = extractRecord(data.cliente, 'cliente-direct');
    }

    console.log('✔ Cliente FINAL:', clienteObj);

    // -------------------------------------------
    // 2) Equipo
    // -------------------------------------------
    let equipoObj = null;

    if (data.equipoId) {
      console.log('🔍 Fetching EQUIPO by ID:', data.equipoId);
      const raw = await buscarEquipoPorId(data.equipoId);
      console.log('📥 Equipo lookup RAW:', raw);
      equipoObj = extractRecord(raw, 'equipo');
    } else if (data.equipo?._id) {
      console.log('🔍 Using direct equipo object');
      equipoObj = extractRecord(data.equipo, 'equipo-direct');
    }

    console.log('✔ Equipo FIRST PASS:', equipoObj);

    // Normalizar ficha técnica
    const ficha = equipoObj?.fichaTecnicaManual;
    const normalizedEquipo = ficha
      ? {
          ...equipoObj,
          procesador: ficha.cpu ?? '',
          ram: ficha.ram ?? '',
          almacenamiento: ficha.almacenamiento ?? '',
          gpu: ficha.gpu ?? '',
        }
      : equipoObj;

    console.log('✔ Equipo FINAL:', normalizedEquipo);

    // -------------------------------------------
    // 3) Técnico
    // -------------------------------------------
    let tecnicoObj = null;

    if (data.tecnico) {
      console.log('🔍 Fetching TÉCNICO by ID:', data.tecnico);
      const raw = await buscarTecnicoPorId(data.tecnico);
      console.log('📥 Técnico lookup RAW:', raw);
      tecnicoObj = extractRecord(raw, 'tecnico');
    }

    console.log('✔ Técnico FINAL:', tecnicoObj);

    // -------------------------------------------
    // 4) Lineas Servicio
    // -------------------------------------------
    console.group('📑 Resolviendo líneas de servicio');

    const lineasServicio = await Promise.all(
      (data.lineasServicio ?? data.orden?.lineasServicio ?? []).map(
        async (l, i) => {
          console.group(`➡️ Línea ${i}`);
          console.log('RAW line:', l);

          let tipoTrabajoObj = null;

          // 🚨 LOG 1: qué viene originalmente
          console.log(`🟡 [${i}] tipoTrabajo ORIGINAL:`, l.tipoTrabajo);
          console.log(`🟡 [${i}] typeof tipoTrabajo:`, typeof l.tipoTrabajo);

          // ----------------------------------------------------
          // 🔍 Normalizar ID
          // ----------------------------------------------------
          const tipoTrabajoId =
            typeof l.tipoTrabajo === 'string'
              ? l.tipoTrabajo
              : l.tipoTrabajo?._id;

          // 🚨 LOG 2: después de intentar extraer ID
          console.log(`🟠 [${i}] tipoTrabajoId EXTRAÍDO:`, tipoTrabajoId);

          if (!tipoTrabajoId) {
            console.warn(
              `🔴 [${i}] NO SE PUDO EXTRAER UN ID VÁLIDO de tipoTrabajo:`,
              l.tipoTrabajo
            );
          }

          // ----------------------------------------------------
          // 🔥 Lookup real
          // ----------------------------------------------------
          if (tipoTrabajoId) {
            console.log(
              `🔍 [${i}] Llamando buscarTipoTrabajoPorId(${tipoTrabajoId})`
            );

            const raw = await buscarTipoTrabajoPorId(tipoTrabajoId);

            // 🚨 LOG 3: respuesta cruda
            console.log(`📥 [${i}] Lookup RAW result:`, raw);

            tipoTrabajoObj = extractRecord(raw, `tipoTrabajo-${i}`);

            // 🚨 LOG 4: qué devolvió extractRecord
            console.log(`📘 [${i}] extractRecord →`, tipoTrabajoObj);
          }

          // ----------------------------------------------------
          // 🧩 Construir línea final
          // ----------------------------------------------------
          const final = {
            ...l,
            tipoTrabajo: tipoTrabajoObj,
            precioUnitario: Number(l.precioUnitario ?? l.precio ?? 0),
            cantidad: Number(l.cantidad ?? 1),
          };

          // 🚨 LOG 5: línea final
          console.log(`✔ [${i}] Línea FINAL:`, final);

          console.groupEnd();
          return final;
        }
      )
    );

    console.groupEnd();

    // -------------------------------------------
    // 5) Orden
    // -------------------------------------------
    const normalizedOrden = {
      lineasServicio,
      diagnosticoCliente:
        data.diagnosticoCliente ?? data.orden?.diagnosticoCliente ?? '',
      observaciones: data.observaciones ?? data.orden?.observaciones ?? '',
      total: Number(data.total ?? data.orden?.total ?? 0),
      fechaIngreso:
        data.fechaIngreso ??
        data.orden?.fechaIngreso ??
        new Date().toISOString(),
    };

    console.log('✔ ORDEN FINAL:', normalizedOrden);

    // -------------------------------------------
    // 6) Set States
    // -------------------------------------------
    console.log('📌 SETTING STATES…');

    setCliente(clienteObj);
    setEquipo(normalizedEquipo);
    setTecnico(tecnicoObj);
    setOrden(normalizedOrden);

    // Guardar snapshot inicial
    originalRef.current = {
      cliente: clienteObj,
      equipo: normalizedEquipo,
      tecnico: tecnicoObj,
      orden: normalizedOrden,
    };

    console.groupEnd();
  }

  // ============================================================
  // 🧮 Recalcular total cuando cambien lineas
  // ============================================================
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

  // ============================================================
  // 🔧 Helpers para líneas
  // ============================================================
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

  // ============================================================
  // Misc
  // ============================================================
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

  // ============================================================
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
        submitAndClear,

        persistEnabled,
        setPersistEnabled,

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
