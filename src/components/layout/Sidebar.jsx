// src/components/layout/Sidebar.jsx
import { 
    Users, 
    FileText, 
    BarChart3, 
    Search, 
    FolderOpen, 
    Home,
    ChevronLeft,
    ChevronRight 
  } from 'lucide-react';
  import { useState } from 'react';
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Pacientes', path: '/pacientes' },
    { icon: FileText, label: 'Evaluaciones', path: '/evaluaciones' },
    { icon: FolderOpen, label: 'Documentos', path: '/documentos' },
    { icon: Search, label: 'Búsqueda', path: '/buscar' },
  ];
  
  const Sidebar = ({ isOpen, onClose }) => {
    const [collapsed, setCollapsed] = useState(false);
    const currentPath = window.location.pathname;
  
    return (
      <>
        {/* Overlay para móvil */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-64'}
          flex flex-col
        `}>
          {/* Logo */}
          <div className={`flex items-center ${collapsed ? 'justify-center p-4' : 'justify-between p-6'} border-b border-gray-200`}>
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">FT</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">FonoTrack</h2>
                  <p className="text-xs text-gray-500">Panel de control</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">FT</span>
              </div>
            )}
            
            {/* Botón colapsar */}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
  
          {/* Navegación */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                
                return (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className={`
                        flex items-center rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary-50 to-blue-50 text-primary-600 border-r-2 border-primary-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${collapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2.5'}
                      `}
                    >
                      <Icon size={20} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                      {!collapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
  
          {/* Footer */}
          <div className={`p-4 border-t border-gray-200 ${collapsed ? 'text-center' : ''}`}>
            <div className={`text-xs text-gray-500 ${collapsed ? '' : 'text-center'}`}>
              v1.0.0
            </div>
          </div>
        </aside>
      </>
    );
  };
  
  export default Sidebar;