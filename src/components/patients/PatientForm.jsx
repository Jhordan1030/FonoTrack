// src/components/patients/PatientForm.jsx
import { useState, useEffect } from 'react';
import { X, Save, User, Calendar, FileText, AlertCircle } from 'lucide-react';
import { patientsService } from '../../services/api.js';

const PatientForm = ({ patient, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    diagnosis: '',
    reasonForConsult: '',
    generalNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Inicializar formulario cuando se abre o cambia el paciente
  useEffect(() => {
    if (patient) {
      // Editar paciente existente
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
        diagnosis: patient.diagnosis || '',
        reasonForConsult: patient.reasonForConsult || '',
        generalNotes: patient.generalNotes || ''
      });
    } else {
      // Nuevo paciente - reset form
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        diagnosis: '',
        reasonForConsult: '',
        generalNotes: ''
      });
    }
    setErrors({});
  }, [patient, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'La fecha de nacimiento no puede ser futura';
      }
    }
    if (!formData.reasonForConsult.trim()) {
      newErrors.reasonForConsult = 'El motivo de consulta es requerido';
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
      if (patient) {
        // Actualizar paciente existente
        const response = await patientsService.update(patient.id, formData);
        console.log('✅ Paciente actualizado:', response.data);
      } else {
        // Crear nuevo paciente
        const response = await patientsService.create(formData);
        console.log('✅ Paciente creado:', response.data);
      }
      
      onSave(); // Notificar que se guardó correctamente
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error saving patient:', error);
      setErrors({ 
        submit: error.response?.data?.error || 'Error al guardar el paciente. Por favor, intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} años`;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <User size={24} style={{ color: '#3b82f6' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#6b7280'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '24px' }}>
            {errors.submit && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <AlertCircle size={16} style={{ color: '#dc2626' }} />
                <span style={{ color: '#dc2626', fontSize: '14px' }}>{errors.submit}</span>
              </div>
            )}

            {/* Información Básica */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 16px 0' }}>
                Información Básica
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Nombre */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${errors.firstName ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = errors.firstName ? '#dc2626' : '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = errors.firstName ? '#dc2626' : '#d1d5db'}
                    placeholder="Ingresa el nombre"
                  />
                  {errors.firstName && (
                    <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.firstName}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${errors.lastName ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = errors.lastName ? '#dc2626' : '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = errors.lastName ? '#dc2626' : '#d1d5db'}
                    placeholder="Ingresa el apellido"
                  />
                  {errors.lastName && (
                    <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div style={{ marginTop: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Fecha de Nacimiento *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '200px' }}>
                    <Calendar size={16} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        border: `1px solid ${errors.dateOfBirth ? '#dc2626' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = errors.dateOfBirth ? '#dc2626' : '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = errors.dateOfBirth ? '#dc2626' : '#d1d5db'}
                    />
                  </div>
                  {formData.dateOfBirth && (
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      Edad: {calculateAge(formData.dateOfBirth)}
                    </span>
                  )}
                </div>
                {errors.dateOfBirth && (
                  <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.dateOfBirth}</p>
                )}
              </div>
            </div>

            {/* Información Clínica */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 16px 0' }}>
                Información Clínica
              </h3>

              {/* Diagnóstico */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Diagnóstico
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Ej: Retraso del lenguaje, Trastorno de fluidez, etc."
                />
              </div>

              {/* Motivo de Consulta */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Motivo de Consulta *
                </label>
                <textarea
                  name="reasonForConsult"
                  value={formData.reasonForConsult}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${errors.reasonForConsult ? '#dc2626' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = errors.reasonForConsult ? '#dc2626' : '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = errors.reasonForConsult ? '#dc2626' : '#d1d5db'}
                  placeholder="Describe el motivo principal de la consulta..."
                />
                {errors.reasonForConsult && (
                  <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0 0' }}>{errors.reasonForConsult}</p>
                )}
              </div>

              {/* Notas Generales */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Notas Generales
                </label>
                <textarea
                  name="generalNotes"
                  value={formData.generalNotes}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Observaciones adicionales sobre el paciente..."
                />
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'white')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#3b82f6')}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {patient ? 'Actualizar' : 'Crear'} Paciente
                </>
              )}
            </button>
          </div>
        </form>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PatientForm;