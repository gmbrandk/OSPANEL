// src/hooks/form-ingreso/useAutocompleteEquipo.js
import { useEffect, useRef, useState } from 'react';
import { useEquipos } from '../../context/equiposContext';
import { normalizarEquipo } from '../../utils/normalizarEquipo';

const EMPTY_EQUIPO = normalizarEquipo({
  _id: null,
  nroSerie: '',
  marca: '',
  modelo: '',
  tipo: '',
  procesador: '',
  ram: '',
  almacenamiento: '',
});

/**
 * 🚀 Hook con normalización segura y sin loops infinitos
 */
export function useAutocompleteEquipo(initialData = null, minLength = 3) {
  const { equipos, buscarEquipos, buscarEquipoPorId } = useEquipos();

  const [query, setQuery] = useState(initialData?.nroSerie || '');
  const [selectedEquipo, setSelectedEquipo] = useState(
    initialData ? normalizarEquipo(initialData) : EMPTY_EQUIPO
  );

  const [isOpen, setIsOpen] = useState(false);
  const isSelecting = useRef(false);

  // ============================================================
  // 🟦 Sync external initialData → internal state (safe)
  // ============================================================
  useEffect(() => {
    if (!initialData) {
      setSelectedEquipo(EMPTY_EQUIPO);
      setQuery('');
      return;
    }

    const normalized = normalizarEquipo(initialData);

    // Evitar updates innecesarios (previene loops)
    setSelectedEquipo((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(normalized);
      return same ? prev : normalized;
    });

    setQuery(initialData.nroSerie || '');
  }, [initialData]);

  // ============================================================
  // 🔍 Debounced autocomplete search
  // ============================================================
  useEffect(() => {
    if (isSelecting.current) return;

    if (!query || query.trim().length < minLength) {
      // NO setSelectedEquipo aquí → produce loops si está llenado manual
      return;
    }

    const timeout = setTimeout(() => {
      buscarEquipos(query);
      setIsOpen(true);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, buscarEquipos, minLength]);

  // ============================================================
  // 🎯 Select an equipo and fetch full data (lookup)
  // ============================================================
  const seleccionarEquipo = async (equipoParcial) => {
    isSelecting.current = true;

    setQuery(equipoParcial.nroSerie || '');
    setIsOpen(false);

    const fullData = await buscarEquipoPorId(equipoParcial._id);
    const normalized = normalizarEquipo(fullData || equipoParcial);

    setSelectedEquipo((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(normalized);
      return same ? prev : normalized;
    });

    setTimeout(() => {
      isSelecting.current = false;
    }, 100);
  };

  // ============================================================
  // 🧩 UI Handlers
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
    resultados: equipos, // resultado real de la API
    selectedEquipo,
    seleccionarEquipo,
    isOpen,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    setSelectedEquipo,
  };
}
