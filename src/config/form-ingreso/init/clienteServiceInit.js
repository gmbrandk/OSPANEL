import { inicializarClienteService } from '../../../service/form-ingreso/clientes/ClienteService';
import { proveedorClientes } from '../entorno';
import { mapaProveedoresClientes } from '../proveedores';

const proveedorSeleccionado = mapaProveedoresClientes[proveedorClientes];

if (!proveedorSeleccionado) {
  throw new Error(
    `[clienteServiceInit] ❌ Proveedor inválido: ${proveedorClientes}`
  );
}

inicializarClienteService(
  proveedorSeleccionado.instancia,
  proveedorSeleccionado.nombre,
  proveedorSeleccionado.tipo
);

console.info(
  `[Init] Clientes provider: ${proveedorSeleccionado.nombre} [${proveedorSeleccionado.tipo}]`
);
