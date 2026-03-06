import { useEffect, useState } from 'react';
import { Transaction, PaymentMethod } from '../lib/types';
import { transactionsApi, paymentsApi } from '../lib/api-service';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { formatCurrency, formatDate } from '../lib/utils';
import { DollarSign, Car } from 'lucide-react';
import { toast } from 'sonner';
import { dataEvents, DATA_EVENTS } from '../lib/events';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon?: string }[] = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'mtn_mobile_money', label: 'MTN Mobile Money', icon: '📱' },
  { value: 'airtel_mobile_money', label: 'Airtel Money', icon: '📱' },
  { value: 'card', label: 'Card', icon: '💳' },
  { value: 'credit', label: 'On Credit', icon: '📝' },
];

export default function TransactionsPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTransactions();

    // Listen for data changes and refresh
    const handleDataChange = () => {
      loadTransactions();
    };

    dataEvents.on(DATA_EVENTS.TRANSACTION_CREATED, handleDataChange);
    dataEvents.on(DATA_EVENTS.TRANSACTION_UPDATED, handleDataChange);
    dataEvents.on(DATA_EVENTS.PAYMENT_CREATED, handleDataChange);

    return () => {
      dataEvents.off(DATA_EVENTS.TRANSACTION_CREATED, handleDataChange);
      dataEvents.off(DATA_EVENTS.TRANSACTION_UPDATED, handleDataChange);
      dataEvents.off(DATA_EVENTS.PAYMENT_CREATED, handleDataChange);
    };
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError(false);
    try {
      const [all, pending, credit] = await Promise.all([
        transactionsApi.getAll(),
        transactionsApi.getPending(),
        transactionsApi.getCredit(),
      ]);
      setAllTransactions(all);
      setPendingTransactions(pending);
      setCreditTransactions(credit);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setError(true);
      toast.error('Failed to load transactions. Please check if the backend is running.');
      setAllTransactions([]);
      setPendingTransactions([]);
      setCreditTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setPaymentMethod('cash');
    setPhoneNumber('');
    setPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedTransaction || !user) return;

    // Validate phone number for mobile money
    if ((paymentMethod === 'mtn_mobile_money' || paymentMethod === 'airtel_mobile_money') && !phoneNumber) {
      toast.error('Please enter phone number for mobile money payment');
      return;
    }

    setProcessing(true);

    const result = await paymentsApi.create(
      selectedTransaction.id,
      paymentMethod,
      selectedTransaction.price,
      user.name
    );

    if (result.success) {
      const methodLabel = PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label;
      toast.success(
        paymentMethod === 'credit' 
          ? 'Transaction marked as credit' 
          : `Payment recorded successfully via ${methodLabel}`
      );
      setPaymentDialogOpen(false);
      setPhoneNumber('');
      loadTransactions();
    } else {
      toast.error('Failed to process payment');
    }

    setProcessing(false);
  };

  const canProcessPayments = user?.role === 'admin' || user?.role === 'superadmin';

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 hover:scale-110 transition-all">
            {transaction.image_url ? (
              <img
                src={transaction.image_url}
                alt={transaction.plate_number}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-lg">{transaction.plate_number}</p>
                <p className="text-sm text-gray-600">
                  {transaction.vehicle_type} • {transaction.service_type}
                </p>
              </div>
              <Badge
                variant={
                  transaction.status === 'paid'
                    ? 'default'
                    : transaction.status === 'credit'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {transaction.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between hover:bg-slate-50 p-1 rounded transition-all">
                <span className="text-gray-500">Price:</span>
                <span className="font-semibold">{formatCurrency(transaction.price)}</span>
              </div>
              <div className="flex justify-between hover:bg-slate-50 p-1 rounded transition-all">
                <span className="text-gray-500">Admin:</span>
                <span>{transaction.admin_name}</span>
              </div>
              <div className="flex justify-between hover:bg-slate-50 p-1 rounded transition-all">
                <span className="text-gray-500">Date:</span>
                <span>{formatDate(transaction.created_at)}</span>
              </div>
            </div>
            {transaction.status === 'pending' && canProcessPayments && (
              <Button
                className="w-full mt-3"
                size="sm"
                onClick={() => handlePaymentClick(transaction)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Process Payment
              </Button>
            )}
            {transaction.status === 'credit' && canProcessPayments && (
              <Button
                className="w-full mt-3"
                size="sm"
                variant="outline"
                onClick={() => handlePaymentClick(transaction)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Collect Payment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Transactions</h1>
        <p className="text-sm text-slate-500 mt-1">Manage all vehicle service transactions and payments</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="all" className="hover:bg-slate-50 transition-all">All Transactions</TabsTrigger>
          <TabsTrigger value="pending" className="hover:bg-slate-50 transition-all">
            Pending
            {pendingTransactions.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                {pendingTransactions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="credit" className="hover:bg-slate-50 transition-all">
            On Credit
            {creditTransactions.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                {creditTransactions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500 py-8">Loading transactions...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-10 h-10 text-red-600" />
                  </div>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Failed to Load Transactions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Unable to connect to the backend server.
                  </p>
                  <button
                    onClick={loadTransactions}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : allTransactions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500 py-8">No transactions found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allTransactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingTransactions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500 py-8">No pending transactions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingTransactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="credit" className="space-y-4">
          {creditTransactions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500 py-8">No credit transactions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {creditTransactions.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between hover:bg-gray-100 p-2 rounded transition-all">
                  <span className="text-sm text-gray-600">Plate Number:</span>
                  <span className="font-semibold">{selectedTransaction.plate_number}</span>
                </div>
                <div className="flex justify-between hover:bg-gray-100 p-2 rounded transition-all">
                  <span className="text-sm text-gray-600">Vehicle:</span>
                  <span className="font-semibold">{selectedTransaction.vehicle_type}</span>
                </div>
                <div className="flex justify-between hover:bg-gray-100 p-2 rounded transition-all">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="font-semibold">{selectedTransaction.service_type}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(selectedTransaction.price)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger id="payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.icon} {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number for Mobile Money */}
              {(paymentMethod === 'mtn_mobile_money' || paymentMethod === 'airtel_mobile_money') && (
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="e.g. 0700123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-slate-500">
                    {paymentMethod === 'mtn_mobile_money' ? 'MTN' : 'Airtel'} registered phone number
                  </p>
                </div>
              )}

              {/* Cash Transaction Note */}
              {paymentMethod === 'cash' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💵 Cash payment will be recorded immediately
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handlePaymentSubmit} disabled={processing}>
                  {processing ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
