// src/components/evaluations/EvaluationCard.jsx
import { Calendar, User, Edit, Eye, FileText } from 'lucide-react';

const EvaluationCard = ({ evaluation, onEdit, onView, patient }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAreaStatus = (areaData) => {
    if (!areaData) return 'No evaluado';
    if (areaData === 'Normal' || areaData === 'Excelente' || areaData === 'Eficiente') 
      return 'Normal';
    return 'Requiere atención';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-blue-500" />
            <h3 className="text-base font-semibold text-gray-800">
              Evaluación #{evaluation.id?.slice(-6) || 'N/A'}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(evaluation.status || 'COMPLETED')}`}>
              {evaluation.status || 'COMPLETED'}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {patient ? `${patient.firstName} ${patient.lastName}` : 'Paciente no encontrado'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-sm text-gray-500">
              {new Date(evaluation.evaluationDate).toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onView(evaluation)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-xs font-medium cursor-pointer flex items-center gap-1 hover:bg-gray-50"
          >
            <Eye size={14} />
            Ver
          </button>
          <button
            onClick={() => onEdit(evaluation)}
            className="px-3 py-1.5 border border-blue-500 rounded-lg bg-blue-500 text-white text-xs font-medium cursor-pointer flex items-center gap-1 hover:bg-blue-600"
          >
            <Edit size={14} />
            Editar
          </button>
        </div>
      </div>

      {/* Resumen de áreas evaluadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-0.5">Voz</div>
          <div className={`text-xs px-1.5 py-0.5 rounded ${
            getAreaStatus(evaluation.voiceQuality) === 'Normal' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {getAreaStatus(evaluation.voiceQuality)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-gray-500 mb-0.5">Lenguaje</div>
          <div className={`text-xs px-1.5 py-0.5 rounded ${
            getAreaStatus(evaluation.comprehension) === 'Normal' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {getAreaStatus(evaluation.comprehension)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-gray-500 mb-0.5">Audición</div>
          <div className={`text-xs px-1.5 py-0.5 rounded ${
            getAreaStatus(evaluation.hearingResult) === 'Normal' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {getAreaStatus(evaluation.hearingResult)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-gray-500 mb-0.5">Deglución</div>
          <div className={`text-xs px-1.5 py-0.5 rounded ${
            getAreaStatus(evaluation.oralPhase) === 'Normal' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {getAreaStatus(evaluation.oralPhase)}
          </div>
        </div>
      </div>

      {/* Observaciones generales preview */}
      {evaluation.generalObservations && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">
            Observaciones:
          </div>
          <p className="text-xs text-gray-700 line-clamp-2">
            {evaluation.generalObservations}
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationCard;