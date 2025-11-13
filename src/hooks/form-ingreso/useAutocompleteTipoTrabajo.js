import { useEffect, useMemo, useState } from 'react';
import { tiposTrabajoMock } from '../../__mock__/form-ingreso';

export function useAutocompleteTipoTrabajo(initialValue = null) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);

  // ======================================================
  // 🔄 Inicializar con valor preexistente
  // ======================================================
  useEffect(() => {
    if (initialValue) {
      if (typeof initialValue === 'object' && initialValue.nombre) {
        setSelectedTrabajo(initialValue);
        setQuery(initialValue.nombre);
      } else if (typeof initialValue === 'string') {
        const found = tiposTrabajoMock.find(
          (t) => t.nombre.toLowerCase() === initialValue.toLowerCase()
        );
        if (found) {
          setSelectedTrabajo(found);
          setQuery(found.nombre);
        } else {
          // Si no está en el mock, se permite texto libre
          setQuery(initialValue);
        }
      }
    }
  }, [initialValue]);

  // ======================================================
  // 🔍 Filtrado de resultados
  // ======================================================
  const resultados = useMemo(() => {
    if (!query.trim()) return tiposTrabajoMock;
    const q = query.toLowerCase();
    return tiposTrabajoMock.filter(
      (t) =>
        t.nombre.toLowerCase().includes(q) ||
        (t.categoria && t.categoria.toLowerCase().includes(q))
    );
  }, [query]);

  // ======================================================
  // 🧭 Acciones
  // ======================================================
  const abrirResultados = () => setIsOpen(true);
  const cerrarResultados = () => setIsOpen(false);

  const onChange = (value) => {
    setQuery(value);
    setSelectedTrabajo(null); // ← Permitir texto libre
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
    todosLosTrabajos: tiposTrabajoMock,
    onChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTrabajo,
  };
}
