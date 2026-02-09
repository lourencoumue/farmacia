
import React from 'react';
import { TrendingUp, Package, AlertCircle, Clock, ArrowLeftRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: 'dashboard' | 'stock' | 'movimentos' | 'alerts' | 'fornecedores' | 'users') => void;
  userRole?: string;
}

// Updated component to explicitly include userRole in destructuring
const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, userRole }) => {
  const stockData = [
    { name: 'Antibióticos', count: 45, color: '#2563eb' },
    { name: 'Analgésicos', count: 72, color: '#3b82f6' },
    { name: 'Vitamínicos', count: 31, color: '#60a5fa' },
    { name: 'Outros', count: 30, color: '#94a3b8' },
  ];

  const movementStats = [
    { day: 'Seg', entrada: 12, saida: 8 },
    { day: 'Ter', entrada: 19, saida: 14 },
    { day: 'Qua', entrada: 15, saida: 22 },
    { day: 'Qui', entrada: 22, saida: 10 },
    { day: 'Sex', entrada: 30, saida: 18 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total de Itens" value="1.284" icon={<Package size={18}/>} color="blue" />
        <StatCard title="Rupturas" value="14" icon={<AlertCircle size={18}/>} color="amber" />
        <StatCard title="Perto do Fim" value="08" icon={<Clock size={18}/>} color="red" />
        <StatCard title="Movimentos" value="42" icon={<ArrowLeftRight size={18}/>} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-5 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <TrendingUp size={14} className="text-blue-500" /> Fluxo de Operações Semanal
            </h4>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movementStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px'}} />
                <Bar dataKey="entrada" name="Entradas" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} />
                <Bar dataKey="saida" name="Saídas" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm">
          <h4 className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest">Distribuição por Categoria</h4>
          <div className="h-48 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={stockData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="count" stroke="none">
                        {stockData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {stockData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] font-medium border-b border-slate-50 pb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{backgroundColor: cat.color}}></div>
                        <span className="text-slate-500">{cat.name}</span>
                    </div>
                    <span className="text-slate-800 font-bold">{cat.count}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600'
  };
  return (
    <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-lg font-bold text-slate-800 mt-0.5">{value}</h3>
      </div>
      <div className={`p-2 rounded ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default Dashboard;
