// src/hooks/form-ingreso/useAutocompleteTecnico.js
import { useEffect, useRef, useState } from 'react';
import { useTecnicos } from '../../context/TecnicosContext';
import { normalizarTecnico } from '../../utils/normalizarTecnico';

const EMPTY_TECNICO = normalizarTecnico({
  _id: null,
  nombres: '',
  apellidos: '',
  nombreCompleto: '',
  especialidad: '',
});

/**
 * 🔥 Autocomplete PRO para Técnicos
 * - Normalización robusta
 * - Manejo inteligente de initialValue
 * - Prevención de loops
 * - Debounce en búsquedas
 * - Lookup por ID para obtener datos completos
 */
export function useAutocompleteTecnico(initialValue = null, minLength = 2) {
  const { tecnicos, buscarTecnicos, buscarTecnicoPorId } = useTecnicos();

  const [query, setQuery] = useState('');
  const [selectedTecnico, setSelectedTecnico] = useState(EMPTY_TECNICO);
  const [isOpen, setIsOpen] = useState(false);

  const isSelecting = useRef(false);

  // ============================================================
  // 🟦 Sincronizar initialValue → estado interno (sin loops)
  // ============================================================
  useEffect(() => {
    if (!initialValue) {
      setSelectedTecnico(EMPTY_TECNICO);
      setQuery('');
      return;
    }

    const normalized = normalizarTecnico(initialValue);

    setSelectedTecnico((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(normalized);
      return same ? prev : normalized;
    });

    setQuery(normalized.nombreCompleto || '');
  }, [initialValue]);

  // ============================================================
  // 🔍 Debounced búsqueda inteligente
  // ============================================================
  useEffect(() => {
    if (isSelecting.current) return;

    if (!query || query.trim().length < minLength) return;

    const timeout = setTimeout(() => {
      buscarTecnicos(query.trim());
      setIsOpen(true);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, buscarTecnicos, minLength]);

  // ============================================================
  // 🎯 Seleccionar técnico y obtener datos completos (lookup)
  // ============================================================
  const seleccionarTecnico = async (tParcial) => {
    isSelecting.current = true;

    setQuery(tParcial.nombreCompleto || '');
    setIsOpen(false);

    const fullData = await buscarTecnicoPorId(tParcial._id);

    const normalized = normalizarTecnico(fullData || tParcial);

    setSelectedTecnico((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(normalized);
      return same ? prev : normalized;
    });

    setTimeout(() => {
      isSelecting.current = false;
    }, 100);
  };

  // ============================================================
  // 🧩 Handlers UI
  // ============================================================
  const onQueryChange = (value) => {
    setQuery(value);
    setIsOpen(true);
  };

  const abrirResultados = () => setIsOpen(true);

  const cerrarResultados = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  return {
    query,
    resultados: tecnicos, // resultados reales (API o mock)
    selectedTecnico,
    seleccionarTecnico,
    isOpen,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    setSelectedTecnico,
  };
}
