// initTecnicos.js
import { inicializarTecnicosService } from '../../../service/form-ingreso/tecnicos/tecnicoService';
import { proveedorTecnicos } from '../entorno';
import { mapaProveedoresTecnicos } from '../proveedores';

const proveedorSeleccionado = mapaProveedoresTecnicos[proveedorTecnicos];

if (!proveedorSeleccionado) {
  throw new Error(
    `[tecnicosServiceInit] ❌ Proveedor inválido: ${proveedorTecnicos}`
  );
}

inicializarTecnicosService(
  proveedorSeleccionado.instancia,
  proveedorSeleccionado.nombre,
  proveedorSeleccionado.tipo
);

console.info(
  `[Init] Técnicos provider: ${proveedorSeleccionado.nombre} [${proveedorSeleccionado.tipo}]`
);
