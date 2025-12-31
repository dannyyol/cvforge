import { useState } from 'react';
import { Layout, Award, Menu, X } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  to: string; 
  icon: any; 
  label: string; 
  active: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={clsx(
      'layout-nav-item',
      active
        ? 'layout-nav-item-active'
        : 'layout-nav-item-inactive'
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </Link>
);

export const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2 text-blue-600">
          <img src="/images/logo.png" alt="CVForge" className="w-8 h-8" />
          <span className="text-lg font-bold tracking-tight">CVForge</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={clsx(
          "bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center text-blue-600">
              <img src="/images/colored-logo.png" alt="CVForge" className="w-10 h-10" />
              <span className="text-xl font-bold tracking-tight">CVForge</span>
            </div>
            <button 
              onClick={closeSidebar}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavItem 
              to="/editor" 
              icon={Layout} 
              label="Editor" 
              active={location.pathname === '/'} 
              onClick={closeSidebar}
            />
            <NavItem 
              to="/templates" 
              icon={Award} 
              label="Templates" 
              active={location.pathname === '/templates'} 
              onClick={closeSidebar}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
