// SelectAutocomplete.jsx
import dropdownArrow from '../../assets/form-ingreso/dropdown-arrow.svg';
import { AutocompleteBase } from './AutocompleteBase.jsx';

export function SelectAutocomplete({
  label,
  placeholder,
  query,
  onChange,
  resultados,
  isOpen,
  onSelect,
  cerrarResultados,
  renderItem,
  inputName,
  abrirResultados,
}) {
  const handleToggle = () => {
    if (isOpen) cerrarResultados();
    else abrirResultados();
  };

  // 👇 CLAVE: en select queremos mostrar SIEMPRE todas las opciones
  const resultadosForSelect = isOpen ? resultados : [];

  return (
    <AutocompleteBase
      label={label}
      placeholder={placeholder}
      query={query}
      onChange={onChange}
      resultados={resultadosForSelect}
      isOpen={isOpen}
      onSelect={onSelect}
      cerrarResultados={cerrarResultados}
      renderItem={renderItem}
      inputName={inputName}
      onFocus={abrirResultados}
      onToggle={handleToggle}
      renderIcon={({ isOpen }) => (
        <img
          src={dropdownArrow}
          alt="toggle"
          className={isOpen ? 'rotated' : ''}
        />
      )}
    />
  );
}
