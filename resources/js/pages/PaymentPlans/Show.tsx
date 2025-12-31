import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PaymentPlanShowProps } from '@/types/PaymentPlan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, Home, Clock, DollarSign, FileText } from 'lucide-react';

const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
};

const formatDate = (date: string | null) => {
  if (!date) return 'Not Set';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusBadge = (status: string | null) => {
  if (!status) return <Badge variant="outline">No Status</Badge>;
  const variant =
    status === 'Paid'
      ? 'default'
      : status === 'Paid Partly'
      ? 'secondary'
      : 'outline';
  return <Badge variant={variant}>{status}</Badge>;
};

const InfoItem = ({ icon: Icon, label, value, className = "" }: {
  icon: any;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50/50 ${className}`}>
    <Icon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  </div>
);

const Show: React.FC<PaymentPlanShowProps> = ({ paymentPlan, prevId, nextId, filters, search, perPage, page }) => {

  return (
    <AppLayout>
      <Head title={`Payment Plan #${paymentPlan.id}`} />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Plan Record #{paymentPlan.id}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{paymentPlan.city_name || 'N/A'} • {paymentPlan.property || 'N/A'}</span>
                </div>
              </div>
              <div className="flex gap-3">
                {/* Previous/Next navigation retaining index filters/search/pagination */}
                <Link
                  href={prevId ? route('payment-plans.show', prevId) : route('payment-plans.show', paymentPlan.id)}
                  data={{
                    search: search ?? null,
                    city: filters?.city ?? null,
                    property: filters?.property ?? null,
                    unit: filters?.unit ?? null,
                    tenant: filters?.tenant ?? null,
                    per_page: perPage ?? null,
                    page: page ?? null,
                  }}
                  preserveState
                  preserveScroll
                >
                  <Button variant="outline" disabled={!prevId}>Previous</Button>
                </Link>
                <Link
                  href={nextId ? route('payment-plans.show', nextId) : route('payment-plans.show', paymentPlan.id)}
                  data={{
                    search: search ?? null,
                    city: filters?.city ?? null,
                    property: filters?.property ?? null,
                    unit: filters?.unit ?? null,
                    tenant: filters?.tenant ?? null,
                    per_page: perPage ?? null,
                    page: page ?? null,
                  }}
                  preserveState
                  preserveScroll
                >
                  <Button variant="outline" disabled={!nextId}>Next</Button>
                </Link>
                <Link
                  href={route('payment-plans.index')}
                  data={{
                    search: search ?? null,
                    city: filters?.city ?? null,
                    property: filters?.property ?? null,
                    unit: filters?.unit ?? null,
                    tenant: filters?.tenant ?? null,
                    per_page: perPage ?? null,
                    page: page ?? null,
                  }}
                  preserveState
                  preserveScroll
                >
                  <Button variant="outline">Back to List</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Property Hierarchy Card */}
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoItem
                  icon={MapPin}
                  label="City"
                  value={paymentPlan.city_name || 'N/A'}
                  className="bg-blue-50/50"
                />
                <InfoItem
                  icon={Home}
                  label="Property"
                  value={paymentPlan.property || 'N/A'}
                  className="bg-green-50/50"
                />
                <InfoItem
                  icon={Home}
                  label="Unit"
                  value={paymentPlan.unit || 'N/A'}
                  className="bg-purple-50/50"
                />
                <InfoItem
                  icon={User}
                  label="Tenant"
                  value={paymentPlan.tenant || 'N/A'}
                  className="bg-orange-50/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Important Dates section removed as requested; Due Date shown in Payment Details */}

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <InfoItem
                    icon={FileText}
                    label="Status"
                    value={getStatusBadge(paymentPlan.status)}
                  />
                  <InfoItem
                    icon={Calendar}
                    label="Due Date"
                    value={formatDate(paymentPlan.dates)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-primary/20 p-4 rounded-lg">
                    <p className="text-sm text-primary">Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(paymentPlan.amount)}
                    </p>
                  </div>
                  <div className="bg-chart-1/20 p-4 rounded-lg">
                    <p className="text-sm text-chart-1">Paid</p>
                    <p className="text-2xl font-bold text-chart-1">
                      {formatCurrency(paymentPlan.paid)}
                    </p>
                  </div>
                  <div className="bg-destructive/20 p-4 rounded-lg">
                    <p className="text-sm text-destructive">Left to Pay</p>
                    <p className="text-2xl font-bold text-destructive">
                      {formatCurrency(paymentPlan.left_to_pay)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information Section */}
          <div className="space-y-6">
            {/* Notes Section */}
            {paymentPlan.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {paymentPlan.notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer Section */}
          <Card className="mt-8 bg-gray-50">
            <CardContent className="pt-6">
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Created: {new Date(paymentPlan.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last Updated: {new Date(paymentPlan.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;
