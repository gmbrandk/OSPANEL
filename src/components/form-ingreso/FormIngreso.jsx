import { CollapsibleGroupProvider } from '../../context/CollapsibleGroupContext';
import {
  IngresoFormProvider,
  useIngresoForm,
} from '../../context/IngresoFormContext';
import { PersistSwitch } from '../PersistenSwitch.jsx';
import { ClienteSection } from './ClienteSection.jsx';
import Collapsible from './Collapsible.jsx';
import { EquipoSection } from './EquipoSection.jsx';
import { OrdenServicio } from './OrdenServicioSection.jsx';

// =================================================================
// 🧩 Wrapper interno — maneja el submit dentro del provider
// =================================================================
function IngresoFormContent({ onSubmit }) {
  const { cliente, equipo, tecnico, orden, submitAndClear } = useIngresoForm();

  const handleSubmit = (e) => {
    console.log('CLIENTE:', cliente);
    console.log('EQUIPO:', equipo);
    console.log('TECNICO:', tecnico);
    console.log('ORDEN:', orden);

    e.preventDefault();

    const payload = { cliente, equipo, tecnico, orden };

    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(payload); // 👉 entrega el estado completo al padre (App)
    } else {
      console.warn('[FormIngreso] No se pasó ninguna función onSubmit');
    }

    submitAndClear();
  };

  return (
    <>
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
            <EquipoSection />
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
    </>
  );
}

// =================================================================
// 🧠 Componente principal — inicializa el contexto
// =================================================================
export default function FormIngreso({ initialPayload = null, onSubmit }) {
  return (
    <IngresoFormProvider initialPayload={initialPayload}>
      <IngresoFormContent onSubmit={onSubmit} />
    </IngresoFormProvider>
  );
}
