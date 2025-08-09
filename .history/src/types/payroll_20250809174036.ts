export type PayrollStatus = 'pending' | 'processed' | 'paid';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  payPeriod: string; // e.g., "January 2024"
  status: PayrollStatus;
  taxDeductions?: number;
  providentFund?: number;
  insurance?: number;
}

export interface SalaryStructure {
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  hra: number;
  da: number;
  allowances: number;
  pf: number;
  tax: number;
  insurance: number;
  grossSalary: number;
  netSalary: number;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // YYYY-MM
  netSalary: number;
  status: PayrollStatus;
  pdfUrl?: string;
}

export interface TaxRule {
  id: string;
  name: string;
  rate: number; // percentage 0-100
  threshold?: number;
  description?: string;
}

export interface BankBatchFile {
  id: string;
  month: string; // YYYY-MM
  totalAmount: number;
  status: 'generated' | 'sent' | 'failed';
  processedAt?: string;
}

export interface PayrollRunResult {
  month: string;
  processed: number;
  pending: number;
  totalAmount: number;
}


