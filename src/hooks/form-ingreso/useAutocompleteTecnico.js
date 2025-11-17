import { useEffect, useMemo, useState } from 'react';
import { tecnicosMock } from '../../__mock__/form-ingreso';
import { log } from '../../utils/log';

export function useAutocompleteTecnico(initialValue = null) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState(null);

  // ============================================================
  // 🧠 Funcion de normalización Nombre + Apellidos
  // soporta:
  // {nombre, apellidos}
  // {nombres, apellidos}
  // {Nombre solo}
  // ============================================================
  const getDisplayName = (t) => {
    if (!t) return null;

    const first = t.nombre ?? t.nombres ?? null;
    const last = t.apellidos ?? null;

    if (!first) return null;
    return last ? `${first} ${last}` : first;
  };

  // ============================================================
  // 🔄 Inicializar valor desde backend / autosave
  // ============================================================
  useEffect(() => {
    log('AUTO-TEC', 'useEffect inicialValue', initialValue);

    if (!initialValue) {
      log('AUTO-TEC', '→ initialValue vacío, se mantiene estado');
      return;
    }

    const displayName = getDisplayName(initialValue);

    // === Caso 1 — Objeto técnico ===
    if (typeof initialValue === 'object' && displayName) {
      log('AUTO-TEC', '✓ Objeto técnico cargado', {
        displayName,
        raw: initialValue,
      });

      setSelectedTecnico(initialValue);
      setQuery(displayName);
      return;
    }

    // === Caso 2 — String ===
    if (typeof initialValue === 'string') {
      const lower = initialValue.toLowerCase();

      const found = tecnicosMock.find((t) => {
        const full = getDisplayName(t)?.toLowerCase();
        return full === lower;
      });

      if (found) {
        log('AUTO-TEC', '✓ string coincide con técnico mock', found);
        setSelectedTecnico(found);
        setQuery(getDisplayName(found));
      } else {
        log('AUTO-TEC', '⚠ string libre sin coincidencia', initialValue);
        setSelectedTecnico(null);
        setQuery(initialValue);
      }
    }
  }, [initialValue]);

  // ============================================================
  // 🔍 Filtrado seguro con búsqueda por nombre + apellidos
  // ============================================================
  const resultados = useMemo(() => {
    const q = (query ?? '').trim().toLowerCase();

    if (!q) {
      log('AUTO-TEC', 'Query vacía → retornando todos');
      return tecnicosMock;
    }

    const res = tecnicosMock.filter((t) => {
      const full = getDisplayName(t)?.toLowerCase() ?? '';
      const esp = t.especialidad?.toLowerCase() ?? '';
      return full.includes(q) || esp.includes(q);
    });

    log('AUTO-TEC', `Filtro q="${q}" → ${res.length} resultados`);
    return res;
  }, [query]);

  // ============================================================
  // 🧭 Acciones básicas
  // ============================================================
  const abrirResultados = () => setIsOpen(true);
  const cerrarResultados = () => setIsOpen(false);

  const onChange = (value) => {
    setQuery(value ?? '');
    setSelectedTecnico(null);

    abrirResultados();
    log('AUTO-TEC', 'Escribiendo query', value);
  };

  const seleccionarTecnico = (t) => {
    log('AUTO-TEC', '🟢 Seleccionado técnico', t);
    setSelectedTecnico(t);
    setQuery(getDisplayName(t));
    cerrarResultados();
  };

  return {
    query,
    resultados,
    isOpen,
    selectedTecnico,
    onChange,
    abrirResultados,
    cerrarResultados,
    seleccionarTecnico,
  };
}
