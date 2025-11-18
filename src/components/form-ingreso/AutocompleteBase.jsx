// AutocompleteBase.jsx
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import closeIcon from '../../assets/form-ingreso/close.svg';

export function AutocompleteBase({
  label,
  placeholder,
  query,
  onChange,
  onToggle,
  isOpen,
  resultados,
  onSelect,
  cerrarResultados,
  renderItem,
  inputName,
  onFocus,
  renderIcon, // 👈 nuevo
}) {
  const showClear = Boolean(query?.trim());
  const blurTimeout = useRef(null);
  const items = resultados ?? [];

  useEffect(() => {
    return () => {
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };
  }, []);

  return (
    <div className="col autocomplete-container">
      {label && <label htmlFor={inputName}>{label}</label>}

      <div className="autocomplete-wrapper">
        <div className="autocomplete-input-wrapper">
          <input
            id={inputName}
            name={inputName}
            type="text"
            className="input-field autocomplete-input"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => {
              blurTimeout.current = setTimeout(() => cerrarResultados?.(), 150);
            }}
            onFocus={() => {
              if (blurTimeout.current) {
                clearTimeout(blurTimeout.current);
                blurTimeout.current = null;
              }
              onFocus?.();
            }}
            onClick={() => !isOpen && onToggle()}
            autoComplete="off"
            placeholder={placeholder}
          />

          {/* Icon buttons container */}
          <div className="autocomplete-actions">
            {showClear && (
              <button
                className="autocomplete-clear"
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange('');
                  onFocus?.();
                }}
              >
                <img src={closeIcon} alt="close" />
              </button>
            )}

            {/* 👇 ESTA ES LA CLAVE: icono configurable */}
            <button
              type="button"
              className="autocomplete-toggle"
              onMouseDown={(e) => {
                e.preventDefault();
                onToggle();
              }}
            >
              {renderIcon?.({ isOpen }) ?? null}
            </button>
          </div>
        </div>

        {isOpen && items.length > 0 && (
          <div className="autocomplete-list" role="listbox">
            {items.map((item) => (
              <div
                key={item._id || item.id}
                className="autocomplete-item"
                role="option"
                onMouseDown={() => onSelect(item)}
              >
                {renderItem ? renderItem(item) : <>{item.nombre}</>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

AutocompleteBase.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  query: PropTypes.string,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  resultados: PropTypes.array,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
  cerrarResultados: PropTypes.func,
  renderItem: PropTypes.func,
  inputName: PropTypes.string,
  onFocus: PropTypes.func,
  renderIcon: PropTypes.func, // 👈 nuevo
};
