// src/hooks/form-ingreso/useAutocompleteCliente.js
import { useEffect, useMemo, useState } from 'react';
import { clientesMock } from '../../__mock__/form-ingreso';

export function useAutocompleteCliente(initialData = null) {
  const [query, setQuery] = useState(initialData?.dni || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(initialData);

  const todosLosClientes = clientesMock;

  // ✅ Si cambia initialData, actualizar el estado
  useEffect(() => {
    if (initialData) {
      setSelectedCliente(initialData);
      setQuery(initialData.dni || '');
    }
  }, [initialData]);

  const resultados = useMemo(() => {
    const q = query.toLowerCase();
    if (!q.trim()) return [];
    return clientesMock.filter(
      (c) =>
        c.dni.includes(q) ||
        c.nombres.toLowerCase().includes(q) ||
        c.apellidos.toLowerCase().includes(q)
    );
  }, [query]);

  const onQueryChange = (value) => {
    setQuery(value);
    setIsOpen(true);
  };

  const seleccionarCliente = (cliente) => {
    setSelectedCliente(cliente);
    setQuery(cliente.dni);
    setIsOpen(false);
  };

  const abrirResultados = () => setIsOpen(true);

  const cerrarResultados = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  return {
    query,
    resultados,
    todosLosClientes,
    selectedCliente,
    seleccionarCliente,
    isOpen,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    setSelectedCliente,
  };
}
