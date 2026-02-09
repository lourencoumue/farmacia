
import React from 'react';
import { AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

const NOTIFICACOES_SISTEMA = [
  { id: 1, item: 'Omeprazol 20mg', info: 'Expira em 5 dias', severity: 'High', color: 'border-l-amber-500' },
  { id: 2, item: 'Paracetamol 750mg', info: 'Stock Crítico (abaixo de 10 unidades)', severity: 'Medium', color: 'border-l-blue-500' },
  { id: 3, item: 'Antibiótico Infantil', info: 'Data de validade expirada', severity: 'Critical', color: 'border-l-red-500' },
];

const Alerts: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
         <ShieldAlert size={18} className="text-slate-800" />
         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Alertas de Segurança e Stock</h3>
      </div>
      <div className="space-y-2">
        {NOTIFICACOES_SISTEMA.map(a => (
          <div key={a.id} className={`bg-white p-4 border-l-4 ${a.color} border-y border-r border-slate-200 flex items-center justify-between shadow-sm transition-all hover:translate-x-1`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${a.severity === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                 <AlertTriangle size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm tracking-tight">{a.item}</p>
                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 uppercase tracking-wide">
                  <Clock size={10} /> {a.info}
                </p>
              </div>
            </div>
            <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${
              a.severity === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              {a.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
