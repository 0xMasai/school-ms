import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const AppLayout = ({ schoolName }) => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-body">
      {/* Sidebar */}
      <Sidebar onLogout={logout} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar schoolName={schoolName} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
