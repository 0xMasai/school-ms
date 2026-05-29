/**
 * ─────────────────────────────────────────────────────────────────
 *  PAYROLL RECEIPT — where & how to add the print button
 * ─────────────────────────────────────────────────────────────────
 *
 *  1. Import at the top of your Payroll page/component:
 *
 *     import { printPayrollReceipt } from '../../utils/printUtils.js';
 *
 *  2. Add a handler (needs access to your config state):
 *
 *     const handlePrintReceipt = (entry) => {
 *       printPayrollReceipt(entry, {
 *         name:    config?.schoolName    || '',
 *         address: config?.schoolAddress || '',
 *         logoUrl: config?.logoUrl       || '',
 *       });
 *     };
 *
 *  3. In the row where you map over payroll entries, add the button.
 *     Example — inside the group-hover action area of your list row:
 *
 *     <Button
 *       size="xs"
 *       variant="secondary"
 *       icon={Printer}
 *       onClick={() => handlePrintReceipt(entry)}
 *     >
 *       Receipt
 *     </Button>
 *
 *  4. If you have a "Record Payroll" success step, you can auto-print
 *     immediately after saving:
 *
 *     const result = await recordPayroll(form, user.id);
 *     handlePrintReceipt(result);   // opens print dialog right away
 *
 * ─────────────────────────────────────────────────────────────────
 *  COMPLETE EXAMPLE of a payroll list row with the receipt button:
 * ─────────────────────────────────────────────────────────────────
 */

// ↓ paste this row template into your payroll list map():

const PayrollRow = ({ entry, config }) => {
  const handlePrint = () => {
    printPayrollReceipt(entry, {
      name:    config?.schoolName    || '',
      address: config?.schoolAddress || '',
      logoUrl: config?.logoUrl       || '',
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-navy-200 hover:bg-navy-50/30 transition-all group">
      {/* ... your existing row content ... */}

      {/* Add this button block to your group-hover actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-100 text-navy-700 hover:bg-navy-200 text-xs font-medium transition-colors"
        >
          {/* Printer icon from lucide-react */}
          🖨 Receipt
        </button>
      </div>
    </div>
  );
};
