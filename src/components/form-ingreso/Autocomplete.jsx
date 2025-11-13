// Autocomplete.jsx
import { AutocompleteBase } from './AutocompleteBase.jsx';

export function Autocomplete({
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
  abrirResultados = () => {}, // ✅ fallback seguro
}) {
  return (
    <AutocompleteBase
      label={label}
      placeholder={placeholder}
      query={query}
      onChange={onChange}
      resultados={resultados}
      isOpen={isOpen}
      onSelect={onSelect}
      cerrarResultados={cerrarResultados}
      renderItem={renderItem}
      inputName={inputName}
      onFocus={() => abrirResultados()} // ✅ siempre existe
      onToggle={() => (isOpen ? cerrarResultados() : abrirResultados())}
    />
  );
}
