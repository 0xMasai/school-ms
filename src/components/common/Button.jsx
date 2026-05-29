import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-navy-900 hover:bg-navy-800 text-white shadow-sm',
  secondary: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  ghost:     'hover:bg-slate-100 text-slate-600',
  amber:     'bg-amber-500 hover:bg-amber-600 text-white shadow-sm',
  success:   'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
};

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-body font-medium rounded-lg
        transition-all duration-150 cursor-pointer select-none
        focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className={size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
      {children}
      {iconRight && !loading && (
        <iconRight className={size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
    </button>
  );
};

export default Button;
