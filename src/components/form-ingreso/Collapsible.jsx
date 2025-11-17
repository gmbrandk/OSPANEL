import { useEffect, useLayoutEffect, useRef } from 'react';
import dropdownArrow from '../../assets/form-ingreso/dropdown-arrow.svg';
import { useCollapsibleGroup } from '../../context/CollapsibleGroupContext';
import { useCollapsible } from '../../hooks/form-ingreso/useCollapsible';
import { useSummary } from '../../hooks/form-ingreso/useSummary';

export default function Collapsible({
  title,
  children,
  main = false,
  initMode = 'auto',
  index = 0,
}) {
  const group = useCollapsibleGroup();
  const isControlledByGroup = Boolean(group);

  const shouldStartOpen = (() => {
    switch (initMode) {
      case 'expanded':
        return true;
      case 'collapsed':
        return false;
      case 'none':
        return false;
      case 'auto':
      default:
        return main;
    }
  })();

  const { isOpen, toggle, contentRef, setOpen, openedByUser } = useCollapsible({
    defaultOpen: shouldStartOpen,
    title,
  });

  const summary = useSummary(contentRef);
  const didMount = useRef(false);

  /* ======================================================
     🧩 Registro en el grupo (deferido correctamente)
  ====================================================== */
  useLayoutEffect(() => {
    if (!isControlledByGroup) return;

    // console.log(
    //   `%c[COLLAPSIBLE] 🧩 Registrando "${title}" (index: ${index})`,
    //   'color: #0ff'
    // );

    group.registerCollapsible(title, index, {
      setOpen,
      openedByUser,
      main,
      index,
    });
  }, [title, index, main, isControlledByGroup, group, setOpen, openedByUser]);

  useEffect(() => {
    const shouldBeOpen = shouldStartOpen;

    console.log(
      `%c[COLLAPSIBLE] 🔄 initMode change detected`,
      'color:#0ff;font-weight:bold',
      {
        initMode,
        shouldStartOpen,
        previousOpen: isOpen,
        nextOpen: shouldBeOpen,
      }
    );

    if (shouldBeOpen !== isOpen) {
      console.log(
        `%c[COLLAPSIBLE] 🟢 syncing state → setOpen(${shouldBeOpen})`,
        'color:#7f7'
      );
      setOpen(shouldBeOpen);
    } else {
      console.log(
        `%c[COLLAPSIBLE] ⚪ no sync needed (already correct)`,
        'color:#aaa'
      );
    }
  }, [initMode]);

  /* ======================================================
     🔄 Notificar al grupo cuando se abre manualmente
  ====================================================== */
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (main && isControlledByGroup && isOpen && openedByUser.current) {
      console.log(
        `[COLLAPSIBLE] 🔵 "${title}" abierto manualmente, notificando al grupo`
      );
      group.registerOpen(title, index);
    }
  }, [isOpen, main, isControlledByGroup, group, title, index]);

  const handleFocusIn = () => {
    if (!main) return;
    if (!isOpen) {
      console.log(
        `%c[COLLAPSIBLE] 🟢 Focus en "${title}" → auto expand`,
        'color: #7f7'
      );
      setOpen(true);
    }
    if (isControlledByGroup) group.registerOpen(title, index);
  };

  const handleClick = () => {
    // console.log(`%c[COLLAPSIBLE] ⚪️ Click en "${title}"`, 'color: #ccc');
    toggle();
  };

  return (
    <fieldset
      className={`collapsible ${!isOpen ? 'collapsed' : 'expanded'}`}
      data-main={main}
      onFocusCapture={handleFocusIn}
      style={{ marginTop: '15px' }}
    >
      <div className="fieldset-header" onClick={handleClick}>
        <h2>{title}</h2>
        <span className="legend-summary">{!isOpen ? summary : ''}</span>
        <img src={dropdownArrow} className="arrow-icon" alt="" />
      </div>

      <div className="fieldset-content" ref={contentRef}>
        {children}
      </div>
    </fieldset>
  );
}
