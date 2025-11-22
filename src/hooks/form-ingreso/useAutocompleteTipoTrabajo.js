import { useEffect, useMemo, useRef, useState } from 'react';

import { useTiposTrabajo } from '../../context/tiposTrabajoContext';
import { log } from '../../utils/log';

export function useAutocompleteTipoTrabajo(initialValue = null) {
  const { tiposTrabajo } = useTiposTrabajo(); // ← datos del backend

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);
  const [forceShowAll, setForceShowAll] = useState(false);

  const initializedRef = useRef(false);

  // ======================
  // Inicialización
  // ======================
  useEffect(() => {
    if (!tiposTrabajo || tiposTrabajo.length === 0) return;

    if (initializedRef.current) return;
    if (!initialValue) return;

    initializedRef.current = true;
    log('AUTO-TIPO', 'Inicializando desde initialValue', initialValue);

    if (typeof initialValue === 'object' && initialValue.nombre) {
      setSelectedTrabajo(initialValue);
      setQuery(initialValue.nombre);
      return;
    }

    if (typeof initialValue === 'string') {
      const lower = initialValue.trim().toLowerCase();

      const found = tiposTrabajo.find(
        (t) => t.nombre.trim().toLowerCase() === lower
      );

      if (found) {
        setSelectedTrabajo(found);
        setQuery(found.nombre);
      } else {
        setSelectedTrabajo(null);
        setQuery(initialValue);
      }
    }
  }, [initialValue, tiposTrabajo]);

  // ======================
  // Sincronización query
  // ======================
  useEffect(() => {
    if (!selectedTrabajo) return;
    setQuery(selectedTrabajo.nombre);
  }, [selectedTrabajo]);

  // ======================
  // Filtrado
  // ======================
  const resultados = useMemo(() => {
    if (!tiposTrabajo) return [];

    const q = (query ?? '').trim().toLowerCase();

    if (!q) return tiposTrabajo;

    const score = (item) => {
      const name = item.nombre.toLowerCase();

      if (name === q) return 100;
      if (name.startsWith(q)) return 80;
      if (name.includes(q)) return 40;
      return 0;
    };

    return [...tiposTrabajo]
      .map((item) => ({
        item,
        score: score(item),
      }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  }, [query, tiposTrabajo]);

  // API
  const abrirResultados = () => {
    setIsOpen(true);
    setForceShowAll(true);
  };

  const cerrarResultados = () => {
    setIsOpen(false);
    setForceShowAll(false);
  };

  const onChange = (value) => {
    setQuery(value);
    setSelectedTrabajo(null);
    setForceShowAll(false);
    abrirResultados();
  };

  const seleccionarTrabajo = (trabajo) => {
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
