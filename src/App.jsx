import { useEffect, useState } from 'react';
import { mockGetOrdenServicioById } from './__mock__/ordenServicioMocks';
import FormIngreso from './components/form-ingreso/FormIngreso';
import { normalizeOrdenPayload } from './utils/normalizeOrdenPayload';
import { buildOrdenPayload } from './utils/buildOrdenPayload';

function App() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [payloadVisual, setPayloadVisual] = useState(null);

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

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>🧾 Simulador de Ingreso de Servicio Técnico (Modo GET Simulado)</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Carga simulada desde mock de API → Formulario poblado automáticamente.
      </p>

      <FormIngreso
        initialPayload={initialData}
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
    </div>
  );
}

export default App;
