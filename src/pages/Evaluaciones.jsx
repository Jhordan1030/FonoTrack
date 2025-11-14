// src/pages/Evaluaciones.jsx
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import EvaluationCard from '../components/evaluations/EvaluationCard';
import EvaluationForm from '../components/evaluations/EvaluationForm';
import { evaluationsService, patientsService } from '../services/api';

const Evaluaciones = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadEvaluations();
    loadPatients();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const response = await evaluationsService.getAll();
      setEvaluations(response.data || []);
    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientsService.getAll();
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleCreateEvaluation = () => {
    setEditingEvaluation(null);
    setShowForm(true);
  };

  const handleEditEvaluation = (evaluation) => {
    setEditingEvaluation(evaluation);
    setShowForm(true);
  };

  const handleViewEvaluation = (evaluation) => {
    window.location.href = `/evaluaciones/${evaluation.id}`;
  };

  const handleSaveEvaluation = () => {
    loadEvaluations();
    setShowForm(false);
    setEditingEvaluation(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvaluation(null);
  };

  const getPatientById = (patientId) => {
    return patients.find(patient => patient.id === patientId);
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const patient = getPatientById(evaluation.patientId);
    const matchesSearch = !searchTerm || 
      (patient && (
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.documentNumber?.includes(searchTerm)
      ));
    
    const matchesStatus = !filterStatus || evaluation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Evaluaciones
          </h1>
          <p className="text-sm text-gray-600">
            Gestiona todas las evaluaciones de pacientes
          </p>
        </div>

        <button
          onClick={handleCreateEvaluation}
          className="px-5 py-2.5 border-none rounded-lg bg-blue-500 text-white text-sm font-medium cursor-pointer flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={16} />
          Nueva Evaluación
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por paciente o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none min-w-[150px]"
        >
          <option value="">Todos los estados</option>
          <option value="COMPLETED">Completada</option>
          <option value="PENDING">Pendiente</option>
          <option value="CANCELLED">Cancelada</option>
        </select>

        <button className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-2 hover:bg-gray-50">
          <Filter size={16} />
          Más filtros
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{evaluations.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {evaluations.filter(e => e.status === 'COMPLETED').length}
          </div>
          <div className="text-sm text-gray-600">Completadas</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {evaluations.filter(e => e.status === 'PENDING').length}
          </div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {evaluations.filter(e => e.status === 'CANCELLED').length}
          </div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </div>
      </div>

      {/* Lista de evaluaciones */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filteredEvaluations.length === 0 ? (
        <div className="text-center py-10 bg-white border border-gray-200 rounded-lg">
          <FileText size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No se encontraron evaluaciones
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            {searchTerm || filterStatus ? 'Intenta con otros filtros' : 'Crea tu primera evaluación'}
          </p>
          {!searchTerm && !filterStatus && (
            <button
              onClick={handleCreateEvaluation}
              className="px-5 py-2.5 border-none rounded-lg bg-blue-500 text-white text-sm font-medium cursor-pointer hover:bg-blue-600"
            >
              Crear Evaluación
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Mostrando {filteredEvaluations.length} de {evaluations.length} evaluaciones
            </p>
            <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-2 hover:bg-gray-50">
              <Download size={16} />
              Exportar
            </button>
          </div>

          <div>
            {filteredEvaluations.map(evaluation => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                patient={getPatientById(evaluation.patientId)}
                onEdit={handleEditEvaluation}
                onView={handleViewEvaluation}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <EvaluationForm
          evaluation={editingEvaluation}
          isOpen={showForm}
          onClose={handleCloseForm}
          onSave={handleSaveEvaluation}
        />
      )}
    </div>
  );
};

export default Evaluaciones;