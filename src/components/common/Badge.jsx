import { InboxIcon } from 'lucide-react';

// ─── Badge ────────────────────────────────────────────────────────────────────
const badgeVariants = {
  default:   'bg-slate-100 text-slate-700',
  success:   'bg-emerald-100 text-emerald-800',
  warning:   'bg-amber-100 text-amber-800',
  danger:    'bg-red-100 text-red-700',
  info:      'bg-blue-100 text-blue-800',
  navy:      'bg-navy-100 text-navy-800',
  purple:    'bg-purple-100 text-purple-800',
};

export const Badge = ({ children, variant = 'default', className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeVariants[variant]} ${className}`}>
    {children}
  </span>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusMap = {
  active:      { label: 'Active',      variant: 'success'  },
  inactive:    { label: 'Inactive',    variant: 'default'  },
  transferred: { label: 'Transferred', variant: 'info'     },
  graduated:   { label: 'Graduated',   variant: 'navy'     },
  suspended:   { label: 'Suspended',   variant: 'danger'   },
  present:     { label: 'Present',     variant: 'success'  },
  absent:      { label: 'Absent',      variant: 'danger'   },
  late:        { label: 'Late',        variant: 'warning'  },
  excused:     { label: 'Excused',     variant: 'info'     },
};

export const StatusBadge = ({ status }) => {
  const s = statusMap[status] || { label: status, variant: 'default' };
  return <Badge variant={s.variant}>{s.label}</Badge>;
};

// ─── Grade Badge ──────────────────────────────────────────────────────────────
const gradeVariants = { A: 'success', B: 'info', C: 'warning', D: 'default', F: 'danger' };
export const GradeBadge = ({ grade }) => (
  <Badge variant={gradeVariants[grade] || 'default'}>{grade}</Badge>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon = InboxIcon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-slate-400" />
    </div>
    <h3 className="font-display font-semibold text-slate-700 mb-1">{title}</h3>
    {message && <p className="text-sm text-slate-500 max-w-xs mb-4">{message}</p>}
    {action}
  </div>
);

// ─── PageHeader ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'navy', trend }) => {
  const colors = {
    navy:    { bg: 'bg-navy-900',    icon: 'bg-navy-800',    text: 'text-navy-100'  },
    amber:   { bg: 'bg-amber-500',   icon: 'bg-amber-600',   text: 'text-amber-100' },
    emerald: { bg: 'bg-emerald-600', icon: 'bg-emerald-700', text: 'text-emerald-100' },
    blue:    { bg: 'bg-blue-600',    icon: 'bg-blue-700',    text: 'text-blue-100'  },
    purple:  { bg: 'bg-purple-600',  icon: 'bg-purple-700',  text: 'text-purple-100'},
  };
  const c = colors[color] || colors.navy;

  return (
    <div className={`${c.bg} rounded-2xl p-5 text-white relative overflow-hidden`}>
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-white" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${c.text} mb-1`}>{title}</p>
          <p className="font-display text-3xl font-bold">{value}</p>
          {subtitle && <p className={`text-xs mt-1 ${c.text}`}>{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`${c.icon} w-10 h-10 rounded-xl flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-white rounded-2xl shadow-card border border-slate-100 ${padding ? 'p-5' : ''} ${className}`}>
    {children}
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={`${sz[size]} border-2 border-slate-200 border-t-navy-600 rounded-full animate-spin`} />
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center h-full gap-3">
    <Spinner size="lg" />
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);
