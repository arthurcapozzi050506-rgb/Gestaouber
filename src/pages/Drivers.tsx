import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Star,
  Clock,
  DollarSign,
  AlertTriangle,
  Car,
  X,
  Phone,
  Mail,
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { drivers, vehicles } from '../data/mockData';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Drivers() {
  const [search, setSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  const selected = drivers.find((d) => d.id === selectedDriver);
  const selectedVehicle = selected ? vehicles.find((v) => v.id === selected.vehicleId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Motoristas</h1>
          <p className="text-sm text-gray-500 mt-1">{drivers.length} motoristas cadastrados</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Motorista
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredDrivers.map((d) => {
            const vehicle = vehicles.find((v) => v.id === d.vehicleId);
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDriver(d.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedDriver === d.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{d.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{d.name}</h3>
                    <p className="text-xs text-gray-500">{d.phone}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{d.rating}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Car className="w-3.5 h-3.5" />
                    <span>{vehicle?.model || 'Sem veículo'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{formatCurrency(d.weeklyEarnings)}/sem</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    d.model === 'profit_share' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {d.model === 'profit_share' ? `${d.profitShare}% lucro` : `R$${d.dailyRate}/dia`}
                  </span>
                  {d.discounts > 200 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      Descontos altos
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Driver Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{selected.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        {selected.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="w-3.5 h-3.5" />
                        {selected.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-gray-900">{selected.rating}</span>
                  </div>
                </div>

                {/* Vehicle Assignment */}
                {selectedVehicle && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedVehicle.model}</p>
                      <p className="text-xs text-gray-500">{selectedVehicle.plate} • {selectedVehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MetricCard
                    icon={<Clock className="w-4 h-4" />}
                    label="Horas Online"
                    value={`${selected.onlineHours}h`}
                    sublabel={`${selected.revenueHours}h faturando`}
                  />
                  <MetricCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Taxa Aceitação"
                    value={`${selected.acceptanceRate}%`}
                    color={selected.acceptanceRate >= 90 ? 'emerald' : selected.acceptanceRate >= 80 ? 'amber' : 'red'}
                  />
                  <MetricCard
                    icon={<TrendingDown className="w-4 h-4" />}
                    label="Taxa Cancelamento"
                    value={`${selected.cancellationRate}%`}
                    color={selected.cancellationRate <= 3 ? 'emerald' : selected.cancellationRate <= 8 ? 'amber' : 'red'}
                  />
                  <MetricCard
                    icon={<DollarSign className="w-4 h-4" />}
                    label="Ganho Semanal"
                    value={formatCurrency(selected.weeklyEarnings)}
                  />
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financeiro</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Modelo de Negócio</p>
                      <p className="text-xs text-gray-500">
                        {selected.model === 'profit_share' ? 'Divisão de Lucros' : 'Aluguel do Veículo'}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {selected.model === 'profit_share' ? `${selected.profitShare}% para motorista` : `R$${selected.dailyRate}/dia`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ganho Semanal Bruto</p>
                      <p className="text-xs text-gray-500">Antes de descontos</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{formatCurrency(selected.weeklyEarnings)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Descontos Aplicados</p>
                      <p className="text-xs text-gray-500">Multas, danos, adiantamentos</p>
                    </div>
                    <span className="text-sm font-bold text-red-600">-{formatCurrency(selected.discounts)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Repasse Líquido</p>
                      <p className="text-xs text-gray-500">Valor a receber</p>
                    </div>
                    <span className="text-lg font-bold text-emerald-700">
                      {formatCurrency(selected.weeklyEarnings - selected.discounts)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DocCard
                    label="CNH"
                    number={selected.cnh}
                    expiry={selected.cnhExpiry}
                  />
                  <DocCard
                    label="EAR"
                    number={selected.ear ? 'Ativa' : 'Não possui'}
                    expiry={selected.earExpiry}
                    valid={selected.ear}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Selecione um motorista</h3>
              <p className="text-sm text-gray-500 mt-1">Clique em um motorista na lista para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Novo Motorista</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <InputField label="Nome Completo" placeholder="João da Silva" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Telefone" placeholder="(11) 99999-9999" />
                <InputField label="Email" placeholder="joao@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="CNH" placeholder="01234567890" />
                <InputField label="Validade CNH" placeholder="" type="date" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="EAR" placeholder="Número" />
                <InputField label="Validade EAR" placeholder="" type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo de Negócio</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="profit_share">Divisão de Lucros</option>
                  <option value="rental">Aluguel do Veículo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vínculo com Veículo</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="">Selecione um veículo</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancelar
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Salvar Motorista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sublabel,
  color = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    default: 'text-gray-900',
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={`text-lg font-bold ${colorMap[color]}`}>{value}</p>
      {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
    </div>
  );
}

function DocCard({ label, number, expiry, valid = true }: { label: string; number: string; expiry: string; valid?: boolean }) {
  const now = new Date('2025-01-28');
  const expDate = new Date(expiry);
  const daysUntil = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntil < 0;
  const isWarning = daysUntil <= 60 && daysUntil >= 0;

  return (
    <div className={`p-3 rounded-lg border ${
      isExpired ? 'bg-red-50 border-red-200' :
      isWarning ? 'bg-amber-50 border-amber-200' :
      'bg-emerald-50 border-emerald-200'
    }`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isExpired ? 'bg-red-100 text-red-700' :
          isWarning ? 'bg-amber-100 text-amber-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {isExpired ? 'Vencido' : isWarning ? 'Vencendo' : 'Válido'}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Nº: {number}</p>
      <p className="text-xs text-gray-500">Validade: {new Date(expiry).toLocaleDateString('pt-BR')}</p>
      {!isExpired && <p className="text-xs text-gray-400 mt-0.5">{daysUntil} dias restantes</p>}
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
