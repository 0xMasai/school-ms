import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ShieldOff } from 'lucide-react';

// Wrap a route element: <RoleGuard roles={['admin']}><Page /></RoleGuard>
const RoleGuard = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <ShieldOff className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="font-display text-xl font-700 text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm max-w-xs">
          You don't have permission to view this page.
          Contact your administrator if you think this is a mistake.
        </p>
      </div>
    );
  }

  return children;
};

// HOC version for programmatic use
export const withRole = (Component, roles) => {
  return (props) => (
    <RoleGuard roles={roles}>
      <Component {...props} />
    </RoleGuard>
  );
};

export default RoleGuard;
