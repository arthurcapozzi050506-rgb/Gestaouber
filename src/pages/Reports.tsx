import { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  TrendingDown,
  Car,
  Users,
  Target,
  AlertTriangle,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { vehicles, drivers, financialEntries, maintenanceRecords } from '../data/mockData';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Reports() {
  const [activeReport, setActiveReport] = useState<'vehicle' | 'driver' | 'breakeven' | 'fleet_swap'>('vehicle');

  // Vehicle analysis
  const vehicleAnalysis = vehicles.map((v) => {
    const revenue = financialEntries
      .filter((e) => e.type === 'revenue' && e.vehicleId === v.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const variableCosts = financialEntries
      .filter((e) => e.type === 'variable_cost' && e.vehicleId === v.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const fixedCosts = (v.insurance + v.financing + v.depreciation);
    const totalCosts = variableCosts + fixedCosts;
    const profit = revenue - totalCosts;
    const costPerKm = totalCosts / (v.mileage > 0 ? v.mileage : 1);
    const maintenanceCost = maintenanceRecords
      .filter((m) => m.vehicleId === v.id)
      .reduce((sum, m) => sum + m.cost, 0);

    return {
      name: v.model,
      plate: v.plate,
      revenue,
      variableCosts,
      fixedCosts,
      totalCosts,
      profit,
      costPerKm,
      maintenanceCost,
      mileage: v.mileage,
      consumption: v.consumption,
    };
  });

  // Driver analysis
  const driverAnalysis = drivers.map((d) => {
    const revenue = financialEntries
      .filter((e) => e.type === 'revenue' && e.driverId === d.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const fuelCosts = financialEntries
      .filter((e) => e.type === 'variable_cost' && e.category === 'Combustível' && e.vehicleId === d.vehicleId)
      .reduce((sum, e) => sum + e.amount, 0);
    const vehicle = vehicles.find((v) => v.id === d.vehicleId);

    return {
      name: d.name,
      revenue,
      rating: d.rating,
      acceptanceRate: d.acceptanceRate,
      cancellationRate: d.cancellationRate,
      onlineHours: d.onlineHours,
      revenueHours: d.revenueHours,
      fuelCosts,
      efficiency: d.revenueHours > 0 ? revenue / d.revenueHours : 0,
      vehicle: vehicle?.model || '-',
    };
  });

  // Break-even analysis
  const totalMonthlyFixedCosts = vehicles.reduce((sum, v) => sum + v.insurance + v.financing + v.depreciation, 0) + 3000; // other fixed
  const avgRevenuePerKm = 3.2; // average R$/km
  const avgVariableCostPerKm = 1.1; // average R$/km
  const contributionMarginPerKm = avgRevenuePerKm - avgVariableCostPerKm;
  const breakEvenKm = totalMonthlyFixedCosts / contributionMarginPerKm;

  // Fleet swap analysis
  const fleetSwapData = vehicles.map((v) => {
    const recentMaintenance = maintenanceRecords
      .filter((m) => m.vehicleId === v.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const totalMaintenance = maintenanceRecords
      .filter((m) => m.vehicleId === v.id)
      .reduce((sum, m) => sum + m.cost, 0);
    const avgMaintenancePerYear = totalMaintenance / Math.max(1, (2025 - v.year));
    const estimatedFipeValue = v.year >= 2024 ? 95000 : v.year >= 2023 ? 75000 : v.year >= 2022 ? 60000 : 45000;
    const shouldSwap = v.mileage > 100000 || avgMaintenancePerYear > 3000;

    return {
      model: v.model,
      plate: v.plate,
      year: v.year,
      mileage: v.mileage,
      totalMaintenance,
      avgMaintenancePerYear,
      estimatedFipeValue,
      shouldSwap,
      maintenanceTrend: recentMaintenance.length >= 2 ? 'increasing' : 'stable',
    };
  });

  // Radar chart data for driver comparison
  const radarData = [
    { metric: 'Receita', ...Object.fromEntries(driverAnalysis.map((d, i) => [`d${i}`, (d.revenue / 20000) * 100])) },
    { metric: 'Avaliação', ...Object.fromEntries(driverAnalysis.map((d, i) => [`d${i}`, (d.rating / 5) * 100])) },
    { metric: 'Aceitação', ...Object.fromEntries(driverAnalysis.map((d, i) => [`d${i}`, d.acceptanceRate])) },
    { metric: 'Horas Online', ...Object.fromEntries(driverAnalysis.map((d, i) => [`d${i}`, (d.onlineHours / 60) * 100])) },
    { metric: 'Eficiência', ...Object.fromEntries(driverAnalysis.map((d, i) => [`d${i}`, (d.efficiency / 100) * 100])) },
    { metric: 'Baixo Cancel.', ...Object.fromEntries(driverAnalysis.map((d, i) => [`d${i}`, 100 - d.cancellationRate * 5])) },
  ];

  const reports = [
    { id: 'vehicle' as const, name: 'Por Veículo', icon: Car },
    { id: 'driver' as const, name: 'Por Motorista', icon: Users },
    { id: 'breakeven' as const, name: 'Ponto de Equilíbrio', icon: Target },
    { id: 'fleet_swap' as const, name: 'Troca de Frota', icon: Calculator },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios & BI</h1>
          <p className="text-sm text-gray-500 mt-1">Análises detalhadas para tomada de decisão</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeReport === report.id
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <report.icon className="w-4 h-4" />
            {report.name}
          </button>
        ))}
      </div>

      {/* Vehicle Analysis Report */}
      {activeReport === 'vehicle' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Análise de Rentabilidade por Veículo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Bar dataKey="revenue" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalCosts" name="Custos Totais" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Lucro" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Detalhamento por Veículo</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-5 font-medium text-gray-500">Veículo</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Receita</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Custos Var.</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Custos Fixos</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Lucro</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Custo/KM</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Manutenção</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleAnalysis.map((va) => (
                    <tr key={va.plate} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-5">
                        <div className="font-medium text-gray-900">{va.name}</div>
                        <div className="text-xs text-gray-500">{va.plate}</div>
                      </td>
                      <td className="py-3 px-5 text-right text-emerald-600 font-medium">{formatCurrency(va.revenue)}</td>
                      <td className="py-3 px-5 text-right text-amber-600">{formatCurrency(va.variableCosts)}</td>
                      <td className="py-3 px-5 text-right text-red-600">{formatCurrency(va.fixedCosts)}</td>
                      <td className={`py-3 px-5 text-right font-bold ${va.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(va.profit)}
                      </td>
                      <td className="py-3 px-5 text-right text-gray-700">{formatCurrency(va.costPerKm)}</td>
                      <td className="py-3 px-5 text-right text-gray-700">{formatCurrency(va.maintenanceCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Driver Analysis Report */}
      {activeReport === 'driver' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativo de Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name={drivers[0].name} dataKey="d0" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Radar name={drivers[1].name} dataKey="d1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Radar name={drivers[3].name} dataKey="d3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Motorista</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={driverAnalysis} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={100} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="revenue" name="Receita" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Ranking de Motoristas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-5 font-medium text-gray-500">#</th>
                    <th className="text-left py-3 px-5 font-medium text-gray-500">Motorista</th>
                    <th className="text-left py-3 px-5 font-medium text-gray-500">Veículo</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Receita</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Rating</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Aceitação</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">Cancelamento</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500">R$/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {[...driverAnalysis].sort((a, b) => b.revenue - a.revenue).map((da, i) => (
                    <tr key={da.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          i === 0 ? 'bg-amber-100 text-amber-700' :
                          i === 1 ? 'bg-gray-100 text-gray-700' :
                          i === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>{i + 1}</span>
                      </td>
                      <td className="py-3 px-5 font-medium text-gray-900">{da.name}</td>
                      <td className="py-3 px-5 text-gray-600">{da.vehicle}</td>
                      <td className="py-3 px-5 text-right text-emerald-600 font-medium">{formatCurrency(da.revenue)}</td>
                      <td className="py-3 px-5 text-right">
                        <span className="inline-flex items-center gap-1">
                          <span className="text-amber-400">★</span>
                          {da.rating}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <span className={da.acceptanceRate >= 90 ? 'text-emerald-600' : da.acceptanceRate >= 80 ? 'text-amber-600' : 'text-red-600'}>
                          {da.acceptanceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <span className={da.cancellationRate <= 3 ? 'text-emerald-600' : da.cancellationRate <= 8 ? 'text-amber-600' : 'text-red-600'}>
                          {da.cancellationRate}%
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right text-gray-700">{formatCurrency(da.efficiency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Break-even Report */}
      {activeReport === 'breakeven' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">Custos Fixos Mensais</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalMonthlyFixedCosts)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm text-gray-500">Margem de Contribuição/KM</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(contributionMarginPerKm)}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
              <p className="text-sm text-emerald-100">Ponto de Equilíbrio</p>
              <p className="text-2xl font-bold mt-1">{Math.ceil(breakEvenKm).toLocaleString()} km/mês</p>
              <p className="text-xs text-emerald-200 mt-1">≈ {Math.ceil(breakEvenKm / 30).toLocaleString()} km/dia</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cálculo do Ponto de Equilíbrio</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Fórmula</h4>
                <p className="text-sm text-gray-600">
                  Ponto de Equilíbrio (KM) = Custos Fixos Totais ÷ Margem de Contribuição por KM
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  PE = {formatCurrency(totalMonthlyFixedCosts)} ÷ {formatCurrency(contributionMarginPerKm)} = <strong>{Math.ceil(breakEvenKm).toLocaleString()} km</strong>
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Detalhamento dos Custos Fixos</h4>
                <div className="space-y-2 text-sm">
                  {vehicles.map((v) => (
                    <div key={v.id} className="flex items-center justify-between">
                      <span className="text-gray-600">{v.model} ({v.plate})</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(v.insurance + v.financing + v.depreciation)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Outros (Contador, Estacionamento, Software)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(3000)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(totalMonthlyFixedCosts)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Alerta de Equilíbrio</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      A frota precisa rodar no mínimo <strong>{Math.ceil(breakEvenKm).toLocaleString()} km/mês</strong> para cobrir os custos fixos.
                      Isso equivale a aproximadamente <strong>{Math.ceil(breakEvenKm / vehicles.length).toLocaleString()} km por veículo</strong> ou
                      cerca de <strong>{Math.ceil(breakEvenKm / 15)}</strong> corridas/mês (considerando média de 15km/corrida).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fleet Swap Report */}
      {activeReport === 'fleet_swap' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculadora de Troca de Frota</h3>
            <p className="text-sm text-gray-500 mb-6">
              Análise automática para identificar veículos que devem ser substituídos com base em custo de manutenção, quilometragem e valor de revenda.
            </p>

            <div className="space-y-4">
              {fleetSwapData.map((fs) => (
                <div key={fs.plate} className={`p-4 rounded-lg border ${fs.shouldSwap ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{fs.model}</h4>
                        <span className="text-xs text-gray-500">{fs.plate}</span>
                        {fs.shouldSwap && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                            ⚠ Trocar
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Ano: {fs.year}</span>
                        <span>KM: {fs.mileage.toLocaleString()}</span>
                        <span>FIPE: {formatCurrency(fs.estimatedFipeValue)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Total Manutenção</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(fs.totalMaintenance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Média/Ano</p>
                      <p className={`text-sm font-semibold ${fs.avgMaintenancePerYear > 3000 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatCurrency(fs.avgMaintenancePerYear)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tendência</p>
                      <p className={`text-sm font-semibold ${fs.maintenanceTrend === 'increasing' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {fs.maintenanceTrend === 'increasing' ? '↑ Aumentando' : '→ Estável'}
                      </p>
                    </div>
                  </div>
                  {fs.shouldSwap && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs text-red-700">
                        <strong>Recomendação:</strong> Este veículo ultrapassou 100.000km e/ou o custo médio anual de manutenção excede R$ 3.000.
                        Considere vender agora (FIPE: {formatCurrency(fs.estimatedFipeValue)}) e substituir por um veículo mais novo para reduzir custos operacionais.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
