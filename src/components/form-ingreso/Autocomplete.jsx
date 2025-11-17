import { AutocompleteBase } from './AutocompleteBase.jsx';

export function Autocomplete({
  label,
  placeholder,
  query = '',
  onChange = () => {},
  resultados = [],
  isOpen = false,
  onSelect = () => {},
  cerrarResultados = () => {},
  abrirResultados = () => {},
  renderItem = (item) => item.label ?? item.nombre ?? '',
  inputName = 'autocomplete',
}) {
  const handleFocus = () => abrirResultados();

  const handleToggle = () => {
    if (isOpen) cerrarResultados();
    else abrirResultados();
  };

  return (
    <AutocompleteBase
      label={label}
      placeholder={placeholder}
      query={query ?? ''} // ← Fallback definitivo
      onChange={onChange}
      resultados={resultados ?? []} // ← segura
      isOpen={isOpen}
      onSelect={onSelect}
      cerrarResultados={cerrarResultados}
      renderItem={renderItem}
      inputName={inputName}
      onFocus={handleFocus}
      onToggle={handleToggle}
    />
  );
}
