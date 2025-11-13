// src/hooks/form-ingreso/useAutocompleteTecnico.js
import { useEffect, useMemo, useState } from 'react';
import { tecnicosMock } from '../../__mock__/form-ingreso';

export function useAutocompleteTecnico(initialData = null) {
  const [query, setQuery] = useState(
    initialData ? `${initialData.nombres} ${initialData.apellidos}` : ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState(initialData);

  useEffect(() => {
    if (initialData) {
      setSelectedTecnico(initialData);
      setQuery(`${initialData.nombres} ${initialData.apellidos}`);
    }
  }, [initialData]);

  const resultados = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tecnicosMock.filter(
      (t) =>
        `${t.nombres} ${t.apellidos}`.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );
  }, [query]);

  const seleccionarTecnico = (t) => {
    setSelectedTecnico(t);
    setQuery(`${t.nombres} ${t.apellidos}`);
    setIsOpen(false);
  };

  const onQueryChange = (value) => {
    setQuery(value);
    setIsOpen(true);
  };

  const abrirResultados = () => setIsOpen(true);
  const cerrarResultados = () => setTimeout(() => setIsOpen(false), 150);

  return {
    query,
    resultados,
    selectedTecnico,
    seleccionarTecnico,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    isOpen,
    setSelectedTecnico,
  };
}
