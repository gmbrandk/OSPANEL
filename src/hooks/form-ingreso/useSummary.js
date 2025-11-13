import { useCallback, useEffect, useState } from 'react';

/**
 * Hook que calcula el resumen dinámico de un fieldset del formulario de ingreso.
 *
 * Detecta automáticamente el tipo según los campos presentes en el contenido:
 * - Cliente
 * - Equipo
 * - Líneas de servicio
 * - Ficha técnica
 */
export function useSummary(containerRef) {
  const [summary, setSummary] = useState('');

  const computeSummary = useCallback(() => {
    const el = containerRef?.current;
    if (!el) return '';

    if (isCliente(el)) return getClienteSummary(el);
    if (isEquipo(el)) return getEquipoSummary(el);
    if (isLineasServicio(el)) return getLineasServicioSummary(el);
    if (isFichaTecnica(el)) return getFichaTecnicaSummary(el);

    return '';
  }, [containerRef]);

  // Cada vez que haya cambios dentro del fieldset → actualizar resumen
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      setSummary(computeSummary());
    });

    observer.observe(el, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    const handleInput = () => setSummary(computeSummary());
    el.addEventListener('input', handleInput);

    // Calcular una vez al montar
    setSummary(computeSummary());

    return () => {
      observer.disconnect();
      el.removeEventListener('input', handleInput);
    };
  }, [containerRef, computeSummary]);

  return summary;
}

/* =====================================================
   ✅ Detectores
===================================================== */
function isCliente(fs) {
  return fs.querySelector('[name="nombres"]');
}

function isEquipo(fs) {
  return fs.querySelector('[name="marca"]');
}

function isLineasServicio(fs) {
  return fs.querySelector('#lineasServicioContainer');
}

function isFichaTecnica(fs) {
  return fs.querySelector('[name="fichaTecnicaManual[cpu]"]');
}

/* =====================================================
   ✅ Generadores de resumen
===================================================== */

function getClienteSummary(fs) {
  const n = fs.querySelector('[name="nombres"]')?.value.trim() || '';
  const a = fs.querySelector('[name="apellidos"]')?.value.trim() || '';
  const d = fs.querySelector('[name="dni"]')?.value.trim() || '';
  if (!n && !a && !d) return '';
  return `${n} ${a} — DNI ${d}`;
}

function getEquipoSummary(fs) {
  const marca = fs.querySelector('[name="marca"]')?.value.trim() || '';
  const modelo = fs.querySelector('[name="modelo"]')?.value.trim() || '';
  const nro = fs.querySelector('[name="nroSerie"]')?.value.trim() || '';
  if (!marca && !modelo && !nro) return '';
  return `${marca} ${modelo}${nro ? ' — ' + nro : ''}`;
}

function getLineasServicioSummary(fs) {
  const descs = [...fs.querySelectorAll('[data-descripcion]')]
    .map((i) => i.value.trim())
    .filter((v) => v)
    .join(', ');

  return descs || 'Sin líneas';
}

function getFichaTecnicaSummary(fs) {
  const cpu =
    fs.querySelector('[name="fichaTecnicaManual[cpu]"]')?.value.trim() || '';
  const ram =
    fs.querySelector('[name="fichaTecnicaManual[ram]"]')?.value.trim() || '';
  if (!cpu && !ram) return '';
  return `${cpu || 'CPU?'} | ${ram || 'RAM?'}`;
}
