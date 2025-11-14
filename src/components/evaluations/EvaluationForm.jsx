// src/components/evaluations/EvaluationForm.jsx
import { useState, useEffect } from 'react';
import { X, Save, FileText, Calendar, User } from 'lucide-react';
import { evaluationsService, patientsService } from '../../services/api.js';

const EvaluationForm = ({ evaluation, isOpen, onClose, onSave, patientId }) => {
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    evaluationDate: new Date().toISOString().split('T')[0],
    voiceQuality: '',
    voiceIntensity: '',
    voiceNotes: '',
    comprehension: '',
    expression: '',
    languageNotes: '',
    hearingResult: '',
    hearingNotes: '',
    oralPhase: '',
    pharyngealPhase: '',
    swallowingNotes: '',
    generalObservations: '',
    recommendations: ''
  });
  
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadPatients();
      if (evaluation) {
        setFormData({
          patientId: evaluation.patientId || patientId || '',
          evaluationDate: evaluation.evaluationDate ? evaluation.evaluationDate.split('T')[0] : new Date().toISOString().split('T')[0],
          voiceQuality: evaluation.voiceQuality || '',
          voiceIntensity: evaluation.voiceIntensity || '',
          voiceNotes: evaluation.voiceNotes || '',
          comprehension: evaluation.comprehension || '',
          expression: evaluation.expression || '',
          languageNotes: evaluation.languageNotes || '',
          hearingResult: evaluation.hearingResult || '',
          hearingNotes: evaluation.hearingNotes || '',
          oralPhase: evaluation.oralPhase || '',
          pharyngealPhase: evaluation.pharyngealPhase || '',
          swallowingNotes: evaluation.swallowingNotes || '',
          generalObservations: evaluation.generalObservations || '',
          recommendations: evaluation.recommendations || ''
        });
      } else {
        setFormData(prev => ({
          ...prev,
          patientId: patientId || '',
          evaluationDate: new Date().toISOString().split('T')[0]
        }));
      }
      setErrors({});
    }
  }, [evaluation, isOpen, patientId]);

  const loadPatients = async () => {
    try {
      const response = await patientsService.getAll();
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecciona un paciente';
    }
    if (!formData.evaluationDate) {
      newErrors.evaluationDate = 'La fecha de evaluación es requerida';
    }
    if (!formData.generalObservations) {
      newErrors.generalObservations = 'Las observaciones generales son requeridas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (evaluation) {
        await evaluationsService.update(evaluation.id, formData);
      } else {
        await evaluationsService.create(formData);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving evaluation:', error);
      setErrors({ 
        submit: error.response?.data?.error || 'Error al guardar la evaluación. Por favor, intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {evaluation ? 'Editar Evaluación' : 'Nueva Evaluación'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border-none bg-transparent cursor-pointer text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6">
            {errors.submit && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-5">
                <span className="text-red-600 text-sm">{errors.submit}</span>
              </div>
            )}

            {/* Información Básica */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paciente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paciente *
                  </label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    disabled={!!patientId}
                    className={`w-full p-2.5 border rounded-lg text-sm outline-none ${
                      errors.patientId ? 'border-red-500' : 'border-gray-300'
                    } ${patientId ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
                  >
                    <option value="">Seleccionar paciente</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                  {errors.patientId && (
                    <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>
                  )}
                </div>

                {/* Fecha de Evaluación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Evaluación *
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="evaluationDate"
                      value={formData.evaluationDate}
                      onChange={handleChange}
                      className={`w-full p-2.5 pl-10 border rounded-lg text-sm outline-none ${
                        errors.evaluationDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.evaluationDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.evaluationDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Evaluación de Voz */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Evaluación de Voz
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calidad Vocal
                  </label>
                  <select
                    name="voiceQuality"
                    value={formData.voiceQuality}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Normal">Normal</option>
                    <option value="Ronca">Ronca</option>
                    <option value="Débil">Débil</option>
                    <option value="Forzada">Forzada</option>
                    <option value="Entre cortada">Entre cortada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intensidad
                  </label>
                  <select
                    name="voiceIntensity"
                    value={formData.voiceIntensity}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Baja">Baja</option>
                    <option value="Variable">Variable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones de Voz
                </label>
                <textarea
                  name="voiceNotes"
                  value={formData.voiceNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-vertical font-inherit"
                  placeholder="Observaciones específicas sobre la voz..."
                />
              </div>
            </div>

            {/* Evaluación de Lenguaje */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Evaluación de Lenguaje
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comprensión
                  </label>
                  <select
                    name="comprehension"
                    value={formData.comprehension}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Limitada">Limitada</option>
                    <option value="Severamente afectada">Severamente afectada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expresión
                  </label>
                  <select
                    name="expression"
                    value={formData.expression}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Fluida">Fluida</option>
                    <option value="Adecuada">Adecuada</option>
                    <option value="Limitada">Limitada</option>
                    <option value="Con dificultades">Con dificultades</option>
                    <option value="Severamente afectada">Severamente afectada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones de Lenguaje
                </label>
                <textarea
                  name="languageNotes"
                  value={formData.languageNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-vertical font-inherit"
                  placeholder="Observaciones sobre comprensión y expresión..."
                />
              </div>
            </div>

            {/* Evaluación de Audición */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Evaluación de Audición
              </h3>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resultado Auditivo
                </label>
                <select
                  name="hearingResult"
                  value={formData.hearingResult}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                >
                  <option value="">Seleccionar</option>
                  <option value="Normal">Normal</option>
                  <option value="Pérdida leve">Pérdida leve</option>
                  <option value="Pérdida moderada">Pérdida moderada</option>
                  <option value="Pérdida severa">Pérdida severa</option>
                  <option value="Pérdida profunda">Pérdida profunda</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones Auditivas
                </label>
                <textarea
                  name="hearingNotes"
                  value={formData.hearingNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-vertical font-inherit"
                  placeholder="Observaciones específicas sobre la audición..."
                />
              </div>
            </div>

            {/* Evaluación de Deglución */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Evaluación de Deglución
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fase Oral
                  </label>
                  <select
                    name="oralPhase"
                    value={formData.oralPhase}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Eficiente">Eficiente</option>
                    <option value="Con dificultades leves">Con dificultades leves</option>
                    <option value="Con dificultades moderadas">Con dificultades moderadas</option>
                    <option value="Con dificultades severas">Con dificultades severas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fase Faríngea
                  </label>
                  <select
                    name="pharyngealPhase"
                    value={formData.pharyngealPhase}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Coordinada">Coordinada</option>
                    <option value="Con retraso leve">Con retraso leve</option>
                    <option value="Con retraso moderado">Con retraso moderado</option>
                    <option value="Con retraso severo">Con retraso severo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones de Deglución
                </label>
                <textarea
                  name="swallowingNotes"
                  value={formData.swallowingNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-vertical font-inherit"
                  placeholder="Observaciones sobre el proceso de deglución..."
                />
              </div>
            </div>

            {/* Observaciones y Recomendaciones */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Observaciones y Recomendaciones
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones Generales *
                </label>
                <textarea
                  name="generalObservations"
                  value={formData.generalObservations}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-2.5 border rounded-lg text-sm outline-none resize-vertical font-inherit ${
                    errors.generalObservations ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Resumen general de la evaluación, hallazgos principales, impresiones clínicas..."
                />
                {errors.generalObservations && (
                  <p className="text-red-500 text-xs mt-1">{errors.generalObservations}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recomendaciones
                </label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-vertical font-inherit"
                  placeholder="Recomendaciones terapéuticas, seguimiento, ejercicios..."
                />
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="px-6 py-5 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 border-none rounded-lg bg-blue-500 text-white text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-blue-600"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {evaluation ? 'Actualizar' : 'Crear'} Evaluación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationForm;