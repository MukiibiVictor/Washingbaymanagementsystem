import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { formatCurrency, formatTimeAgo } from '../lib/utils';
import { toast } from 'sonner';
import type { Expense, ExpenseCategory } from '../lib/types';
import { expensesApi } from '../lib/api-service';
import { useAuth } from '../lib/auth-context';
import { dataEvents, DATA_EVENTS } from '../lib/events';

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'supplies', label: 'Supplies' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'salaries', label: 'Salaries' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
];

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('supplies');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadExpenses();

    // Listen for expense changes
    const handleDataChange = () => {
      loadExpenses();
    };

    dataEvents.on(DATA_EVENTS.EXPENSE_CREATED, handleDataChange);
    dataEvents.on(DATA_EVENTS.EXPENSE_UPDATED, handleDataChange);

    return () => {
      dataEvents.off(DATA_EVENTS.EXPENSE_CREATED, handleDataChange);
      dataEvents.off(DATA_EVENTS.EXPENSE_UPDATED, handleDataChange);
    };
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expensesApi.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!description || !amount || !user) {
      toast.error('Please fill all fields');
      return;
    }

    const result = await expensesApi.create({
      category,
      description,
      amount: parseInt(amount),
      date: new Date(date).toISOString(),
      created_by: user.name,
    });

    if (result.success) {
      setDialogOpen(false);
      setDescription('');
      setAmount('');
      setCategory('supplies');
      toast.success('Expense added successfully');
    } else {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const result = await expensesApi.delete(id);
    if (result.success) {
      toast.success('Expense deleted');
    } else {
      toast.error('Failed to delete expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const todayExpenses = expenses.filter(e => 
    new Date(e.date).toDateString() === new Date().toDateString()
  ).reduce((sum, e) => sum + e.amount, 0);

  const getCategoryColor = (cat: ExpenseCategory) => {
    const colors = {
      supplies: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      utilities: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      salaries: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      maintenance: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      equipment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      marketing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[cat];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Expenses
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage daily business expenses</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Today's Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(todayExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100">No expenses recorded</p>
              <p className="text-sm text-slate-500 mt-1">
                Click "Add Expense" to start tracking your business expenses
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{expense.description}</p>
                      <Badge className={getCategoryColor(expense.category)} variant="secondary">
                        {EXPENSE_CATEGORIES.find(c => c.value === expense.category)?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(expense.date).toLocaleDateString()} • {expense.created_by}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-red-600 dark:text-red-400 text-lg">
                      {formatCurrency(expense.amount)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g. Car wash supplies"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (UGX)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleAddExpense}>
                Add Expense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
