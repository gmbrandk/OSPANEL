// src/hooks/form-ingreso/useAutocompleteEquipo.js
import { useEffect, useMemo, useState } from 'react';
import { equiposMock } from '../../__mock__/form-ingreso';

export function useAutocompleteEquipo(initialData = null) {
  const [query, setQuery] = useState(initialData?.nroSerie || '');
  const [selectedEquipo, setSelectedEquipo] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);

  const todosLosEquipos = equiposMock;

  // 🔄 Si cambia initialData, sincronizar
  useEffect(() => {
    if (initialData) {
      setSelectedEquipo(initialData);
      setQuery(initialData.nroSerie || '');
    }
  }, [initialData]);

  const resultados = useMemo(() => {
    const q = query.toLowerCase();
    if (!q.trim()) return [];
    return equiposMock.filter(
      (e) =>
        e.nroSerie.toLowerCase().includes(q) ||
        e.marca.toLowerCase().includes(q) ||
        e.modelo.toLowerCase().includes(q)
    );
  }, [query]);

  const onQueryChange = (value) => {
    setQuery(value);
    setIsOpen(true);
  };

  const seleccionarEquipo = (equipo) => {
    setSelectedEquipo(equipo);
    setQuery(equipo.nroSerie);
    setIsOpen(false);
  };

  const abrirResultados = () => setIsOpen(true);
  const cerrarResultados = () => setTimeout(() => setIsOpen(false), 150);

  return {
    query,
    resultados,
    todosLosEquipos,
    selectedEquipo,
    seleccionarEquipo,
    isOpen,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    setSelectedEquipo,
  };
}
