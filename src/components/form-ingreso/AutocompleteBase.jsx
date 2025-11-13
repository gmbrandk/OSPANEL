import PropTypes from 'prop-types';
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
  value, // ✅ nuevo prop
}) {
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
            value={value ?? query}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setTimeout(cerrarResultados, 150)}
            onFocus={onFocus}
            autoComplete="off"
            placeholder={placeholder}
          />

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

        {isOpen && resultados.length > 0 && (
          <div className="autocomplete-list">
            {resultados.map((item) => (
              <div
                key={item.id || item._id}
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
  query: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  resultados: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  cerrarResultados: PropTypes.func.isRequired,
  renderItem: PropTypes.func,
  inputName: PropTypes.string,
  onFocus: PropTypes.func,
  value: PropTypes.string, // ✅ nuevo propType
};
