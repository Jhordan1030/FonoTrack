import { Search } from 'lucide-react';

const Buscar = () => {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#1f2937', margin: '0' }}>Búsqueda</h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0' }}>Busca en todos los registros del sistema</p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '500px', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} />
            <input
              type="text"
              placeholder="Buscar pacientes, evaluaciones, diagnósticos..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Search size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', margin: '0' }}>
            Ingresa un término de búsqueda para encontrar información en el sistema
          </p>
        </div>
      </div>
    </div>
  );
};

export default Buscar;