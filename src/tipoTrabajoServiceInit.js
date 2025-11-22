// tipoTrabajoServiceInit.js
import { proveedorTiposTrabajo } from './config/entorno';
import { mapaProveedoresTiposTrabajo } from './config/proveedores';
import { inicializarTiposTrabajoService } from './service/tiposTrabajo/tiposTrabajoService';

const proveedorSeleccionado =
  mapaProveedoresTiposTrabajo[proveedorTiposTrabajo];

if (!proveedorSeleccionado) {
  throw new Error(
    `[tiposTrabajoServiceInit] ❌ Proveedor "${proveedorTiposTrabajo}" no es válido.`
  );
}

inicializarTiposTrabajoService(
  proveedorSeleccionado.instancia,
  proveedorSeleccionado.nombre,
  proveedorSeleccionado.tipo
);

console.info(
  `[Init] TiposTrabajo (proveedor): ${proveedorSeleccionado.nombre} [${proveedorSeleccionado.tipo}]`
);
