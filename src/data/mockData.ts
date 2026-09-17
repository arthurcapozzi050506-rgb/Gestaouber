export interface Vehicle {
  id: string;
  plate: string;
  renavam: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  consumption: number;
  insurance: number;
  financing: number;
  depreciation: number;
  status: 'active' | 'maintenance' | 'inactive';
  driverId?: string;
  lastMaintenance: string;
  nextMaintenanceKm: number;
  ipva: string;
  licensing: string;
  insuranceExpiry: string;
}

export interface Driver {
  id: string;
  name: string;
  cnh: string;
  cnhExpiry: string;
  ear: boolean;
  earExpiry: string;
  phone: string;
  email: string;
  photo: string;
  vehicleId?: string;
  rating: number;
  acceptanceRate: number;
  cancellationRate: number;
  onlineHours: number;
  revenueHours: number;
  weeklyEarnings: number;
  discounts: number;
  model: 'profit_share' | 'rental';
  dailyRate?: number;
  profitShare?: number;
}

export interface FinancialEntry {
  id: string;
  date: string;
  type: 'revenue' | 'variable_cost' | 'fixed_cost';
  category: string;
  description: string;
  amount: number;
  vehicleId?: string;
  driverId?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: 'preventive' | 'corrective';
  description: string;
  cost: number;
  kmAtService: number;
  invoice?: string;
}

export interface Tire {
  id: string;
  vehicleId: string;
  position: string;
  brand: string;
  dot: string;
  installedDate: string;
  kmAtInstall: number;
  currentKm: number;
  condition: 'good' | 'fair' | 'bad';
}

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    plate: 'ABC-1D23',
    renavam: '12345678901',
    model: 'Chevrolet Onix Plus',
    year: 2023,
    mileage: 67500,
    fuel: 'Flex',
    consumption: 12.5,
    insurance: 350,
    financing: 1800,
    depreciation: 950,
    status: 'active',
    driverId: 'd1',
    lastMaintenance: '2024-11-15',
    nextMaintenanceKm: 70000,
    ipva: '2025-02-15',
    licensing: '2025-08-20',
    insuranceExpiry: '2025-06-30',
  },
  {
    id: 'v2',
    plate: 'DEF-4G56',
    renavam: '23456789012',
    model: 'Hyundai HB20S',
    year: 2022,
    mileage: 98200,
    fuel: 'Flex',
    consumption: 11.8,
    insurance: 320,
    financing: 1600,
    depreciation: 880,
    status: 'active',
    driverId: 'd2',
    lastMaintenance: '2024-12-01',
    nextMaintenanceKm: 100000,
    ipva: '2025-03-10',
    licensing: '2025-07-15',
    insuranceExpiry: '2025-09-20',
  },
  {
    id: 'v3',
    plate: 'GHI-7J89',
    renavam: '34567890123',
    model: 'Fiat Argo',
    year: 2021,
    mileage: 125000,
    fuel: 'Flex',
    consumption: 11.2,
    insurance: 290,
    financing: 1400,
    depreciation: 750,
    status: 'maintenance',
    driverId: 'd3',
    lastMaintenance: '2025-01-05',
    nextMaintenanceKm: 125000,
    ipva: '2025-01-20',
    licensing: '2025-06-10',
    insuranceExpiry: '2025-04-15',
  },
  {
    id: 'v4',
    plate: 'JKL-0M12',
    renavam: '45678901234',
    model: 'Toyota Yaris Sedan',
    year: 2024,
    mileage: 32000,
    fuel: 'Flex',
    consumption: 13.2,
    insurance: 380,
    financing: 2100,
    depreciation: 1100,
    status: 'active',
    driverId: 'd4',
    lastMaintenance: '2024-12-20',
    nextMaintenanceKm: 35000,
    ipva: '2025-04-05',
    licensing: '2025-09-25',
    insuranceExpiry: '2025-12-01',
  },
  {
    id: 'v5',
    plate: 'MNO-3P45',
    renavam: '56789012345',
    model: 'Volkswagen Virtus',
    year: 2022,
    mileage: 87600,
    fuel: 'Flex',
    consumption: 12.0,
    insurance: 340,
    financing: 1700,
    depreciation: 900,
    status: 'active',
    driverId: 'd5',
    lastMaintenance: '2024-10-28',
    nextMaintenanceKm: 90000,
    ipva: '2025-02-28',
    licensing: '2025-05-20',
    insuranceExpiry: '2025-03-10',
  },
];

