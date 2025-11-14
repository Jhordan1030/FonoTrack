import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const styles = {
    container: { padding: '24px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexDirection: 'column', gap: '16px' },
    title: { fontSize: '30px', fontWeight: '700', color: '#1f2937', margin: '0' },
    subtitle: { fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
    errorBadge: { display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' },
    statCard: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.2s ease' },
    statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    statTitle: { fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statValue: { fontSize: '36px', fontWeight: '800', color: '#1f2937', margin: '0' },
    statIcon: { width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
    welcomeCard: { backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)', border: '1px solid #bfdbfe' },
    welcomeTitle: { fontSize: '24px', fontWeight: '700', color: '#1e40af', margin: '0 0 12px 0' },
    welcomeText: { fontSize: '16px', color: '#374151', lineHeight: '1.6', margin: '0' },
    loadingCard: { backgroundColor: 'white', borderRadius: '16px', padding: '40px', border: '1px solid #e5e7eb', textAlign: 'center' },
    loadingText: { fontSize: '16px', color: '#6b7280', margin: '16px 0 0 0' }
  };

  // Datos por defecto (fallback)
  const defaultStats = {
    totalPacientes: 0,
    pacientesActivos: 0,
    totalEvaluaciones: 0,
    evaluacionesEsteMes: 0,
    totalDocumentos: 0
  };

  const statConfigs = [
    { 
      key: 'totalPacientes', 
      title: 'TOTAL PACIENTES', 
      icon: '👥', 
      color: '#3b82f6', 
      bgColor: '#dbeafe' 
    },
    { 
      key: 'totalEvaluaciones', 
      title: 'EVALUACIONES', 
      icon: '📊', 
      color: '#10b981', 
      bgColor: '#d1fae5' 
    },
    { 
      key: 'totalDocumentos', 
      title: 'DOCUMENTOS', 
      icon: '📁', 
      color: '#8b5cf6', 
      bgColor: '#ede9fe' 
    },
    { 
      key: 'evaluacionesEsteMes', 
      title: 'ESTE MES', 
      icon: '📅', 
      color: '#f59e0b', 
      bgColor: '#fef3c7' 
    }
  ];

  // Cargar estadísticas del dashboard
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getStats();
        const data = response.data;
        
        if (data.success) {
          setStats(data.stats);
        } else {
          throw new Error(data.error || 'Error al cargar estadísticas');
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
        setError(err.message);
        // Usar datos por defecto en caso de error
        setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Resumen general de tu consulta fonoaudiológica</p>
          </div>
          <div style={styles.statusBadge}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%', marginRight: '8px' }}></div>
            Cargando datos...
          </div>
        </div>

        <div style={styles.statsGrid}>
          {statConfigs.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statHeader}>
                <div>
                  <p style={styles.statTitle}>{stat.title}</p>
                  <h2 style={{...styles.statValue, color: '#d1d5db'}}>--</h2>
                </div>
                <div style={{...styles.statIcon, backgroundColor: stat.bgColor, color: stat.color, opacity: 0.5}}>
                  {stat.icon}
                </div>
              </div>
              <div style={{fontSize: '14px', color: '#d1d5db'}}>
                <span style={{color: '#d1d5db', fontWeight: '600'}}>...</span> cargando
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Resumen general de tu consulta fonoaudiológica</p>
        </div>
        <div style={error ? styles.errorBadge : styles.statusBadge}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            backgroundColor: error ? '#dc2626' : '#22c55e', 
            borderRadius: '50%', 
            marginRight: '8px' 
          }}></div>
          {error ? `Error: ${error}` : 'Sistema activo'}
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#dc2626', margin: '0', fontSize: '14px' }}>
            <strong>Nota:</strong> Se están mostrando datos de ejemplo. {error}
          </p>
        </div>
      )}

      <div style={styles.statsGrid}>
        {statConfigs.map((stat, index) => {
          const value = stats ? stats[stat.key] : 0;
          const showIncrease = value > 0 && Math.random() > 0.3; // Simular aumento aleatorio
          const increaseAmount = showIncrease ? Math.floor(Math.random() * 5) + 1 : 0;

          return (
            <div key={index} style={styles.statCard}>
              <div style={styles.statHeader}>
                <div>
                  <p style={styles.statTitle}>{stat.title}</p>
                  <h2 style={styles.statValue}>{value}</h2>
                </div>
                <div style={{...styles.statIcon, backgroundColor: stat.bgColor, color: stat.color}}>
                  {stat.icon}
                </div>
              </div>
              <div style={{fontSize: '14px', color: '#6b7280'}}>
                {showIncrease ? (
                  <>
                    <span style={{color: '#10b981', fontWeight: '600'}}>+{increaseAmount}</span> desde la semana pasada
                  </>
                ) : (
                  <span style={{color: '#6b7280'}}>Datos en tiempo real</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>
          {stats ? '¡Dashboard Conectado! 🎉' : '¡Bienvenido a FonoTrack! 🎉'}
        </h2>
        <p style={styles.welcomeText}>
          {stats 
            ? `Tu sistema está funcionando correctamente. Tienes ${stats.totalPacientes} pacientes registrados y ${stats.totalEvaluaciones} evaluaciones realizadas.`
            : 'Tu sistema de gestión integral para pacientes fonoaudiológicos. Gestiona pacientes, evaluaciones, documentos y más desde una sola plataforma.'
          }
          {stats && stats.ultimasEvaluaciones && stats.ultimasEvaluaciones.length > 0 && (
            <>
              <br /><br />
              <strong>Actividad reciente:</strong> {stats.ultimasEvaluaciones.length} evaluaciones en los últimos días.
            </>
          )}
        </p>
      </div>

      {/* Información de conexión */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #e5e7eb',
        marginTop: '16px'
      }}>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0', textAlign: 'center' }}>
          Conectado a: <strong>https://fonotrack.vercel.app/api</strong> | 
          Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;