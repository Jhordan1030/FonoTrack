import { Upload } from 'lucide-react';

const Documentos = () => {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1f2937', margin: '0' }}>Documentos</h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0' }}>Gestión de archivos y documentos</p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
          Gestión de Documentos
        </h2>
        <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>
          Sube y gestiona documentos, audios, imágenes y PDFs de tus pacientes.
          Todo se almacena de forma segura en la base de datos.
        </p>
        <button style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          <Upload size={18} />
          Subir Documento
        </button>
      </div>
    </div>
  );
};

export default Documentos;