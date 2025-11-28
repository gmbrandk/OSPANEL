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
  isInitialSelection, // 👈 IMPORTANTE: lo pedimos
}) {
  const handleToggle = () => {
    // Si la UI está en modo inicial,
    // ignoramos clics en el toggle.
    if (isInitialSelection) return;

    if (isOpen) cerrarResultados();
    else abrirResultados();
  };

  const handleFocus = () => {
    // Si el foco viene de inicialización → NO ABRIR.
    if (isInitialSelection) return;

    abrirResultados();
  };

  // En select queremos mostrar todas las opciones sólo cuando isOpen = true
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
      onFocus={handleFocus}
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
