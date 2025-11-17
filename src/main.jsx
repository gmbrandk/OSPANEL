window.DEBUG = true;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/form-ingreso/index.css'; // ✅ ahora sí correcto

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