export const drivers: Driver[] = [
  {
    id: 'd1',
    name: 'Carlos Silva',
    cnh: '01234567890',
    cnhExpiry: '2026-05-20',
    ear: true,
    earExpiry: '2026-05-20',
    phone: '(11) 99876-5432',
    email: 'carlos@email.com',
    photo: '',
    vehicleId: 'v1',
    rating: 4.85,
    acceptanceRate: 92,
    cancellationRate: 3,
    onlineHours: 52,
    revenueHours: 44,
    weeklyEarnings: 2800,
    discounts: 150,
    model: 'profit_share',
    profitShare: 60,
  },
  {
    id: 'd2',
    name: 'Roberto Santos',
    cnh: '12345678901',
    cnhExpiry: '2025-08-15',
    ear: true,
    earExpiry: '2025-08-15',
    phone: '(11) 98765-4321',
    email: 'roberto@email.com',
    photo: '',
    vehicleId: 'v2',
    rating: 4.72,
    acceptanceRate: 88,
    cancellationRate: 5,
    onlineHours: 48,
    revenueHours: 40,
    weeklyEarnings: 2600,
    discounts: 200,
    model: 'profit_share',
    profitShare: 55,
  },
  {
    id: 'd3',
    name: 'Marcos Oliveira',
    cnh: '23456789012',
    cnhExpiry: '2025-03-10',
    ear: true,
    earExpiry: '2025-06-10',
    phone: '(11) 97654-3210',
    email: 'marcos@email.com',
    photo: '',
    vehicleId: 'v3',
    rating: 4.60,
    acceptanceRate: 85,
    cancellationRate: 8,
    onlineHours: 45,
    revenueHours: 36,
    weeklyEarnings: 2200,
    discounts: 350,
    model: 'rental',
    dailyRate: 130,
  },
  {
    id: 'd4',
    name: 'Anderson Lima',
    cnh: '34567890123',
    cnhExpiry: '2027-01-25',
    ear: true,
    earExpiry: '2027-01-25',
    phone: '(11) 96543-2109',
    email: 'anderson@email.com',
    photo: '',
    vehicleId: 'v4',
    rating: 4.92,
    acceptanceRate: 95,
    cancellationRate: 2,
    onlineHours: 56,
    revenueHours: 50,
    weeklyEarnings: 3200,
    discounts: 80,
    model: 'profit_share',
    profitShare: 60,
  },
  {
    id: 'd5',
    name: 'Felipe Costa',
    cnh: '45678901234',
    cnhExpiry: '2025-02-05',
    ear: false,
    earExpiry: '2024-12-31',
    phone: '(11) 95432-1098',
    email: 'felipe@email.com',
    photo: '',
    vehicleId: 'v5',
    rating: 4.45,
    acceptanceRate: 78,
    cancellationRate: 12,
    onlineHours: 38,
    revenueHours: 30,
    weeklyEarnings: 1900,
    discounts: 450,
    model: 'rental',
    dailyRate: 120,
  },
];

