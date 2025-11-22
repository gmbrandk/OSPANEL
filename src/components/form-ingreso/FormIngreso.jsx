import { CollapsibleGroupProvider } from '../../context/CollapsibleGroupContext';
import {
  IngresoFormProvider,
  useIngresoForm,
} from '../../context/IngresoFormContext';

import { ClientesProvider } from '../../context/clientesContext.jsx';
import { EquiposProvider } from '../../context/equiposContext.jsx'; // 👈 AÑADIDO
import { TecnicosProvider } from '../../context/tecnicosContext.jsx';
import { TiposTrabajoProvider } from '../../context/tiposTrabajoContext.jsx';

import { PersistSwitch } from '../PersistenSwitch.jsx';
import { ClienteSection } from './ClienteSection.jsx';
import Collapsible from './Collapsible.jsx';
import { EquipoSection } from './EquipoSection.jsx';
import { OrdenServicio } from './OrdenServicioSection.jsx';

function IngresoFormContent({ onSubmit }) {
  const { cliente, equipo, tecnico, orden, submitAndClear } = useIngresoForm();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { cliente, equipo, tecnico, orden };

    if (onSubmit) onSubmit(payload);

    submitAndClear();
  };

  return (
    <form id="formIngreso" className="msform" onSubmit={handleSubmit}>
      <h1>Formulario de Ingreso y Diagnóstico Técnico</h1>
      <PersistSwitch />

      <CollapsibleGroupProvider>
        <Collapsible
          title="Datos del cliente"
          main
          index={0}
          initMode="expanded"
        >
          <ClienteSection />
        </Collapsible>

        <Collapsible
          title="Datos del equipo"
          main
          index={1}
          initMode="expanded"
        >
          <EquipoSection />{' '}
          {/* ⬅️ ESTE YA TIENE ACCESO AL CONTEXTO DE EQUIPOS */}
        </Collapsible>

        <Collapsible
          title="Orden de servicio"
          main
          index={2}
          initMode="expanded"
        >
          <OrdenServicio />
        </Collapsible>
      </CollapsibleGroupProvider>

      <div className="actions">
        <button type="submit" className="button-save">
          💾 Guardar formulario
        </button>
      </div>
    </form>
  );
}

// =================================================================
// 🧠 Componente principal — inicializa TODOS los providers
// =================================================================
export default function FormIngreso({ initialPayload = null, onSubmit }) {
  return (
    <ClientesProvider>
      {/* 1. Clientes */}
      <EquiposProvider>
        {/* 2. Equipos */}
        <TecnicosProvider>
          {/* 3. Técnicos */}
          <TiposTrabajoProvider>
            {/* 4. Tipos trabajo */}
            <IngresoFormProvider initialPayload={initialPayload}>
              {/* 5. El formulario ya tiene acceso a todo */}
              <IngresoFormContent onSubmit={onSubmit} />
            </IngresoFormProvider>
          </TiposTrabajoProvider>
        </TecnicosProvider>
      </EquiposProvider>
    </ClientesProvider>
  );
}
