import PropTypes from 'prop-types';
import closeCircle from '../../assets/form-ingreso/close-circle.svg';
import dropdownArrow from '../../assets/form-ingreso/dropdown-arrow.svg';

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
}) {
  const showClear = Boolean(query?.trim());

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
            onBlur={() => setTimeout(cerrarResultados, 150)}
            onFocus={() => onFocus?.()}
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
                  onFocus?.(); // opcional + seguro
                }}
              >
                <img src={closeCircle} alt="close" />
              </button>
            )}

            <button
              type="button"
              className={`autocomplete-toggle ${isOpen ? 'open' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onToggle();
              }}
            >
              <img src={dropdownArrow} alt="toggle" />
            </button>
          </div>
        </div>

        {isOpen && resultados.length > 0 && (
          <div className="autocomplete-list">
            {resultados.map((item) => (
              <div
                key={item._id || item.id}
                className="autocomplete-item"
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
};
