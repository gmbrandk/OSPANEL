// config/proveedores.js (agregar)
import { apiProvider as tiposTrabajoApiProvider } from '../service/tiposTrabajo/providers/apiProvider';
import { localStorageProvider as tiposTrabajoLocalProvider } from '../service/tiposTrabajo/providers/localStorageProvider';

import { apiProvider as clientesApiProvider } from '../service/clientes/providers/apiProvider';
import { localStorageProvider as clientesLocalProvider } from '../service/clientes/providers/localStorageProvider';

import { apiProvider as equiposApiProvider } from '../service/equipos/providers/apiProvider';
import { localStorageProvider as equiposLocalProvider } from '../service/equipos/providers/localStorageProvider';

// Tecnicos providers
import { apiProvider as tecnicosApiProvider } from '../service/tecnicos/providers/apiProvider';
import { localStorageProvider as tecnicosLocalProvider } from '../service/tecnicos/providers/localStorageProvider';

export const mapaProveedoresTiposTrabajo = {
  local: {
    instancia: tiposTrabajoLocalProvider,
    nombre: 'Mock Local Tipos de Trabajo',
    tipo: 'mock',
  },
  api: {
    instancia: tiposTrabajoApiProvider,
    nombre: 'API REST Tipos de Trabajo',
    tipo: 'api',
  },
};

export const mapaProveedoresClientes = {
  local: {
    instancia: clientesLocalProvider,
    nombre: 'Mock Local Clientes',
    tipo: 'mock',
  },
  api: {
    instancia: clientesApiProvider,
    nombre: 'API REST Clientes',
    tipo: 'api',
  },
};

export const mapaProveedoresEquipos = {
  local: {
    instancia: equiposLocalProvider,
    nombre: 'Mock Local Equipos',
    tipo: 'mock',
  },
  api: {
    instancia: equiposApiProvider,
    nombre: 'API REST Equipos',
    tipo: 'api',
  },
};

export const mapaProveedoresTecnicos = {
  local: {
    instancia: tecnicosLocalProvider,
    nombre: 'Mock Local Técnicos',
    tipo: 'mock',
  },
  api: {
    instancia: tecnicosApiProvider,
    nombre: 'API REST Técnicos',
    tipo: 'api',
  },
};
