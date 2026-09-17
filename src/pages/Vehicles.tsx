import { useState } from 'react';
import {
  Car,
  Plus,
  Search,
  Filter,
  Wrench,
  AlertTriangle,
  Fuel,
  Shield,
  FileText,
  ChevronRight,
  X,
  CircleDot,
} from 'lucide-react';
import { vehicles, drivers, maintenanceRecords, tires } from '../data/mockData';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Vehicles() {
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.plate.toLowerCase().includes(search.toLowerCase())
  );

  const selected = vehicles.find((v) => v.id === selectedVehicle);
  const selectedDriver = selected ? drivers.find((d) => d.id === selected.driverId) : null;
  const selectedMaintenance = selected
    ? maintenanceRecords.filter((m) => m.vehicleId === selected.id)
    : [];
  const selectedTires = selected
    ? tires.filter((t) => t.vehicleId === selected.id)
    : [];

  const totalMaintenanceCost = selectedMaintenance.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Veículos</h1>
          <p className="text-sm text-gray-500 mt-1">{vehicles.length} veículos na frota</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Veículo
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por modelo ou placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredVehicles.map((v) => {
            const driver = drivers.find((d) => d.id === v.driverId);
            const kmToService = v.nextMaintenanceKm - v.mileage;
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedVehicle === v.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.model}</h3>
                    <p className="text-sm text-gray-500">{v.plate} • {v.year}</p>
                  </div>
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
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">KM</p>
                    <p className="font-medium text-gray-700">{(v.mileage / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Consumo</p>
                    <p className="font-medium text-gray-700">{v.consumption} km/L</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Revisão</p>
                    <p className={`font-medium ${kmToService <= 3000 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {(kmToService / 1000).toFixed(1)}k km
                    </p>
                  </div>
                </div>
                {driver && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-medium text-slate-600">{driver.name.charAt(0)}</span>
                    </div>
                    <span className="text-xs text-gray-600">{driver.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vehicle Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6">
              {/* Vehicle Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selected.model}</h2>
                    <p className="text-gray-500">{selected.plate} • Renavam: {selected.renavam}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${
                      selected.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      selected.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        selected.status === 'active' ? 'bg-emerald-500' :
                        selected.status === 'maintenance' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }`}></span>
                      {selected.status === 'active' ? 'Em operação' : selected.status === 'maintenance' ? 'Em manutenção' : 'Inativo'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InfoBlock icon={<Car className="w-4 h-4" />} label="Ano" value={String(selected.year)} />
                  <InfoBlock icon={<Fuel className="w-4 h-4" />} label="Combustível" value={selected.fuel} />
                  <InfoBlock icon={<Car className="w-4 h-4" />} label="Quilometragem" value={`${selected.mileage.toLocaleString()} km`} />
                  <InfoBlock icon={<Fuel className="w-4 h-4" />} label="Consumo Médio" value={`${selected.consumption} km/L`} />
                </div>
              </div>

              {/* Fixed Costs */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos Fixos Mensais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CostCard icon={<Shield className="w-4 h-4" />} label="Seguro" value={selected.insurance} />
                  <CostCard icon={<FileText className="w-4 h-4" />} label="Financiamento" value={selected.financing} />
                  <CostCard icon={<AlertTriangle className="w-4 h-4" />} label="Depreciação" value={selected.depreciation} />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total Fixo Mensal</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(selected.insurance + selected.financing + selected.depreciation)}
                  </span>
                </div>
              </div>

              {/* Documentation Status */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DocStatus label="IPVA" date={selected.ipva} />
                  <DocStatus label="Licenciamento" date={selected.licensing} />
                  <DocStatus label="Seguro" date={selected.insuranceExpiry} />
                </div>
              </div>

              {/* Tires */}
              {selectedTires.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CircleDot className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">Controle de Pneus</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedTires.map((tire) => (
                      <div key={tire.id} className={`p-3 rounded-lg border ${
                        tire.condition === 'good' ? 'bg-emerald-50 border-emerald-200' :
                        tire.condition === 'fair' ? 'bg-amber-50 border-amber-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <p className="text-xs font-medium text-gray-500">{tire.position}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{tire.brand}</p>
                        <p className="text-xs text-gray-500 mt-1">DOT: {tire.dot}</p>
                        <p className="text-xs text-gray-500">{(tire.currentKm - tire.kmAtInstall).toLocaleString()} km rodados</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                          tire.condition === 'good' ? 'bg-emerald-100 text-emerald-700' :
                          tire.condition === 'fair' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tire.condition === 'good' ? 'Bom' : tire.condition === 'fair' ? 'Regular' : 'Ruim'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance History */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">Histórico de Manutenção</h3>
                  </div>
                  <span className="text-sm text-gray-500">Total: {formatCurrency(totalMaintenanceCost)}</span>
                </div>
                <div className="space-y-3">
                  {selectedMaintenance.map((record) => (
                    <div key={record.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        record.type === 'preventive' ? 'bg-blue-100' : 'bg-red-100'
                      }`}>
                        <Wrench className={`w-4 h-4 ${record.type === 'preventive' ? 'text-blue-600' : 'text-red-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{record.description}</p>
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(record.cost)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString('pt-BR')}</span>
                          <span className="text-xs text-gray-500">{record.kmAtService.toLocaleString()} km</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            record.type === 'preventive' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {record.type === 'preventive' ? 'Preventiva' : 'Corretiva'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Selecione um veículo</h3>
              <p className="text-sm text-gray-500 mt-1">Clique em um veículo na lista para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Novo Veículo</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Placa" placeholder="ABC-1D23" />
                <InputField label="Renavam" placeholder="12345678901" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Modelo" placeholder="Chevrolet Onix Plus" />
                <InputField label="Ano" placeholder="2024" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Quilometragem" placeholder="0" type="number" />
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option>Flex</option>
                  <option>Gasolina</option>
                  <option>Etanol</option>
                  <option>GNV</option>
                  <option>Elétrico</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Consumo (km/L)" placeholder="12.5" type="number" />
                <InputField label="KM Próxima Revisão" placeholder="70000" type="number" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancelar
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Salvar Veículo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function CostCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-900">{formatCurrency(value)}</p>
    </div>
  );
}

function DocStatus({ label, date }: { label: string; date: string }) {
  const now = new Date('2025-01-28');
  const docDate = new Date(date);
  const daysUntil = Math.ceil((docDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntil < 0;
  const isWarning = daysUntil <= 30 && daysUntil >= 0;

  return (
    <div className={`p-3 rounded-lg border ${
      isExpired ? 'bg-red-50 border-red-200' :
      isWarning ? 'bg-amber-50 border-amber-200' :
      'bg-emerald-50 border-emerald-200'
    }`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-1">
        {docDate.toLocaleDateString('pt-BR')}
      </p>
      <span className={`text-xs mt-1 inline-block ${
        isExpired ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
      }`}>
        {isExpired ? 'Vencido!' : `${daysUntil} dias`}
      </span>
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
