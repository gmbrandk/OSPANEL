// services/tecnicos/providers/localStorageProviderTecnicos.js
import { tecnicosMock } from '../../../../__mock__/form-ingreso/tecnicos';

export const localStorageProvider = {
  // ======================================================
  // 🔍 AUTOCOMPLETE → nombre incluye "query"
  // ======================================================
  buscarTecnico: async (query) => {
    console.info('[TecnicosMock] AUTOCOMPLETE → query:', query);

    const q = (query ?? '').toLowerCase().trim();

    const matches = tecnicosMock.filter((t) =>
      t.nombres.toLowerCase().includes(q)
    );

    return {
      success: true,
      ok: true,
      message: 'Técnicos obtenidos correctamente (mock)',
      details: {
        count: matches.length,
        mode: 'autocomplete',
        isNew: false,
        results: matches,
      },
    };
  },

  // ======================================================
  // 📥 LOOKUP POR ID
  // ======================================================
  buscarTecnicoPorId: async (id) => {
    console.info('[TecnicosMock] LOOKUP → id:', id);

    const found = tecnicosMock.find((t) => t._id === id);

    return {
      success: true,
      ok: true,
      message: 'Técnico obtenido correctamente (mock)',
      details: {
        count: found ? 1 : 0,
        mode: 'lookup',
        isNew: false,
        results: found ? [found] : [],
      },
    };
  },
};
