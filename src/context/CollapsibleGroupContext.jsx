import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

/* ===========================================================
   🧠 Contexto y reducer para manejar los Collapsibles
=========================================================== */

const CollapsibleGroupContext = createContext(null);

function groupReducer(state, action) {
  switch (action.type) {
    case 'REGISTER': {
      const exists = state.collapsibles.some((c) => c.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        collapsibles: [...state.collapsibles, action.payload].sort(
          (a, b) => a.index - b.index
        ),
      };
    }

    case 'OPEN': {
      const { id, index } = action.payload;
      console.log(
        `%c[GROUP] 🔵 "${id}" se abrió → cerrando previos`,
        'color: #39f'
      );

      const updated = state.collapsibles.map((col) => {
        if (col.index < index && col.main && !col.openedByUser.current) {
          console.log(
            `%c[GROUP] 🔴 Cerrando anterior: "${col.id}" (deferido)`,
            'color: #f55'
          );

          // ✅ Diferir el cierre para evitar setState durante render
          requestAnimationFrame(() => {
            col.setOpen(false);
          });
        }
        return col;
      });

      return { ...state, collapsibles: updated };
    }

    default:
      return state;
  }
}

/* ===========================================================
   🧩 Provider
=========================================================== */
export function CollapsibleGroupProvider({ children }) {
  const [state, dispatch] = useReducer(groupReducer, { collapsibles: [] });

  const registerCollapsible = useCallback((id, index, api) => {
    dispatch({ type: 'REGISTER', payload: { id, index, ...api } });
    console.log(
      `%c[GROUP] 📋 Registrado collapsible: "${id}" (index: ${index}, main: ${api.main})`,
      'color: #0ff'
    );
  }, []);

  const registerOpen = useCallback((id, index) => {
    dispatch({ type: 'OPEN', payload: { id, index } });
  }, []);

  // 🔍 Log de diagnóstico (opcional)
  useEffect(() => {
    console.log(
      '%c[GROUP] 🧠 Estado actual:',
      'color: #bbb',
      state.collapsibles
    );
  }, [state.collapsibles]);

  const value = { registerCollapsible, registerOpen };

  return (
    <CollapsibleGroupContext.Provider value={value}>
      {children}
    </CollapsibleGroupContext.Provider>
  );
}

/* ===========================================================
   🧩 Hook
=========================================================== */
export function useCollapsibleGroup() {
  return useContext(CollapsibleGroupContext);
}
