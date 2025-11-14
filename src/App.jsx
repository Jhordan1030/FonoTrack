// src/App.jsx - Rutas completas actualizadas
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Pacientes from './pages/Pacientes.jsx';
import PacienteDetail from './pages/pacientes/PacienteDetail.jsx';
import Evaluaciones from './pages/Evaluaciones.jsx';
import EvaluationDetail from './pages/evaluaciones/EvaluationDetail.jsx'; // 👈 NUEVO
import CreateEvaluation from './pages/evaluaciones/CreateEvaluation.jsx'; // 👈 NUEVO
import Documentos from './pages/Documentos.jsx';
import Buscar from './pages/Buscar.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:id" element={<PacienteDetail />} />
          
          {/* Rutas de Evaluaciones */}
          <Route path="/evaluaciones" element={<Evaluaciones />} />
          <Route path="/evaluaciones/crear" element={<CreateEvaluation />} /> {/* 👈 NUEVA RUTA */}
          <Route path="/evaluaciones/crear/:patientId" element={<CreateEvaluation />} /> {/* 👈 NUEVA RUTA */}
          <Route path="/evaluaciones/:id" element={<EvaluationDetail />} /> {/* 👈 NUEVA RUTA */}
          <Route path="/evaluaciones/editar/:id" element={<CreateEvaluation />} /> {/* 👈 NUEVA RUTA */}
          
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/buscar" element={<Buscar />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;