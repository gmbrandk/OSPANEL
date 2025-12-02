import { BrowserRouter, Route, Routes } from 'react-router-dom';

import DevPage from '@pages/form-ingreso/DevPage';
import IngresoPage from '@pages/form-ingreso/IngresoPage';
import PayloadPage from '@pages/form-ingreso/PayloadPage';
import PreviewPage from '@pages/form-ingreso/PreviewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ingreso" element={<IngresoPage />} />
        <Route path="/payload" element={<PayloadPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/dev" element={<DevPage />} />
      </Routes>
    </BrowserRouter>
  );
}
