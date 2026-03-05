import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, DollarSign, Receipt, Calendar } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function ReportsPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Start with empty data - will be populated from actual transactions
  const trendData: any[] = [];
  const expenseByCategory: any[] = [];

  const totalRevenue = trendData.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const totalExpenses = trendData.reduce((sum, d) => sum + (d.expenses || 0), 0);
  const totalNetIncome = trendData.reduce((sum, d) => sum + (d.net_income || 0), 0);

  const handleDownloadReport = () => {
    if (trendData.length === 0) {
      alert('No data available to download');
      return;
    }
    
    // Generate CSV report
    const csvContent = [
      ['Date', 'Revenue', 'Expenses', 'Net Income'],
      ...trendData.map(d => [d.date, d.revenue, d.expenses, d.net_income])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${period}-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Financial Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track revenue, expenses, and performance trends</p>
        </div>
        <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Period Selector */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Report Period
              </label>
              <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Month
              </label>
              <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {totalRevenue === 0 ? 'No data yet' : '+12.5% from last period'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</CardTitle>
            <Receipt className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {totalExpenses === 0 ? 'No data yet' : '+5.2% from last period'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Net Income</CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalNetIncome)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {totalNetIncome === 0 ? 'No data yet' : '+18.3% from last period'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">Revenue & Expenses Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {trendData.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No trend data available</p>
              <p className="text-sm text-slate-500 mt-1">
                Start recording transactions and expenses to see trends
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="net_income" stroke="#3b82f6" strokeWidth={2} name="Net Income" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Expense by Category */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseByCategory.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No expense data available</p>
              <p className="text-sm text-slate-500 mt-1">
                Add expenses to see category breakdown
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
