// src/pages/evaluaciones/EvaluationDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Printer, Calendar, User, FileText } from 'lucide-react';
import { evaluationsService, patientsService } from '../../services/api';

const EvaluationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = async () => {
    try {
      setLoading(true);
      const response = await evaluationsService.getById(id);
      const evaluationData = response.data;
      setEvaluation(evaluationData);

      if (evaluationData.patientId) {
        const patientResponse = await patientsService.getById(evaluationData.patientId);
        setPatient(patientResponse.data);
      }
    } catch (error) {
      console.error('Error loading evaluation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate(`/evaluaciones/editar/${id}`);
  };

  const handleBack = () => {
    navigate('/evaluaciones');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Evaluación no encontrada</h2>
        <button onClick={handleBack}>Volver a la lista</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleBack} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
              Evaluación #{evaluation.id?.slice(-6) || 'N/A'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} style={{ color: '#6b7280' }} />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {new Date(evaluation.evaluationDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={14} style={{ color: '#6b7280' }} />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {patient ? `${patient.firstName} ${patient.lastName}` : 'Paciente no encontrado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handlePrint} style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Printer size={16} />
            Imprimir
          </button>
          <button onClick={handleEdit} style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Edit size={16} />
            Editar
          </button>
        </div>
      </div>

      {/* Contenido de la evaluación */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Información del paciente */}
        {patient && (
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Información del Paciente</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Nombre completo</div>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{patient.firstName} {patient.lastName}</div>
              </div>
              {patient.documentNumber && (
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Documento</div>
                  <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{patient.documentNumber}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resultados de la evaluación */}
        {(evaluation.voiceQuality || evaluation.voiceIntensity || evaluation.voiceNotes) && (
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: '#3b82f6' }} />
              Evaluación de Voz
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {evaluation.voiceQuality && (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Calidad Vocal</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{evaluation.voiceQuality}</div>
                </div>
              )}
              {evaluation.voiceIntensity && (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Intensidad</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{evaluation.voiceIntensity}</div>
                </div>
              )}
            </div>
            {evaluation.voiceNotes && (
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Observaciones</div>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{evaluation.voiceNotes}</div>
              </div>
            )}
          </div>
        )}

        {/* Más secciones... (similar estructura para lenguaje, audición, deglución) */}

        {/* Observaciones Generales */}
        {evaluation.generalObservations && (
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>Observaciones Generales</h3>
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {evaluation.generalObservations}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {evaluation.recommendations && (
          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0369a1', margin: '0 0 16px 0' }}>Recomendaciones</h3>
            <div style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {evaluation.recommendations}
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media print {
            button { display: none !important; }
          }
        `}
      </style>
    </div>
  );
};

export default EvaluationDetail;