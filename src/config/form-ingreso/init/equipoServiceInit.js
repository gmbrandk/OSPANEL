// initEquipos.js (o donde inicializas servicios)
import { inicializarEquiposService } from '../../../service/form-ingreso/equipos/equipoService';
import { proveedorEquipos } from '../entorno';
import { mapaProveedoresEquipos } from '../proveedores';

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
