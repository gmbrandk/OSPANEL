import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsFirstRender } from '../useIsFirstRender';

export function useCollapsible({
  defaultOpen = false,
  title = 'Untitled',
} = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const openedByUser = useRef(false);
  const isFirst = useIsFirstRender();

  const expand = useCallback((el) => {
    if (!el) return;
    el.style.transition = '';
    el.style.maxHeight = 'none';
    const fullHeight = el.scrollHeight + 'px';
    el.style.maxHeight = '0px';
    el.style.opacity = '0';

    requestAnimationFrame(() => {
      el.style.transition =
        'max-height 0.35s ease, opacity 0.35s ease, padding 0.25s ease';
      el.style.maxHeight = fullHeight;
      el.style.opacity = '1';

      const handler = (e) => {
        if (e.propertyName === 'max-height') {
          el.style.maxHeight = 'none';
          el.style.transition = '';
          el.removeEventListener('transitionend', handler);
        }
      };
      el.addEventListener('transitionend', handler);
    });
  }, []);

  const collapse = useCallback((el) => {
    if (!el) return;
    if (!el.style.maxHeight || el.style.maxHeight === 'none') {
      el.style.maxHeight = el.scrollHeight + 'px';
    }
    el.offsetHeight; // fuerza reflow
    requestAnimationFrame(() => {
      el.style.transition =
        'max-height 0.35s ease, opacity 0.35s ease, padding 0.25s ease';
      el.style.maxHeight = '0px';
      el.style.opacity = '0';
      const handler = (e) => {
        if (e.propertyName === 'max-height') {
          el.style.transition = '';
          el.removeEventListener('transitionend', handler);
        }
      };
      el.addEventListener('transitionend', handler);
    });
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isFirst) {
      // Estado inicial sin animación
      el.style.maxHeight = isOpen ? 'none' : '0px';
      el.style.opacity = isOpen ? '1' : '0';
      // console.log(
      //   `%c[HOOK] 🟢 "${title}" montado con estado inicial: ${
      //     isOpen ? 'expanded' : 'collapsed'
      //   }`,
      //   'color:#7f7'
      // );
      return;
    }

    // console.log(
    //   `%c[HOOK] 🔄 "${title}" ahora está ${isOpen ? 'abierto' : 'cerrado'}`,
    //   'color:#0af'
    // );

    if (isOpen) expand(el);
    else collapse(el);
  }, [isOpen, expand, collapse, title, isFirst]);

  const toggle = useCallback(() => {
    // console.log(`%c[HOOK] ⚪️ toggle() llamado para "${title}"`, 'color:#ccc');
    setIsOpen((prev) => {
      const next = !prev;
      if (next) openedByUser.current = true;
      return next;
    });
  }, [title]);

  return { isOpen, toggle, contentRef, setOpen: setIsOpen, openedByUser };
}
