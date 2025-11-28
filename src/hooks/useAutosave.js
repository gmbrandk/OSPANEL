import { useEffect, useRef } from 'react';
import { log } from '../utils/form-ingreso/log'; // ← usa logger unificado

/**
 * Autosave estable con:
 * - delay configurable
 * - skipInitialSave para no guardar durante la carga inicial
 * - markReady() para habilitar guardado después de cargar payload
 * - save(), load(), clear()
 */
export function useAutosave({
  key,
  value,
  enabled = true,
  delay = 300,
  skipInitialSave = true,
}) {
  const timeoutRef = useRef(null);
  const readyRef = useRef(!skipInitialSave);

  /** 🔧 Habilitar guardado después de carga inicial */
  const markReady = () => {
    readyRef.current = true;
    log('AUTOSAVE', `markReady() → autosave habilitado para key="${key}"`);
  };

  /** 💾 Guardar inmediatamente */
  const save = () => {
    if (!enabled) return;
    if (!readyRef.current) {
      log('AUTOSAVE', `save() → ignorado (not ready) key="${key}"`);
      return;
    }

    try {
      const payload = { ...value, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));

      log('AUTOSAVE', 'save() inmediato', { key, payload });
    } catch (err) {
      console.error('[AUTOSAVE] error saving:', err);
    }
  };

  /** 📤 Cargar desde localStorage */
  const load = () => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        log('AUTOSAVE', `load() → key="${key}" no existe`);
        return null;
      }

      const parsed = JSON.parse(raw);
      log('AUTOSAVE', 'load() leído', { key, parsed });

      return parsed;
    } catch (err) {
      console.error('[AUTOSAVE] error loading:', err);
      return null;
    }
  };

  /** 🧹 Limpiar localStorage */
  const clear = () => {
    localStorage.removeItem(key);
    log('AUTOSAVE', `clear() → eliminado key="${key}"`);
  };

  // ========================================================
  // 🔄 Auto-guardar con delay (Throttled Autosave)
  // ========================================================
  useEffect(() => {
    if (!enabled) return;

    // evita guardar durante la carga inicial
    if (!readyRef.current) {
      log('AUTOSAVE', `skip initial autosave (not ready) key="${key}"`);
      return;
    }

    // limpiar timeout previo
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      try {
        const payload = { ...value, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(payload));
        log('AUTOSAVE', 'autosave (delayed)', { key, payload });
      } catch (err) {
        console.error('[AUTOSAVE] error saving (delayed):', err);
      }
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value, enabled, key, delay]);

  // ========================================================
  // API pública
  // ========================================================
  return {
    save,
    load,
    clear,
    markReady,
  };
}