export const financialEntries: FinancialEntry[] = [
  // Receitas
  { id: 'f1', date: '2025-01-06', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 1', amount: 4200, vehicleId: 'v1', driverId: 'd1' },
  { id: 'f2', date: '2025-01-06', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 1', amount: 3800, vehicleId: 'v2', driverId: 'd2' },
  { id: 'f3', date: '2025-01-06', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 1', amount: 3200, vehicleId: 'v3', driverId: 'd3' },
  { id: 'f4', date: '2025-01-06', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 1', amount: 4800, vehicleId: 'v4', driverId: 'd4' },
  { id: 'f5', date: '2025-01-06', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 1', amount: 2800, vehicleId: 'v5', driverId: 'd5' },
  { id: 'f6', date: '2025-01-13', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 2', amount: 4500, vehicleId: 'v1', driverId: 'd1' },
  { id: 'f7', date: '2025-01-13', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 2', amount: 4100, vehicleId: 'v2', driverId: 'd2' },
  { id: 'f8', date: '2025-01-13', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 2', amount: 3500, vehicleId: 'v3', driverId: 'd3' },
  { id: 'f9', date: '2025-01-13', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 2', amount: 5100, vehicleId: 'v4', driverId: 'd4' },
  { id: 'f10', date: '2025-01-13', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 2', amount: 3000, vehicleId: 'v5', driverId: 'd5' },
  { id: 'f11', date: '2025-01-20', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 3', amount: 4300, vehicleId: 'v1', driverId: 'd1' },
  { id: 'f12', date: '2025-01-20', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 3', amount: 3900, vehicleId: 'v2', driverId: 'd2' },
  { id: 'f13', date: '2025-01-20', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 3', amount: 3400, vehicleId: 'v3', driverId: 'd3' },
  { id: 'f14', date: '2025-01-20', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 3', amount: 4900, vehicleId: 'v4', driverId: 'd4' },
  { id: 'f15', date: '2025-01-20', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 3', amount: 2900, vehicleId: 'v5', driverId: 'd5' },
  { id: 'f16', date: '2025-01-27', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 4', amount: 4600, vehicleId: 'v1', driverId: 'd1' },
  { id: 'f17', date: '2025-01-27', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 4', amount: 4200, vehicleId: 'v2', driverId: 'd2' },
  { id: 'f18', date: '2025-01-27', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 4', amount: 3600, vehicleId: 'v3', driverId: 'd3' },
  { id: 'f19', date: '2025-01-27', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 4', amount: 5200, vehicleId: 'v4', driverId: 'd4' },
  { id: 'f20', date: '2025-01-27', type: 'revenue', category: 'Uber Repasse', description: 'Repasse semanal - Semana 4', amount: 3100, vehicleId: 'v5', driverId: 'd5' },
  { id: 'f21', date: '2025-01-15', type: 'revenue', category: 'Gorjetas', description: 'Gorjetas acumuladas - Janeiro', amount: 850 },
  { id: 'f22', date: '2025-01-10', type: 'revenue', category: 'Bônus Promoções', description: 'Bônus Uber - Promoção horário pico', amount: 1200 },
  { id: 'f23', date: '2025-01-05', type: 'revenue', category: 'Aluguel Carro', description: 'Aluguel carro - Marcos (20 dias)', amount: 2600 },
  { id: 'f24', date: '2025-01-05', type: 'revenue', category: 'Aluguel Carro', description: 'Aluguel carro - Felipe (20 dias)', amount: 2400 },
  
  // Custos Variáveis
  { id: 'f25', date: '2025-01-08', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Shell', amount: 380, vehicleId: 'v1' },
  { id: 'f26', date: '2025-01-15', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Ipiranga', amount: 420, vehicleId: 'v2' },
  { id: 'f27', date: '2025-01-10', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto BR', amount: 350, vehicleId: 'v3' },
  { id: 'f28', date: '2025-01-12', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Shell', amount: 300, vehicleId: 'v4' },
  { id: 'f29', date: '2025-01-09', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Ale', amount: 400, vehicleId: 'v5' },
  { id: 'f30', date: '2025-01-22', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Shell', amount: 390, vehicleId: 'v1' },
  { id: 'f31', date: '2025-01-23', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Ipiranga', amount: 410, vehicleId: 'v2' },
  { id: 'f32', date: '2025-01-20', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto BR', amount: 360, vehicleId: 'v3' },
  { id: 'f33', date: '2025-01-21', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Shell', amount: 310, vehicleId: 'v4' },
  { id: 'f34', date: '2025-01-22', type: 'variable_cost', category: 'Combustível', description: 'Abastecimento - Posto Ale', amount: 430, vehicleId: 'v5' },
  { id: 'f35', date: '2025-01-18', type: 'variable_cost', category: 'Pedágio', description: 'Pedágios da semana', amount: 85, vehicleId: 'v1' },
  { id: 'f36', date: '2025-01-18', type: 'variable_cost', category: 'Pedágio', description: 'Pedágios da semana', amount: 72, vehicleId: 'v2' },
  { id: 'f37', date: '2025-01-18', type: 'variable_cost', category: 'Pedágio', description: 'Pedágios da semana', amount: 95, vehicleId: 'v4' },
  { id: 'f38', date: '2025-01-12', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v1' },
  { id: 'f39', date: '2025-01-12', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v2' },
  { id: 'f40', date: '2025-01-12', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v3' },
  { id: 'f41', date: '2025-01-12', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v4' },
  { id: 'f42', date: '2025-01-12', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v5' },
  { id: 'f43', date: '2025-01-25', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v1' },
  { id: 'f44', date: '2025-01-25', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v2' },
  { id: 'f45', date: '2025-01-25', type: 'variable_cost', category: 'Lavagem', description: 'Lavagem completa', amount: 60, vehicleId: 'v4' },
  { id: 'f46', date: '2025-01-15', type: 'variable_cost', category: 'Multa', description: 'Multa velocidade - Rod. Anhanguera', amount: 195, vehicleId: 'v5', driverId: 'd5' },
  { id: 'f47', date: '2025-01-20', type: 'variable_cost', category: 'Multa', description: 'Multa estacionamento irregular', amount: 130, vehicleId: 'v3', driverId: 'd3' },
  
  // Custos Fixos
  { id: 'f48', date: '2025-01-05', type: 'fixed_cost', category: 'Seguro', description: 'Seguro frota - Janeiro', amount: 1680 },
  { id: 'f49', date: '2025-01-05', type: 'fixed_cost', category: 'Financiamento', description: 'Parcelas financiamento - Janeiro', amount: 8600 },
  { id: 'f50', date: '2025-01-10', type: 'fixed_cost', category: 'Contador', description: 'Honorários contábeis', amount: 500 },
  { id: 'f51', date: '2025-01-01', type: 'fixed_cost', category: 'Estacionamento', description: 'Aluguel garagem frota', amount: 800 },
  { id: 'f52', date: '2025-01-15', type: 'fixed_cost', category: 'Software', description: 'Assinatura sistema gestão', amount: 150 },
  { id: 'f53', date: '2025-01-05', type: 'fixed_cost', category: 'Equipamentos', description: 'Suportes celular e dashcams', amount: 350 },
  { id: 'f54', date: '2025-01-20', type: 'fixed_cost', category: 'Impostos', description: 'Provisão Simples Nacional', amount: 1200 },
  { id: 'f55', date: '2025-01-05', type: 'fixed_cost', category: 'Depreciação', description: 'Depreciação mensal frota', amount: 4580 },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'm1', vehicleId: 'v1', date: '2024-11-15', type: 'preventive', description: 'Troca de óleo e filtros', cost: 280, kmAtService: 65000 },
  { id: 'm2', vehicleId: 'v1', date: '2024-08-20', type: 'preventive', description: 'Troca de pneus dianteiros', cost: 900, kmAtService: 58000 },
  { id: 'm3', vehicleId: 'v2', date: '2024-12-01', type: 'corrective', description: 'Troca correia dentada', cost: 1200, kmAtService: 95000 },
  { id: 'm4', vehicleId: 'v2', date: '2024-09-10', type: 'preventive', description: 'Revisão 90.000km', cost: 650, kmAtService: 90000 },
  { id: 'm5', vehicleId: 'v3', date: '2025-01-05', type: 'corrective', description: 'Troca embreagem completa', cost: 2800, kmAtService: 124000 },
  { id: 'm6', vehicleId: 'v3', date: '2024-10-15', type: 'preventive', description: 'Troca de óleo e filtros', cost: 250, kmAtService: 118000 },
  { id: 'm7', vehicleId: 'v3', date: '2024-07-20', type: 'corrective', description: 'Troca amortecedores traseiros', cost: 1400, kmAtService: 110000 },
  { id: 'm8', vehicleId: 'v4', date: '2024-12-20', type: 'preventive', description: 'Revisão 30.000km', cost: 450, kmAtService: 30000 },
  { id: 'm9', vehicleId: 'v5', date: '2024-10-28', type: 'preventive', description: 'Troca de óleo e filtros', cost: 270, kmAtService: 85000 },
  { id: 'm10', vehicleId: 'v5', date: '2024-06-15', type: 'corrective', description: 'Troca disco de freio dianteiro', cost: 800, kmAtService: 78000 },
];

export const tires: Tire[] = [
  { id: 't1', vehicleId: 'v1', position: 'Dianteiro Esquerdo', brand: 'Michelin', dot: '2023', installedDate: '2024-08-20', kmAtInstall: 58000, currentKm: 67500, condition: 'good' },
  { id: 't2', vehicleId: 'v1', position: 'Dianteiro Direito', brand: 'Michelin', dot: '2023', installedDate: '2024-08-20', kmAtInstall: 58000, currentKm: 67500, condition: 'good' },
  { id: 't3', vehicleId: 'v1', position: 'Traseiro Esquerdo', brand: 'Pirelli', dot: '2022', installedDate: '2023-12-10', kmAtInstall: 45000, currentKm: 67500, condition: 'fair' },
  { id: 't4', vehicleId: 'v1', position: 'Traseiro Direito', brand: 'Pirelli', dot: '2022', installedDate: '2023-12-10', kmAtInstall: 45000, currentKm: 67500, condition: 'fair' },
  { id: 't5', vehicleId: 'v3', position: 'Dianteiro Esquerdo', brand: 'Goodyear', dot: '2022', installedDate: '2023-06-15', kmAtInstall: 100000, currentKm: 125000, condition: 'bad' },
  { id: 't6', vehicleId: 'v3', position: 'Dianteiro Direito', brand: 'Goodyear', dot: '2022', installedDate: '2023-06-15', kmAtInstall: 100000, currentKm: 125000, condition: 'bad' },
  { id: 't7', vehicleId: 'v3', position: 'Traseiro Esquerdo', brand: 'Goodyear', dot: '2022', installedDate: '2023-06-15', kmAtInstall: 100000, currentKm: 125000, condition: 'fair' },
  { id: 't8', vehicleId: 'v3', position: 'Traseiro Direito', brand: 'Goodyear', dot: '2022', installedDate: '2023-06-15', kmAtInstall: 100000, currentKm: 125000, condition: 'fair' },
];

export const monthlyRevenueData = [
  { month: 'Ago', receita: 62000, custos: 38000, lucro: 24000 },
  { month: 'Set', receita: 65000, custos: 40000, lucro: 25000 },
  { month: 'Out', receita: 68000, custos: 42000, lucro: 26000 },
  { month: 'Nov', receita: 71000, custos: 44000, lucro: 27000 },
  { month: 'Dez', receita: 74000, custos: 45000, lucro: 29000 },
  { month: 'Jan', receita: 76590, custos: 46840, lucro: 29750 },
];

export const weeklyData = [
  { week: 'Sem 1', v1: 4200, v2: 3800, v3: 3200, v4: 4800, v5: 2800 },
  { week: 'Sem 2', v1: 4500, v2: 4100, v3: 3500, v4: 5100, v5: 3000 },
  { week: 'Sem 3', v1: 4300, v2: 3900, v3: 3400, v4: 4900, v5: 2900 },
  { week: 'Sem 4', v1: 4600, v2: 4200, v3: 3600, v4: 5200, v5: 3100 },
];

export const costBreakdown = [
  { name: 'Combustível', value: 7550, color: '#f59e0b' },
  { name: 'Financiamento', value: 8600, color: '#3b82f6' },
  { name: 'Seguro', value: 1680, color: '#10b981' },
  { name: 'Depreciação', value: 4580, color: '#8b5cf6' },
  { name: 'Manutenção', value: 1200, color: '#ef4444' },
  { name: 'Lavagem', value: 660, color: '#06b6d4' },
  { name: 'Pedágio', value: 252, color: '#f97316' },
  { name: 'Multas', value: 325, color: '#ec4899' },
  { name: 'Outros Fixos', value: 2993, color: '#64748b' },
];
