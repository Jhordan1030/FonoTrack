// src/pages/evaluaciones/CreateEvaluation.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EvaluationForm from '../../components/evaluations/EvaluationForm';
import { evaluationsService } from '../../services/api';

const CreateEvaluation = () => {
  const navigate = useNavigate();
  const { patientId, id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Modo edición: cargar evaluación existente
      loadEvaluation();
    }
  }, [id]);

  const loadEvaluation = async () => {
    try {
      const response = await evaluationsService.getById(id);
      setEvaluation(response.data);
    } catch (error) {
      console.error('Error loading evaluation:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/evaluaciones');
    }, 1000);
  };

  const handleClose = () => {
    navigate('/evaluaciones');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={handleClose} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            {id ? 'Editar Evaluación' : 'Nueva Evaluación'}
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
            {id ? 'Modifica los campos necesarios' : 'Completa todos los campos para crear una nueva evaluación'}
          </p>
        </div>
      </div>

      <EvaluationForm
        evaluation={evaluation}
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        patientId={patientId}
      />
    </div>
  );
};

export default CreateEvaluation;