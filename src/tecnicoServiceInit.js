// initTecnicos.js
import { proveedorTecnicos } from './config/entorno';
import { mapaProveedoresTecnicos } from './config/proveedores';
import { inicializarTecnicosService } from './service/tecnicos/tecnicoService';

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
