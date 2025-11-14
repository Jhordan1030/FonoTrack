// src/pages/Dashboard.jsx - VERSIÓN CORREGIDA
const Dashboard = () => {
    const styles = {
      container: {
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexDirection: 'column',
        gap: '16px'
      },
      title: {
        fontSize: '30px',
        fontWeight: '700',
        color: '#1f2937',
        margin: '0'
      },
      subtitle: {
        fontSize: '16px',
        color: '#6b7280',
        margin: '4px 0 0 0'
      },
      statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: '#dcfce7',
        color: '#166534',
        border: '1px solid #bbf7d0'
      },
      statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      },
      statCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      },
      statHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      },
      statTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#6b7280',
        margin: '0',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      },
      statValue: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#1f2937',
        margin: '0'
      },
      statIcon: {
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
      },
      welcomeCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
        border: '1px solid #bfdbfe' // 👈 SOLO UN BORDER AQUÍ
      },
      welcomeTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1e40af',
        margin: '0 0 12px 0'
      },
      welcomeText: {
        fontSize: '16px',
        color: '#374151',
        lineHeight: '1.6',
        margin: '0'
      }
    };
  
    const stats = [
      { title: 'TOTAL PACIENTES', value: '12', icon: '👥', color: '#3b82f6', bgColor: '#dbeafe' },
      { title: 'EVALUACIONES', value: '45', icon: '📊', color: '#10b981', bgColor: '#d1fae5' },
      { title: 'DOCUMENTOS', value: '23', icon: '📁', color: '#8b5cf6', bgColor: '#ede9fe' },
      { title: 'ESTE MES', value: '8', icon: '📅', color: '#f59e0b', bgColor: '#fef3c7' }
    ];
  
    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Resumen general de tu consulta fonoaudiológica</p>
          </div>
          <div style={styles.statusBadge}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              marginRight: '8px'
            }}></div>
            Sistema activo
          </div>
        </div>
  
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.statHeader}>
                <div>
                  <p style={styles.statTitle}>{stat.title}</p>
                  <h2 style={styles.statValue}>{stat.value}</h2>
                </div>
                <div style={{...styles.statIcon, backgroundColor: stat.bgColor, color: stat.color}}>
                  {stat.icon}
                </div>
              </div>
              <div style={{fontSize: '14px', color: '#6b7280'}}>
                <span style={{color: '#10b981', fontWeight: '600'}}>+2</span> desde la semana pasada
              </div>
            </div>
          ))}
        </div>
  
        {/* Welcome Message */}
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>¡Bienvenido a FonoTrack! 🎉</h2>
          <p style={styles.welcomeText}>
            Tu sistema de gestión integral para pacientes fonoaudiológicos. 
            Gestiona pacientes, evaluaciones, documentos y más desde una sola plataforma. 
            Comienza explorando las diferentes secciones desde el menú lateral.
          </p>
        </div>
      </div>
    );
  };
  
  export default Dashboard;