import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { DashboardStats } from '../lib/types';
import { dashboardApi } from '../lib/api-service';
import { formatCurrency, formatTimeAgo } from '../lib/utils';
import { DollarSign, Car, CreditCard, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { dataEvents, DATA_EVENTS } from '../lib/events';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStats();

    // Listen for data changes and refresh
    const handleDataChange = () => {
      loadStats();
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

  const loadStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError(true);
      toast.error('Failed to load dashboard. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Dashboard</h1>
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-red-600" />
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Failed to Load Dashboard</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Unable to connect to the backend server. Please ensure:
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 text-left max-w-md mx-auto mb-6 space-y-1">
                <li>• Backend server is running on http://localhost:3001</li>
                <li>• Run: <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">cd server && npm start</code></li>
                <li>• Check browser console for errors</li>
              </ul>
              <button
                onClick={loadStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Today's Overview - March 4, 2026</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Today's Revenue</CardTitle>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(stats.today_revenue)}</div>
            <p className="text-xs text-slate-600 mt-1">Total collected today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Vehicles Serviced</CardTitle>
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.vehicles_today}</div>
            <p className="text-xs text-slate-600 mt-1">Vehicles today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Outstanding Credit</CardTitle>
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.outstanding_credit)}
            </div>
            <p className="text-xs text-slate-600 mt-1">To be collected</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Average per Vehicle</CardTitle>
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.vehicles_today > 0
                ? formatCurrency(Math.round(stats.today_revenue / stats.vehicles_today))
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-slate-600 mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Revenue by Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.revenue_by_vehicle.length > 0 ? (
              <div className="space-y-3">
                {stats.revenue_by_vehicle.map((item) => (
                  <div key={item.vehicle_type} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md transition-all cursor-pointer">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.vehicle_type}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Revenue by Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.revenue_by_service.length > 0 ? (
              <div className="space-y-3">
                {stats.revenue_by_service.map((item) => (
                  <div key={item.service_type} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md transition-all cursor-pointer">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.service_type}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recent_transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 p-3 rounded-lg transition-all cursor-pointer -mx-3 -my-2 last:pb-2">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 hover:scale-110 transition-all">
                  {tx.image_url ? (
                    <img src={tx.image_url} alt={tx.plate_number} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{tx.plate_number}</p>
                  <p className="text-sm text-slate-600">
                    {tx.vehicle_type} • {tx.service_type}
                  </p>
                  <p className="text-xs text-slate-500">{formatTimeAgo(tx.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(tx.price)}</p>
                  <Badge
                    variant={
                      tx.status === 'paid' ? 'default' : tx.status === 'credit' ? 'secondary' : 'outline'
                    }
                    className={tx.status === 'paid' ? 'bg-green-600' : ''}
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
