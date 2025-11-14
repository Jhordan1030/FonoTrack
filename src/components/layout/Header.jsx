import { Bell, User, Menu } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuToggle}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">FonoTrack</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <User size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;