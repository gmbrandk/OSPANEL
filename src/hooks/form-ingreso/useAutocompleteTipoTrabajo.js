import { useEffect, useMemo, useState } from 'react';
import { tiposTrabajoMock } from '../../__mock__/form-ingreso';

export function useAutocompleteTipoTrabajo(initialValue = null) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);

  // ======================================================
  // 🔄 Inicializar correctamente con datos del backend
  // ======================================================
  useEffect(() => {
    if (!initialValue) return;

    // Caso: viene un objeto tipoTrabajo del backend
    if (typeof initialValue === 'object' && initialValue.nombre) {
      setSelectedTrabajo(initialValue);
      setQuery(initialValue.nombre);
      return;
    }

    // Caso: viene un string (texto libre) o nombre exacto
    if (typeof initialValue === 'string') {
      const found = tiposTrabajoMock.find(
        (t) => t.nombre.toLowerCase() === initialValue.toLowerCase()
      );

      if (found) {
        setSelectedTrabajo(found);
        setQuery(found.nombre);
      } else {
        // Si no existe en el catálogo → es texto libre
        setQuery(initialValue);
        setSelectedTrabajo(null);
      }
    }
  }, [initialValue]);

  // ======================================================
  // 🔍 Filtrar resultados según query
  // ======================================================
  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tiposTrabajoMock;

    return tiposTrabajoMock.filter(
      (t) =>
        t.nombre.toLowerCase().includes(q) ||
        (t.categoria && t.categoria.toLowerCase().includes(q))
    );
  }, [query]);

  // ======================================================
  // 🧭 Acciones del autocompletado
  // ======================================================
  const abrirResultados = () => setIsOpen(true);
  const cerrarResultados = () => setIsOpen(false);

  // Texto libre del input
  const onChange = (value) => {
    setQuery(value);
    setSelectedTrabajo(null); // ← deja de estar seleccionado
    abrirResultados();
  };

  // Usuario hace clic en un item del autocomplete
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
    todosLosTrabajos: tiposTrabajoMock,
    onChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTrabajo,
  };
}
