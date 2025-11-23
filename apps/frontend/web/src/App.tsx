/**
 * App Component
 * Root component con routing básico
 *
 * @author Frontend-Agent
 * @date 2025-11-20
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/**
 * Componente principal de la aplicación
 * TODO: Agregar rutas de los diferentes portales (admin, supervisor, obra)
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<HomePage />} />

          {/* Portal Admin */}
          <Route path="/admin/*" element={<div>Admin Portal (TODO)</div>} />

          {/* Portal Supervisor */}
          <Route path="/supervisor/*" element={<div>Supervisor Portal (TODO)</div>} />

          {/* Portal Obra */}
          <Route path="/obra/*" element={<div>Obra Portal (TODO)</div>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

/**
 * Página de inicio temporal
 */
function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🏗️ Sistema Administración de Obra</h1>
      <p>MVP - INFONAVIT</p>
      <ul>
        <li><a href="/admin">Portal Administrador</a></li>
        <li><a href="/supervisor">Portal Supervisor</a></li>
        <li><a href="/obra">Portal Obra</a></li>
      </ul>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Versión: 1.0.0 | Entorno: {import.meta.env.MODE}
      </p>
    </div>
  );
}

export default App;
