// tipoTrabajoServiceInit.js
import { inicializarTiposTrabajoService } from '../../../service/form-ingreso/tiposTrabajo/tiposTrabajoService';
import { proveedorTiposTrabajo } from '../entorno';
import { mapaProveedoresTiposTrabajo } from '../proveedores';

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
