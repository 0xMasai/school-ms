import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { NAV_ITEMS, ROLE_LABELS, ROLE_COLORS } from '../../utils/constants.js';
import { Badge } from '../common/Badge.jsx';

const getPageTitle = (pathname) => {
  if (pathname === '/') return { title: 'Dashboard', subtitle: 'Welcome back' };
  const item = NAV_ITEMS.find(
    (i) => i.path && i.path !== '/' && pathname.startsWith(i.path)
  );
  return item ? { title: item.label, subtitle: null } : { title: 'Page', subtitle: null };
};

const Topbar = ({ schoolName }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { title, subtitle } = getPageTitle(location.pathname);
  const today = new Date().toLocaleDateString('en-UG', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <header className="h-14 bg-white border-b border-slate-100 shadow-sm flex items-center px-6 gap-4 flex-shrink-0">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-slate-900 text-base truncate">{title}</h2>
          {subtitle && <span className="text-slate-400 text-xs hidden sm:inline">— {subtitle}</span>}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <span className="text-xs text-slate-400 hidden md:block">{today}</span>

        {/* School name chip */}
        {schoolName && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-medium truncate max-w-32">{schoolName}</span>
          </div>
        )}

        {/* Role badge */}
        <Badge className={ROLE_COLORS[user?.role]}>{ROLE_LABELS[user?.role]}</Badge>
      </div>
    </header>
  );
};

export default Topbar;
