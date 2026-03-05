import { useEffect, useState } from 'react';
import { PricingRule } from '../lib/types';
import { pricingRulesApi } from '../lib/mock-api';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { formatCurrency, formatDate } from '../lib/utils';
import { DollarSign, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    const data = await pricingRulesApi.getAll();
    setRules(data);
    setLoading(false);
  };

  const handlePriceChange = (ruleId: string, value: string) => {
    setEditedPrices((prev) => ({ ...prev, [ruleId]: value }));
  };

  const handleSave = async (rule: PricingRule) => {
    if (!user) return;

    const newPrice = editedPrices[rule.id];
    if (!newPrice) {
      toast.error('Please enter a price');
      return;
    }

    const priceNum = parseInt(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setSaving(rule.id);

    const result = await pricingRulesApi.update(rule.id, priceNum, user.name);

    if (result.success) {
      toast.success('Minimum price updated successfully');
      setEditedPrices((prev) => {
        const updated = { ...prev };
        delete updated[rule.id];
        return updated;
      });
      loadRules();
    } else {
      toast.error('Failed to update price');
    }

    setSaving(null);
  };

  const canEdit = user?.role === 'superadmin';

  // Group rules by vehicle type
  const groupedRules = rules.reduce(
    (acc, rule) => {
      if (!acc[rule.vehicle_type]) {
        acc[rule.vehicle_type] = [];
      }
      acc[rule.vehicle_type].push(rule);
      return acc;
    },
    {} as Record<string, PricingRule[]>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Pricing Rules</h1>
        <p className="text-slate-600 mt-2">Manage minimum pricing for different vehicle types and services</p>
      </div>

      {!canEdit && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-800">
              You have read-only access. Only SuperAdmin users can modify pricing rules.
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(groupedRules).map(([vehicleType, vehicleRules]) => (
            <Card key={vehicleType} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{vehicleType}</CardTitle>
                <CardDescription>Minimum prices for {vehicleType.toLowerCase()} services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleRules.map((rule) => {
                    const editedPrice = editedPrices[rule.id];
                    const hasChanges = editedPrice !== undefined && editedPrice !== '';
                    const isSaving = saving === rule.id;

                    return (
                      <div
                        key={rule.id}
                        className="flex items-end gap-2 pb-4 border-b last:border-0 hover:bg-slate-50 p-3 rounded transition-all"
                      >
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            {rule.service_type}
                          </label>
                          {canEdit ? (
                            <Input
                              type="number"
                              placeholder={rule.minimum_price.toString()}
                              value={editedPrice ?? ''}
                              onChange={(e) => handlePriceChange(rule.id, e.target.value)}
                            />
                          ) : (
                            <div className="h-10 px-3 flex items-center bg-gray-50 rounded border">
                              <span className="font-semibold">{formatCurrency(rule.minimum_price)}</span>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Last updated: {formatDate(rule.updated_at)}
                          </p>
                        </div>
                        {canEdit && hasChanges && (
                          <Button
                            size="sm"
                            onClick={() => handleSave(rule)}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              'Saving...'
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <CardTitle className="text-blue-900">How Pricing Enforcement Works</CardTitle>
              <CardDescription className="text-blue-700 mt-2">
                When an admin confirms a vehicle check-in, the system validates that the entered price meets
                or exceeds the minimum price for the selected vehicle type and service. If the price is below
                the minimum, the system will reject the transaction.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
