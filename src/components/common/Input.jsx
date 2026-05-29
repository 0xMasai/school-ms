// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({
  label, error, hint, required, className = '', icon: Icon, ...props
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      )}
      <input
        className={`
          w-full h-9 rounded-lg border bg-white text-sm text-slate-800
          placeholder:text-slate-400 transition-colors
          focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 hover:border-slate-300'}
          ${Icon ? 'pl-9 pr-3' : 'px-3'}
        `}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-600">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = ({
  label, error, hint, required, children, className = '', placeholder, ...props
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <select
      className={`
        w-full h-9 rounded-lg border bg-white text-sm text-slate-800 px-3
        focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent
        disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors
        ${error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}
      `}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
    {error && <p className="text-xs text-red-600">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = ({
  label, error, hint, required, rows = 3, className = '', ...props
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      className={`
        w-full rounded-lg border bg-white text-sm text-slate-800 px-3 py-2
        placeholder:text-slate-400 resize-none transition-colors
        focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent
        ${error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

// ─── FormRow ──────────────────────────────────────────────────────────────────
export const FormRow = ({ children, cols = 2 }) => (
  <div className={`grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-3' : ''} gap-4`}>
    {children}
  </div>
);
