// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Agregaremos más rutas después */}
          <Route path="/pacientes" element={<div className="p-6"><h1 className="text-2xl font-bold">Pacientes - En construcción</h1></div>} />
          <Route path="/evaluaciones" element={<div className="p-6"><h1 className="text-2xl font-bold">Evaluaciones - En construcción</h1></div>} />
          <Route path="/documentos" element={<div className="p-6"><h1 className="text-2xl font-bold">Documentos - En construcción</h1></div>} />
          <Route path="/buscar" element={<div className="p-6"><h1 className="text-2xl font-bold">Búsqueda - En construcción</h1></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;