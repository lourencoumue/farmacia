
import React, { useState, useEffect } from 'react';
import { Edit2, Plus, PackageCheck, AlertTriangle, Loader2, X, Search } from 'lucide-react';
import { Medication } from '../types';

interface StockProps {
  userRole?: string;
}

const CATEGORIES = ["Antibióticos", "Analgésicos", "Vitaminas", "Anti-inflamatórios", "Outros"];

const Stock: React.FC<StockProps> = ({ userRole }) => {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    fetch('http://localhost/farmacia-backend/api.php?endpoint=medications')
      .then(res => res.json())
      .then(data => { setMeds(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredMeds = meds.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex flex-col items-center justify-center h-64 text-blue-600"><Loader2 className="animate-spin mb-4" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" placeholder="Filtrar stock..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-blue-400 text-black font-medium"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
            <Plus size={14} /> NOVO ITEM
          </button>
        )}
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Produto</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3 text-center">Stock</th>
              <th className="px-6 py-3">Preço</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMeds.map(med => (
              <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-semibold text-slate-700">
                  {med.name}
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">#{med.batch}</div>
                </td>
                <td className="px-6 py-3 text-slate-500">{med.category}</td>
                <td className="px-6 py-3 text-center font-bold">{med.stock}</td>
                <td className="px-6 py-3 font-medium text-slate-900">{med.price} Kz</td>
                <td className="px-6 py-3">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${Number(med.stock) <= Number(med.minStock) ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {Number(med.stock) <= Number(med.minStock) ? 'Crítico' : 'Ok'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  {isAdmin && <button className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100"><Edit2 size={12}/></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-lg shadow-xl overflow-hidden border border-slate-200">
            <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Novo Medicamento</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16}/></button>
            </div>
            <form className="p-6 space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nome Comercial</label>
                <input required className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-black font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Categoria</label>
                  <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-black font-medium">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Preço (Kz)</label>
                  <input type="number" className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-black font-medium" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded text-xs font-bold hover:bg-blue-700 mt-4 transition-all shadow-sm">GUARDAR DADOS</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
