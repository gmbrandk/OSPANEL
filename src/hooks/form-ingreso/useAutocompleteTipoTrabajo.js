import { useEffect, useMemo, useRef, useState } from 'react';
import { tiposTrabajoMock } from '../../__mock__/form-ingreso';
import { log } from '../../utils/log';

export function useAutocompleteTipoTrabajo(initialValue = null) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);

  const initializedRef = useRef(false);

  // ============================================================
  // 🔄 Inicialización desde props / backend
  // ============================================================
  useEffect(() => {
    if (initializedRef.current) return; // evitamos loops
    if (!initialValue) return;

    initializedRef.current = true;

    log('AUTO-TIPO', 'Inicializando desde initialValue', initialValue);

    // Caso: objeto completo
    if (typeof initialValue === 'object' && initialValue.nombre) {
      setSelectedTrabajo(initialValue);
      setQuery(initialValue.nombre);
      log('AUTO-TIPO', 'Inicializado con objeto', initialValue);
      return;
    }

    // Caso: string
    if (typeof initialValue === 'string') {
      const lower = initialValue.trim().toLowerCase();
      const found = tiposTrabajoMock.find(
        (t) => t.nombre.trim().toLowerCase() === lower
      );

      if (found) {
        log('AUTO-TIPO', 'Inicializado con string que coincide', found);
        setSelectedTrabajo(found);
        setQuery(found.nombre);
      } else {
        log('AUTO-TIPO', 'Inicializado con string libre', initialValue);
        setSelectedTrabajo(null);
        setQuery(initialValue);
      }
    }
  }, [initialValue]);

  // ============================================================
  // ✨ CRÍTICO: SINCRONIZAR query <--> selectedTrabajo
  // ============================================================
  useEffect(() => {
    if (!selectedTrabajo) return;
    if (!selectedTrabajo.nombre) return;

    log('AUTO-TIPO', 'Sync query <- selectedTrabajo', {
      nombre: selectedTrabajo.nombre,
    });

    setQuery(selectedTrabajo.nombre);
  }, [selectedTrabajo]);

  // ============================================================
  // 🔍 Filtrado
  // ============================================================
  const resultados = useMemo(() => {
    const q = (query ?? '').trim().toLowerCase(); // FIX anti crash

    if (!q) {
      log('AUTO-TIPO', 'Query vacía → todos los resultados');
      return tiposTrabajoMock;
    }

    const res = tiposTrabajoMock.filter((t) => {
      const nombre = t.nombre?.toLowerCase() ?? '';
      const cat = t.categoria?.toLowerCase() ?? '';
      const desc = t.descripcion?.toLowerCase() ?? '';

      return nombre.includes(q) || cat.includes(q) || desc.includes(q);
    });

    log('AUTO-TIPO', `Filtro q="${q}" → ${res.length} resultados`);
    return res;
  }, [query]);

  // ============================================================
  // 🧭 API expuesta
  // ============================================================
  const abrirResultados = () => setIsOpen(true);
  const cerrarResultados = () => setIsOpen(false);

  const onChange = (value) => {
    setQuery(value);
    setSelectedTrabajo(null);
    abrirResultados();

    log('AUTO-TIPO', 'Usuario escribe', value);
  };

  const seleccionarTrabajo = (trabajo) => {
    log('AUTO-TIPO', 'Seleccionado', trabajo);
    setSelectedTrabajo(trabajo);
    setQuery(trabajo.nombre); // ← sincroniza inmediatamente
    cerrarResultados();
  };

  return {
    query,
    resultados,
    isOpen,
    selectedTrabajo,
    onChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTrabajo,
  };
}
