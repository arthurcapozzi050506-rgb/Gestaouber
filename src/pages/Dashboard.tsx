import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  AlertTriangle,
  Fuel,
  Wrench,
  FileWarning,
  UserX,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  vehicles,
  drivers,
  financialEntries,
  monthlyRevenueData,
  costBreakdown,
  weeklyData,
} from '../data/mockData';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard() {
  // Calculations
  const totalRevenue = financialEntries
    .filter((e) => e.type === 'revenue')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalVariableCosts = financialEntries
    .filter((e) => e.type === 'variable_cost')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalFixedCosts = financialEntries
    .filter((e) => e.type === 'fixed_cost')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCosts = totalVariableCosts + totalFixedCosts;
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
  const totalKm = vehicles.reduce((sum, v) => sum + v.mileage, 0);
  const costPerKm = totalCosts / totalKm;

  // Alerts
  const alerts: { type: string; message: string; severity: string }[] = [];
  const now = new Date('2025-01-28');

  vehicles.forEach((v) => {
    const ipvaDate = new Date(v.ipva);
    const licensingDate = new Date(v.licensing);
    const insuranceDate = new Date(v.insuranceExpiry);
    const daysToIpva = Math.ceil((ipvaDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysToLicensing = Math.ceil((licensingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysToInsurance = Math.ceil((insuranceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToIpva <= 30) alerts.push({ type: 'doc', message: `${v.plate} - IPVA vence em ${daysToIpva} dias`, severity: daysToIpva <= 7 ? 'critical' : 'warning' });
    if (daysToLicensing <= 60) alerts.push({ type: 'doc', message: `${v.plate} - Licenciamento vence em ${daysToLicensing} dias`, severity: daysToLicensing <= 15 ? 'critical' : 'warning' });
    if (daysToInsurance <= 60) alerts.push({ type: 'doc', message: `${v.plate} - Seguro vence em ${daysToInsurance} dias`, severity: daysToInsurance <= 15 ? 'critical' : 'warning' });

    const kmToService = v.nextMaintenanceKm - v.mileage;
    if (kmToService <= 3000) alerts.push({ type: 'maintenance', message: `${v.plate} - Revisão em ${kmToService}km`, severity: kmToService <= 500 ? 'critical' : 'warning' });
  });

  drivers.forEach((d) => {
    const cnhDate = new Date(d.cnhExpiry);
    const earDate = new Date(d.earExpiry);
    const daysToCnh = Math.ceil((cnhDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysToEar = Math.ceil((earDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToCnh <= 90) alerts.push({ type: 'driver', message: `${d.name} - CNH vence em ${daysToCnh} dias`, severity: daysToCnh <= 30 ? 'critical' : 'warning' });
    if (!d.ear || daysToEar <= 0) alerts.push({ type: 'driver', message: `${d.name} - EAR vencida!`, severity: 'critical' });
    else if (daysToEar <= 90) alerts.push({ type: 'driver', message: `${d.name} - EAR vence em ${daysToEar} dias`, severity: daysToEar <= 30 ? 'critical' : 'warning' });
  });

  // Vehicle profitability
  const vehicleProfitability = vehicles.map((v) => {
    const revenue = financialEntries
      .filter((e) => e.type === 'revenue' && e.vehicleId === v.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const costs = financialEntries
      .filter((e) => e.type !== 'revenue' && e.vehicleId === v.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const fixedShare = (v.insurance + v.financing + v.depreciation) * 1; // monthly
    const totalCost = costs + fixedShare;
    return { name: v.model, profit: revenue - totalCost, revenue, costs: totalCost };
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Receita Bruta"
          value={formatCurrency(totalRevenue)}
          change="+12.5%"
          positive={true}
          icon={<DollarSign className="w-5 h-5" />}
          color="emerald"
        />
        <KPICard
          title="Lucro Líquido"
          value={formatCurrency(netProfit)}
          change="+8.3%"
          positive={true}
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Margem de Lucro"
          value={`${profitMargin}%`}
          change="-1.2%"
          positive={false}
          icon={<Gauge className="w-5 h-5" />}
          color="purple"
        />
        <KPICard
          title="Custo Médio/KM"
          value={formatCurrency(costPerKm)}
          change="+3.1%"
          positive={false}
          icon={<Fuel className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">Alertas Críticos</h2>
            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {alerts.filter((a) => a.severity === 'critical').length} críticos
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.slice(0, 9).map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                {alert.type === 'doc' && <FileWarning className={`w-4 h-4 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />}
                {alert.type === 'maintenance' && <Wrench className={`w-4 h-4 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />}
                {alert.type === 'driver' && <UserX className={`w-4 h-4 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />}
                <span className={`text-sm ${alert.severity === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Evolução Financeira</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Receita</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Custos</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Lucro</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="receita" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
              <Area type="monotone" dataKey="custos" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
              <Area type="monotone" dataKey="lucro" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown Pie */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Composição de Custos</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {costBreakdown.slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue by Vehicle */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Receita Semanal por Veículo</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="v1" name="Onix" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="v2" name="HB20S" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="v3" name="Argo" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              <Bar dataKey="v4" name="Yaris" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="v5" name="Virtus" fill="#ec4899" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Profitability */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lucro por Veículo (Mês)</h2>
          <div className="space-y-4">
            {vehicleProfitability.map((vp) => (
              <div key={vp.name} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700 truncate">{vp.name}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Receita: {formatCurrency(vp.revenue)}</span>
                    <span className={`text-sm font-semibold ${vp.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(vp.profit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${vp.profit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(Math.abs(vp.profit) / 200, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status da Frota</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Veículo</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Motorista</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">KM</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Consumo</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Próx. Revisão</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const driver = drivers.find((d) => d.id === v.driverId);
                const kmToService = v.nextMaintenanceKm - v.mileage;
                return (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">{v.model}</div>
                      <div className="text-xs text-gray-500">{v.plate}</div>
                    </td>
                    <td className="py-3 px-2 text-gray-700">{driver?.name || '-'}</td>
                    <td className="py-3 px-2 text-gray-700">{v.mileage.toLocaleString()} km</td>
                    <td className="py-3 px-2 text-gray-700">{v.consumption} km/L</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${kmToService <= 500 ? 'bg-red-100 text-red-700' : kmToService <= 3000 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {kmToService.toLocaleString()} km
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        v.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        v.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          v.status === 'active' ? 'bg-emerald-500' :
                          v.status === 'maintenance' ? 'bg-amber-500' :
                          'bg-gray-500'
                        }`}></span>
                        {v.status === 'active' ? 'Ativo' : v.status === 'maintenance' ? 'Oficina' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  change,
  positive,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
}
