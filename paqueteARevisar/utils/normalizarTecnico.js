// utils/normalizarTecnico.js
export function normalizarTecnico(raw = {}) {
  const nombres = raw.nombres || raw.nombre || '';
  const apellidos = raw.apellidos || '';
  const nombreCompleto = raw.nombreCompleto || `${nombres} ${apellidos}`.trim();

  return {
    _id: raw._id || null,
    nombres,
    apellidos,
    nombreCompleto,
    especialidad: raw.especialidad || '',
  };
}
