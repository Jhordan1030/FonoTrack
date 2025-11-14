// src/pages/pacientes/PacienteDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText, 
  FolderOpen, 
  Edit,
  Plus,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { patientsService, evaluationsService, documentsService } from '../../services/api.js';
import PatientForm from '../../components/patients/PatientForm.jsx';
import EvaluationForm from '../../components/evaluations/EvaluationForm.jsx'; // 👈 IMPORTAR FORMULARIO DE EVALUACIÓN

const PacienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('informacion');
  const [showForm, setShowForm] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false); // 👈 ESTADO PARA FORMULARIO DE EVALUACIÓN
  const [selectedEvaluation, setSelectedEvaluation] = useState(null); // 👈 EVALUACIÓN SELECCIONADA PARA EDITAR

  useEffect(() => {
    if (id) {
      loadPacienteData();
    }
  }, [id]);

  const loadPacienteData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos del paciente
      const pacienteResponse = await patientsService.getById(id);
      setPaciente(pacienteResponse.data);

      // Cargar evaluaciones del paciente
      try {
        const evaluacionesResponse = await evaluationsService.getByPatient(id);
        console.log('🔍 Evaluaciones response:', evaluacionesResponse);
        
        // Asegurarnos de que siempre sea un array
        let evaluacionesData = [];
        if (Array.isArray(evaluacionesResponse.data)) {
          evaluacionesData = evaluacionesResponse.data;
        } else if (evaluacionesResponse.data?.evaluations && Array.isArray(evaluacionesResponse.data.evaluations)) {
          // 👈 CAMBIO: 'evaluations' en lugar de 'evaluaciones'
          evaluacionesData = evaluacionesResponse.data.evaluations;
        } else if (evaluacionesResponse.data?.evaluaciones && Array.isArray(evaluacionesResponse.data.evaluaciones)) {
          evaluacionesData = evaluacionesResponse.data.evaluaciones;
        } else if (evaluacionesResponse.data?.data && Array.isArray(evaluacionesResponse.data.data)) {
          evaluacionesData = evaluacionesResponse.data.data;
        }
        
        console.log('✅ Evaluaciones cargadas:', evaluacionesData.length);
        setEvaluaciones(evaluacionesData);
      } catch (error) {
        console.error('❌ Error loading evaluations:', error);
        setEvaluaciones([]);
      }

      // Cargar documentos del paciente
      try {
        const documentosResponse = await documentsService.getByPatient(id);
        
        // Asegurarnos de que siempre sea un array
        let documentosData = [];
        if (Array.isArray(documentosResponse.data)) {
          documentosData = documentosResponse.data;
        } else if (documentosResponse.data?.documents && Array.isArray(documentosResponse.data.documents)) {
          documentosData = documentosResponse.data.documents;
        } else if (documentosResponse.data?.data && Array.isArray(documentosResponse.data.data)) {
          documentosData = documentosResponse.data.data;
        }
        
        setDocumentos(documentosData);
      } catch (error) {
        console.error('Error loading documents:', error);
        setDocumentos([]); // Asegurar que sea un array vacío en caso de error
      }

    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'No disponible';
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return `${edad} años`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No registrada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const response = await documentsService.download(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error al descargar el documento');
    }
  };

  // FUNCIONES PARA MANEJAR EL FORMULARIO DE PACIENTE
  const handleEdit = () => {
    setShowForm(true);
  };

  const handleFormSave = () => {
    loadPacienteData();
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  // 👇 FUNCIONES PARA MANEJAR EVALUACIONES
  const handleCreateEvaluation = () => {
    setSelectedEvaluation(null);
    setShowEvaluationForm(true);
  };

  const handleEditEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowEvaluationForm(true);
  };

  const handleViewEvaluation = (evaluationId) => {
    navigate(`/evaluaciones/${evaluationId}`);
  };

  const handleDeleteEvaluation = async (evaluationId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
      try {
        await evaluationsService.delete(evaluationId);
        loadPacienteData(); // Recargar datos
        alert('Evaluación eliminada correctamente');
      } catch (error) {
        console.error('Error deleting evaluation:', error);
        alert('Error al eliminar la evaluación');
      }
    }
  };

  const handleEvaluationFormSave = () => {
    setShowEvaluationForm(false);
    setSelectedEvaluation(null);
    loadPacienteData(); // Recargar datos
  };

  const handleEvaluationFormClose = () => {
    setShowEvaluationForm(false);
    setSelectedEvaluation(null);
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #f3f4f6', 
              borderTop: '3px solid #3b82f6', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280' }}>Cargando información del paciente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <User size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <h2 style={{ color: '#374151', margin: '0 0 8px 0' }}>Paciente no encontrado</h2>
          <p style={{ color: '#6b7280', margin: '0 0 20px 0' }}>El paciente que buscas no existe o fue eliminado.</p>
          <Link 
            to="/pacientes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={16} />
            Volver a Pacientes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link 
          to="/pacientes"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => e.target.style.color = '#374151'}
          onMouseLeave={(e) => e.target.style.color = '#6b7280'}
        >
          <ArrowLeft size={16} />
          Volver a Pacientes
        </Link>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={32} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                {paciente.firstName} {paciente.lastName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} style={{ color: '#6b7280' }} />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {calcularEdad(paciente.dateOfBirth)}
                  </span>
                </div>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: paciente.isActive ? '#dcfce7' : '#fef2f2',
                  color: paciente.isActive ? '#166534' : '#dc2626',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {paciente.isActive ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            <Edit size={16} />
            Editar
          </button>
        </div>
      </div>

      {/* Pestañas */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        {[
          { id: 'informacion', label: 'Información General', icon: User },
          { id: 'evaluaciones', label: 'Evaluaciones', icon: FileText, count: evaluaciones.length },
          { id: 'documentos', label: 'Documentos', icon: FolderOpen, count: documentos.length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: activeTab === tab.id ? '#3b82f6' : '#e5e7eb',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenido de las pestañas */}
      <div>
        {/* Pestaña de Información General */}
        {activeTab === 'informacion' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Información Básica */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                  Información Básica
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                      Fecha de Nacimiento
                    </label>
                    <p style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
                      {formatearFecha(paciente.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                      Fecha de Ingreso
                    </label>
                    <p style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
                      {formatearFecha(paciente.admissionDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información Clínica */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                  Información Clínica
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                      Diagnóstico
                    </label>
                    <p style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
                      {paciente.diagnosis || 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                      Motivo de Consulta
                    </label>
                    <p style={{ fontSize: '14px', color: '#374151', margin: '0' }}>
                      {paciente.reasonForConsult}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas Generales */}
              {paciente.generalNotes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Notas Generales
                  </h3>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <p style={{ fontSize: '14px', color: '#374151', margin: '0', lineHeight: '1.5' }}>
                      {paciente.generalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 👇 PESTAÑA DE EVALUACIONES - ACTUALIZADA */}
        {activeTab === 'evaluaciones' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                Evaluaciones del Paciente
              </h3>
              <button 
                onClick={handleCreateEvaluation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                <Plus size={16} />
                Nueva Evaluación
              </button>
            </div>

            {evaluaciones.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '48px',
                textAlign: 'center'
              }}>
                <FileText size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                <h4 style={{ color: '#374151', margin: '0 0 8px 0' }}>No hay evaluaciones</h4>
                <p style={{ color: '#6b7280', margin: '0 0 20px 0' }}>
                  Aún no se han registrado evaluaciones para este paciente.
                </p>
                <button 
                  onClick={handleCreateEvaluation}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  Crear Primera Evaluación
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {evaluaciones.map((evaluacion) => (
                  <div
                    key={evaluacion.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '20px',
                      transition: 'box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                          Evaluación del {formatearFecha(evaluacion.evaluationDate)}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0', lineHeight: '1.5' }}>
                          {evaluacion.generalObservations ? 
                            evaluacion.generalObservations.substring(0, 100) + (evaluacion.generalObservations.length > 100 ? '...' : '') : 
                            'Sin observaciones'
                          }
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleViewEvaluation(evaluacion.id)}
                          title="Ver detalles"
                          style={{
                            padding: '6px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f3f4f6';
                            e.target.style.borderColor = '#9ca3af';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.borderColor = '#d1d5db';
                          }}
                        >
                          <Eye size={14} style={{ color: '#4b5563' }} />
                        </button>
                        <button 
                          onClick={() => handleEditEvaluation(evaluacion)}
                          title="Editar evaluación"
                          style={{
                            padding: '6px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f3f4f6';
                            e.target.style.borderColor = '#9ca3af';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.borderColor = '#d1d5db';
                          }}
                        >
                          <Edit size={14} style={{ color: '#4b5563' }} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvaluation(evaluacion.id)}
                          title="Eliminar evaluación"
                          style={{
                            padding: '6px',
                            border: '1px solid #fecaca',
                            borderRadius: '4px',
                            backgroundColor: '#fef2f2',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#fee2e2';
                            e.target.style.borderColor = '#fca5a5';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#fef2f2';
                            e.target.style.borderColor = '#fecaca';
                          }}
                        >
                          <Trash2 size={14} style={{ color: '#dc2626' }} />
                        </button>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      flexWrap: 'wrap',
                      fontSize: '12px', 
                      color: '#6b7280',
                      paddingTop: '12px',
                      borderTop: '1px solid #f3f4f6'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '500' }}>Voz:</span>
                        <span>{evaluacion.voiceQuality || 'No evaluado'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '500' }}>Lenguaje:</span>
                        <span>{evaluacion.comprehension || 'No evaluado'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '500' }}>Audición:</span>
                        <span>{evaluacion.hearingResult || 'No evaluado'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pestaña de Documentos */}
        {activeTab === 'documentos' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                Documentos del Paciente
              </h3>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                <Plus size={16} />
                Subir Documento
              </button>
            </div>

            {documentos.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '48px',
                textAlign: 'center'
              }}>
                <FolderOpen size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                <h4 style={{ color: '#374151', margin: '0 0 8px 0' }}>No hay documentos</h4>
                <p style={{ color: '#6b7280', margin: '0 0 20px 0' }}>
                  Aún no se han subido documentos para este paciente.
                </p>
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <Plus size={16} />
                  Subir Primer Documento
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {documentos.map((documento) => (
                  <div
                    key={documento.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={20} style={{ color: '#6b7280' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 2px 0' }}>
                          {documento.fileName}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                          {documento.fileType} • {Math.round(documento.fileSize / 1024)} KB • {formatearFecha(documento.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleDownloadDocument(documento.id, documento.fileName)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          color: '#374151',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={14} />
                        Descargar
                      </button>
                      <button style={{
                        padding: '8px',
                        border: '1px solid #fecaca',
                        borderRadius: '4px',
                        backgroundColor: '#fef2f2',
                        cursor: 'pointer'
                      }}>
                        <Trash2 size={14} style={{ color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FORMULARIO DE EDICIÓN DE PACIENTE */}
      {showForm && (
        <PatientForm
          patient={paciente}
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {/* 👇 FORMULARIO DE EVALUACIÓN */}
      {showEvaluationForm && (
        <EvaluationForm
          evaluation={selectedEvaluation}
          patientId={id}
          isOpen={showEvaluationForm}
          onClose={handleEvaluationFormClose}
          onSave={handleEvaluationFormSave}
        />
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PacienteDetail;