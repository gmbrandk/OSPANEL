// initEquipos.js (o donde inicializas servicios)
import { proveedorEquipos } from './config/entorno';
import { mapaProveedoresEquipos } from './config/proveedores';
import { inicializarEquiposService } from './service/equipos/equipoService';

const proveedorSeleccionado = mapaProveedoresEquipos[proveedorEquipos];

if (!proveedorSeleccionado) {
  throw new Error(
    `[equiposServiceInit] ❌ Proveedor inválido: ${proveedorEquipos}`
  );
}

inicializarEquiposService(
  proveedorSeleccionado.instancia,
  proveedorSeleccionado.nombre,
  proveedorSeleccionado.tipo
);

console.info(
  `[Init] Equipos provider: ${proveedorSeleccionado.nombre} [${proveedorSeleccionado.tipo}]`
);
