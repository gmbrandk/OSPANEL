import { proveedorClientes } from './config/entorno';
import { mapaProveedoresClientes } from './config/proveedores';
import { inicializarClienteService } from './service/clientes/ClienteService';

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
