//5) Uso de getPayloadOS justo antes de enviar

import { useFormIngreso } from '../context/FormIngresoContext';
import { getPayloadOS } from '../utils/totales';

function handleSubmit() {
  const { form } = useFormIngreso();
  const payload = getPayloadOS(form);
  // enviar payload al backend o mock
}
