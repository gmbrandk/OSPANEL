import { useEffect, useState } from 'react';
import { mockGetOrdenServicioById } from '@__mock__/ordenServicioMocks';
import DevLogPanel from '@components/DevLogPanel';
import FormIngreso from '@components/form-ingreso/FormIngreso';
import { buildOrdenPayload } from '@utils/form-ingreso/buildOrdenPayload';
import { ensureAuth } from '@utils/form-ingreso/ensureAuth';
import { normalizeOrdenPayload } from '@utils/form-ingreso/normalizeOrdenPayload';

import OSPreview from '@components/OSPreview';

import './config/form-ingreso/init/clienteServiceInit';
import './config/form-ingreso/init/equipoServiceInit';
import './config/form-ingreso/init/tecnicoServiceInit';
import './config/form-ingreso/init/tipoTrabajoServiceInit';

function App() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [payloadVisual, setPayloadVisual] = useState(null);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function authFlow() {
      const user = await ensureAuth();
      setUsuario(user);
    }
    authFlow();
  }, []);

  useEffect(() => {
    ensureAuth();
  }, []);

  useEffect(() => {
    async function fetchMock() {
      const res = await mockGetOrdenServicioById('ORD12345');
      if (res.success) {
        const normalized = normalizeOrdenPayload(res.data);
        setInitialData(normalized);
      }
      setLoading(false);
    }
    fetchMock();
  }, []);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Cargando orden simulada...</p>;
  }

  if (!usuario) return <p>Cargando autenticación...</p>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>🧾 Simulador de Ingreso de Servicio Técnico (Modo GET Simulado)</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Carga simulada desde mock de API → Formulario poblado automáticamente.
      </p>

      <FormIngreso
        initialPayload={initialData}
        role={usuario.role} // ← aquí se inyecta el rol
        onSubmit={(data) => {
          const payload = buildOrdenPayload(data);
          setPayloadVisual(payload);
        }}
      />

      {payloadVisual && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '6px',
          }}
        >
          <h3>📦 Payload final (JSON crudo listo para backend):</h3>
          <pre
            style={{ background: '#eee', padding: '1rem', borderRadius: '4px' }}
          >
            {JSON.stringify(payloadVisual, null, 2)}
          </pre>
        </div>
      )}
      {window.DEBUG && <DevLogPanel />}
      <OSPreview orden={payloadVisual} />
    </div>
  );
}

export default App;
