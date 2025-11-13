// SelectAutocomplete.jsx
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
  value,
}) {
  return (
    <AutocompleteBase
      label={label}
      placeholder={placeholder}
      value={value}
      query={query}
      onChange={onChange}
      resultados={resultados}
      isOpen={isOpen}
      onSelect={onSelect}
      cerrarResultados={cerrarResultados}
      renderItem={renderItem}
      inputName={inputName}
      onFocus={() => abrirResultados()}
      onToggle={() => (isOpen ? cerrarResultados() : abrirResultados())}
    />
  );
}
