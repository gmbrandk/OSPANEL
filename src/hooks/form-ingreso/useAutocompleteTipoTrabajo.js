import { useEffect, useMemo, useRef, useState } from 'react';
import { tiposTrabajoMock } from '../../__mock__/form-ingreso';
import { log } from '../../utils/log';

export function useAutocompleteTipoTrabajo(initialValue = null) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);
  const [forceShowAll, setForceShowAll] = useState(false);

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
    const q = (query ?? '').trim().toLowerCase();
    if (!q) return tiposTrabajoMock; // SELECT puro si no hay texto

    const score = (item) => {
      const name = item.nombre.toLowerCase();

      if (name === q) return 100; // exact
      if (name.startsWith(q)) return 80; // prefix
      if (name.includes(q)) return 40; // contains
      return 0; // no match (still included)
    };

    return [...tiposTrabajoMock] // ← clone to avoid mutating data
      .map((item) => ({
        item,
        score: score(item),
      }))
      .sort((a, b) => b.score - a.score) // primary: score
      .map((x) => x.item);
  }, [query]);

  // API
  const abrirResultados = () => {
    setIsOpen(true);
    setForceShowAll(true); // 👈 SELECT BEHAVIOR
  };

  const cerrarResultados = () => {
    setIsOpen(false);
    setForceShowAll(false); // 👈 vuelve a modo normal
  };

  const onChange = (value) => {
    setQuery(value);
    setSelectedTrabajo(null);
    setForceShowAll(false); // 👈 si escribe, vuelve a filtrar
    abrirResultados();

    log('AUTO-TIPO', 'Usuario escribe', value);
  };

  const seleccionarTrabajo = (trabajo) => {
    log('AUTO-TIPO', 'Seleccionado', trabajo);
    setSelectedTrabajo(trabajo);
    setQuery(trabajo.nombre);
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
