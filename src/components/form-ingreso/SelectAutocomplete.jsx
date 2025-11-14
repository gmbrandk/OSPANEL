// SelectAutocomplete.jsx
import { AutocompleteBase } from './AutocompleteBase.jsx';

export function SelectAutocomplete({
  label,
  placeholder,
  query, // el texto que se muestra SIEMPRE viene del hook
  onChange,
  resultados,
  isOpen,
  onSelect,
  cerrarResultados,
  renderItem,
  inputName,
  abrirResultados,
}) {
  return (
    <AutocompleteBase
      label={label}
      placeholder={placeholder}
      value={query} // 👈 "value" SIEMPRE = query (no usar otra cosa)
      query={query}
      onChange={onChange}
      resultados={resultados}
      isOpen={isOpen}
      onSelect={onSelect}
      cerrarResultados={cerrarResultados}
      renderItem={renderItem}
      inputName={inputName}
      onFocus={abrirResultados}
      onToggle={() => (isOpen ? cerrarResultados() : abrirResultados())}
    />
  );
}
