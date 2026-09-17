import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Plus,
  Receipt,
  Fuel,
  Wrench,
  Car,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { financialEntries, vehicles, drivers } from '../data/mockData';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Financial() {
  const [activeTab, setActiveTab] = useState<'all' | 'revenue' | 'variable_cost' | 'fixed_cost'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const totalRevenue = financialEntries
    .filter((e) => e.type === 'revenue')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalVariableCosts = financialEntries
    .filter((e) => e.type === 'variable_cost')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalFixedCosts = financialEntries
    .filter((e) => e.type === 'fixed_cost')
    .reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalVariableCosts - totalFixedCosts;

  const filteredEntries = activeTab === 'all'
    ? financialEntries
    : financialEntries.filter((e) => e.type === activeTab);

  const sortedEntries = [...filteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Cost by category
  const costByCategory = financialEntries
    .filter((e) => e.type !== 'revenue')
    .reduce((acc, e) => {
      const existing = acc.find((c) => c.category === e.category);
      if (existing) existing.value += e.amount;
      else acc.push({ category: e.category, value: e.amount });
      return acc;
    }, [] as { category: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

  // Revenue by category
  const revenueByCategory = financialEntries
    .filter((e) => e.type === 'revenue')
    .reduce((acc, e) => {
      const existing = acc.find((c) => c.category === e.category);
      if (existing) existing.value += e.amount;
      else acc.push({ category: e.category, value: e.amount });
      return acc;
    }, [] as { category: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Controle Financeiro</h1>
          <p className="text-sm text-gray-500 mt-1">Janeiro 2025 • Resumo completo de entradas e saídas</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Receita Total"
          value={formatCurrency(totalRevenue)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          subtitle={`${revenueByCategory.length} fontes`}
        />
        <SummaryCard
          title="Custos Variáveis"
          value={formatCurrency(totalVariableCosts)}
          icon={<ArrowDownRight className="w-5 h-5" />}
          color="amber"
          subtitle={`${((totalVariableCosts / totalRevenue) * 100).toFixed(1)}% da receita`}
        />
        <SummaryCard
          title="Custos Fixos"
          value={formatCurrency(totalFixedCosts)}
          icon={<ArrowDownRight className="w-5 h-5" />}
          color="red"
          subtitle={`${((totalFixedCosts / totalRevenue) * 100).toFixed(1)}% da receita`}
        />
        <SummaryCard
          title="Lucro Líquido"
          value={formatCurrency(netProfit)}
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
          subtitle={`Margem: ${((netProfit / totalRevenue) * 100).toFixed(1)}%`}
        />
      </div>

      {/* DRE Simplificado */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">DRE Simplificado (Demonstração do Resultado)</h2>
        <div className="space-y-2">
          <DRELine label="Receita Bruta (Uber + Bônus + Aluguel)" value={totalRevenue} type="revenue" />
          <DRELine label="(-) Taxas Uber (25%)" value={-totalRevenue * 0.25} type="deduction" />
          <div className="border-t border-gray-200 my-2"></div>
          <DRELine label="= Receita Líquida" value={totalRevenue * 0.75} type="subtotal" />
          <DRELine label="(-) Custos Variáveis (Combustível, Pedágio, Lavagem, Multas)" value={-totalVariableCosts} type="deduction" />
          <div className="border-t border-gray-200 my-2"></div>
          <DRELine label="= Margem de Contribuição" value={totalRevenue * 0.75 - totalVariableCosts} type="subtotal" />
          <DRELine label="(-) Custos Fixos (Seguro, Financiamento, Depreciação, etc.)" value={-totalFixedCosts} type="deduction" />
          <div className="border-t-2 border-gray-900 my-2"></div>
          <DRELine label="= LUCRO LÍQUIDO" value={netProfit} type="total" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by Category */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={costByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="category"
              >
                {costByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {costByCategory.map((item, i) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i % pieColors.length] }}></span>
                  <span className="text-gray-600">{item.category}</span>
                </div>
                <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fontes de Receita</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" stroke="#94a3b8" fontSize={11} width={100} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Lançamentos</h3>
          <div className="flex items-center gap-2">
            {(['all', 'revenue', 'variable_cost', 'fixed_cost'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab === 'all' ? 'Todos' : tab === 'revenue' ? 'Receitas' : tab === 'variable_cost' ? 'Custos Var.' : 'Custos Fixos'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-5 font-medium text-gray-500">Data</th>
                <th className="text-left py-3 px-5 font-medium text-gray-500">Tipo</th>
                <th className="text-left py-3 px-5 font-medium text-gray-500">Categoria</th>
                <th className="text-left py-3 px-5 font-medium text-gray-500">Descrição</th>
                <th className="text-left py-3 px-5 font-medium text-gray-500">Veículo</th>
                <th className="text-right py-3 px-5 font-medium text-gray-500">Valor</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.slice(0, 20).map((entry) => {
                const vehicle = vehicles.find((v) => v.id === entry.vehicleId);
                return (
                  <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-5 text-gray-600">
                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        entry.type === 'revenue' ? 'bg-emerald-100 text-emerald-700' :
                        entry.type === 'variable_cost' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {entry.type === 'revenue' ? '↑ Receita' : entry.type === 'variable_cost' ? '↓ Var.' : '↓ Fixo'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-gray-700 font-medium">{entry.category}</td>
                    <td className="py-3 px-5 text-gray-600">{entry.description}</td>
                    <td className="py-3 px-5 text-gray-500 text-xs">{vehicle?.model || '-'}</td>
                    <td className={`py-3 px-5 text-right font-semibold ${
                      entry.type === 'revenue' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {entry.type === 'revenue' ? '+' : '-'}{formatCurrency(entry.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sortedEntries.length > 20 && (
          <div className="p-4 text-center border-t border-gray-100">
            <span className="text-sm text-gray-500">Mostrando 20 de {sortedEntries.length} lançamentos</span>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Novo Lançamento</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="revenue">Receita</option>
                  <option value="variable_cost">Custo Variável</option>
                  <option value="fixed_cost">Custo Fixo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option>Combustível</option>
                  <option>Pedágio</option>
                  <option>Lavagem</option>
                  <option>Multa</option>
                  <option>Manutenção</option>
                  <option>Seguro</option>
                  <option>Financiamento</option>
                  <option>Uber Repasse</option>
                  <option>Outros</option>
                </select>
              </div>
              <InputField label="Descrição" placeholder="Descrição do lançamento" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Valor (R$)" placeholder="0,00" type="number" />
                <InputField label="Data" placeholder="" type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Veículo (opcional)</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="">Nenhum</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                <Receipt className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Anexar nota fiscal (foto ou PDF)</p>
                <p className="text-xs text-gray-400 mt-1">OCR irá extrair valores automaticamente</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancelar
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Salvar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function DRELine({ label, value, type }: { label: string; value: number; type: 'revenue' | 'deduction' | 'subtotal' | 'total' }) {
  const isPositive = value >= 0;
  const styles: Record<string, string> = {
    revenue: 'text-gray-700 font-medium',
    deduction: 'text-red-600',
    subtotal: 'text-gray-900 font-semibold bg-gray-50 -mx-2 px-2 py-1 rounded',
    total: 'text-emerald-700 font-bold text-lg bg-emerald-50 -mx-2 px-2 py-2 rounded',
  };

  return (
    <div className={`flex items-center justify-between ${styles[type]}`}>
      <span className="text-sm">{label}</span>
      <span>{isPositive && type !== 'revenue' ? '' : ''}{formatCurrency(value)}</span>
    </div>
  );
}

function InputField({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      />
    </div>
  );
}
