// src/pages/Pacientes.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, User, Loader } from 'lucide-react';
import { patientsService } from '../services/api.js';
import PatientForm from '../components/patients/PatientForm.jsx';

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Cargar pacientes desde la API
  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientsService.getAll();
      
      // Verificar la estructura de la respuesta
      if (response.data && Array.isArray(response.data)) {
        // Mapear los datos de la API al formato que espera el componente
        const pacientesFormateados = response.data.map(paciente => ({
          id: paciente.id,
          firstName: paciente.firstName,
          lastName: paciente.lastName,
          dateOfBirth: paciente.dateOfBirth,
          diagnosis: paciente.diagnosis,
          reasonForConsult: paciente.reasonForConsult,
          generalNotes: paciente.generalNotes,
          isActive: paciente.isActive !== undefined ? paciente.isActive : true,
          admissionDate: paciente.admissionDate,
          updatedAt: paciente.updatedAt
        }));
        
        setPacientes(pacientesFormateados);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      console.error('Error cargando pacientes:', err);
      setError('Error al cargar los pacientes. ' + (err.response?.data?.error || err.message));
      
      // Datos de ejemplo como fallback
      setPacientes([
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          dateOfBirth: '2015-05-20',
          diagnosis: 'Retraso del lenguaje',
          reasonForConsult: 'Dificultad para pronunciar palabras',
          generalNotes: 'Paciente muestra buena disposición',
          isActive: true,
          admissionDate: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          firstName: 'María',
          lastName: 'García',
          dateOfBirth: '2016-03-10',
          diagnosis: 'Trastorno de fluidez',
          reasonForConsult: 'Tartamudez',
          generalNotes: 'Paciente tímida pero colaboradora',
          isActive: true,
          admissionDate: '2024-01-10',
          updatedAt: '2024-01-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular la edad desde la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'Edad no disponible';
    
    try {
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      
      return `${edad} años`;
    } catch (error) {
      return 'Edad no disponible';
    }
  };

  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No registrada';
    
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleDelete = async (pacienteId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
      try {
        await patientsService.delete(pacienteId);
        await loadPacientes(); // Recargar la lista
      } catch (err) {
        console.error('Error eliminando paciente:', err);
        alert('Error al eliminar el paciente: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleEdit = (paciente) => {
    setEditingPatient(paciente);
    setShowForm(true);
  };

  const handleNewPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleFormSave = () => {
    loadPacientes(); // Recargar la lista después de guardar
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  // Filtrar pacientes basado en la búsqueda
  const pacientesFiltrados = pacientes.filter(paciente =>
    `${paciente.firstName} ${paciente.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paciente.diagnosis && paciente.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1f2937', margin: '0' }}>
            Pacientes
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Gestiona la información de tus pacientes
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Barra de búsqueda */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={20} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af' 
              }} />
              <input
                type="text"
                placeholder="Buscar pacientes por nombre o diagnóstico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Botón nuevo paciente */}
            <button
              onClick={handleNewPatient}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <Plus size={18} />
              Nuevo Paciente
            </button>
          </div>
        </div>
      </div>

      {/* Contador */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px 20px', 
        borderRadius: '8px', 
        border: '1px solid #e5e7eb',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? (
            <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          )}
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {loading ? 'Cargando...' : `Mostrando ${pacientesFiltrados.length} de ${pacientes.length} pacientes`}
          </span>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <p style={{ color: '#dc2626', margin: '0 0 4px 0', fontSize: '14px' }}>{error}</p>
          <p style={{ color: '#b91c1c', margin: '0', fontSize: '12px' }}>Se muestran datos de ejemplo</p>
        </div>
      )}

      {/* Lista de Pacientes */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* Header de la tabla */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
            Lista de Pacientes ({pacientesFiltrados.length})
          </h2>
        </div>

        {/* Contenido de la tabla */}
        <div style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px' }}>
              <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: '#3b82f6' }} />
              <span style={{ marginLeft: '12px', color: '#6b7280' }}>Cargando pacientes...</span>
            </div>
          ) : (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280', 
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Paciente
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280', 
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Edad
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280', 
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Diagnóstico
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280', 
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Última Actualización
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280', 
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Estado
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280', 
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map((paciente) => (
                    <tr 
                      key={paciente.id} 
                      style={{ 
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#dbeafe',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            flexShrink: 0
                          }}>
                            <User size={20} style={{ color: '#3b82f6' }} />
                          </div>
                          <div>
                            {/* ENLACE CLICABLE AL NOMBRE DEL PACIENTE */}
                            <Link 
                              to={`/pacientes/${paciente.id}`}
                              style={{
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#1f2937',
                                textDecoration: 'none',
                                display: 'block',
                                transition: 'color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                              onMouseLeave={(e) => e.target.style.color = '#1f2937'}
                            >
                              {paciente.firstName} {paciente.lastName}
                            </Link>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#6b7280',
                              marginTop: '2px'
                            }}>
                              Ingreso: {formatearFecha(paciente.admissionDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                        {calcularEdad(paciente.dateOfBirth)}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                        {paciente.diagnosis || 'Sin diagnóstico'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                        {formatearFecha(paciente.updatedAt)}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '6px',
                          backgroundColor: paciente.isActive ? '#dcfce7' : '#fef2f2',
                          color: paciente.isActive ? '#166534' : '#dc2626'
                        }}>
                          {paciente.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(paciente)}
                            style={{
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
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
                            title="Editar paciente"
                          >
                            <Edit size={16} style={{ color: '#4b5563' }} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(paciente.id)}
                            style={{
                              padding: '8px',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
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
                            title="Eliminar paciente"
                          >
                            <Trash2 size={16} style={{ color: '#dc2626' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pacientesFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                  <User size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                  <p style={{ color: '#6b7280', fontSize: '16px', margin: '0 0 16px 0' }}>
                    {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda' : 'No hay pacientes registrados'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={handleNewPatient}
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
                      Agregar primer paciente
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Paciente */}
      {showForm && (
        <PatientForm
          patient={editingPatient}
          isOpen={showForm}
          onClose={handleFormClose}
          onSave={handleFormSave}
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

export default Pacientes;