// hooks/form-ingreso/useAutocompleteCliente.js
import { useEffect, useRef, useState } from 'react';
import { useClientes } from '../../context/clientesContext';

const EMPTY_CLIENT = {
  _id: null,
  dni: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  email: '',
  direccion: '',
};

export function useAutocompleteCliente(initialData = null, minLength = 3) {
  const { clientes, buscarClientes, buscarClientePorId } = useClientes();

  const [query, setQuery] = useState(initialData?.dni || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(
    initialData || EMPTY_CLIENT
  );

  const isSelecting = useRef(false); // 👈 NUEVO

  // ===========================
  // Sync initialData
  // ===========================
  useEffect(() => {
    if (initialData) {
      setSelectedCliente(initialData);
      setQuery(initialData.dni || '');
    } else {
      setSelectedCliente(EMPTY_CLIENT);
      setQuery('');
    }
  }, [initialData]);

  // ===========================
  // Debounce autocomplete
  // ===========================
  useEffect(() => {
    if (isSelecting.current) return; // ⛔ No dispares búsqueda durante selección

    if (!query || query.trim().length < minLength) {
      setSelectedCliente(EMPTY_CLIENT);
      return;
    }

    const timeout = setTimeout(() => {
      buscarClientes(query);
      setIsOpen(true);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, buscarClientes, minLength]);

  // ===========================
  // Select client (full lookup)
  // ===========================
  const seleccionarCliente = async (clienteParcial) => {
    isSelecting.current = true; // 👈 BLOQUEA AUTOCOMPLETE

    setQuery(clienteParcial.dni || '');
    setIsOpen(false);

    const fullData = await buscarClientePorId(clienteParcial._id);

    if (fullData) setSelectedCliente(fullData);
    else setSelectedCliente(clienteParcial);

    // 🔓 Rehabilitar autocomplete después del ciclo de render
    setTimeout(() => {
      isSelecting.current = false;
    }, 100);
  };

  // ===========================
  // UI handlers
  // ===========================
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
    resultados: clientes,
    selectedCliente,
    seleccionarCliente,
    isOpen,
    onQueryChange,
    abrirResultados,
    cerrarResultados,
    setSelectedCliente,
  };
}
