
import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Plus, X, Loader2, Calendar } from 'lucide-react';
import { MovementType, Medication } from '../types';

interface MovimentoDB {
  id: number;
  medication_name: string;
  tipo: MovementType;
  quantidade: number;
  referencia: string;
  operator_name: string;
  data_movimento: string;
}

// Added interface to define expected props for the Movimentos component
interface MovimentosProps {
  userRole?: string;
}

// Updated component to use MovimentosProps and destructure userRole
const Movimentos: React.FC<MovimentosProps> = ({ userRole }) => {
  const [movimentos, setMovimentos] = useState<MovimentoDB[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    medicamento_id: '',
    tipo: 'SAÍDA',
    quantidade: '',
    referencia: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resMov, resMeds] = await Promise.all([
        fetch('http://localhost/farmacia-backend/api.php?endpoint=movements'),
        fetch('http://localhost/farmacia-backend/api.php?endpoint=medications')
      ]);
      const dataMov = await resMov.json();
      const dataMeds = await resMeds.json();
      setMovimentos(Array.isArray(dataMov) ? dataMov : []);
      setMeds(Array.isArray(dataMeds) ? dataMeds : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicamento_id || !formData.quantidade) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost/farmacia-backend/api.php?endpoint=movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantidade: parseInt(formData.quantidade),
          operador_id: 1 // Fallback para admin em demo
        })
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ medicamento_id: '', tipo: 'SAÍDA', quantidade: '', referencia: '' });
        fetchData();
      }
    } catch (err) {
      alert("Falha ao registar movimento");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = movimentos.reduce((acc, curr) => {
    if (curr.tipo === 'ENTRADA') acc.entradas += Number(curr.quantidade);
    else acc.saidas += Number(curr.quantidade);
    return acc;
  }, { entradas: 0, saidas: 0 });

  if (loading && movimentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-blue-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">A carregar logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Controlo de Fluxo</h3>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Gestão de entradas e saídas de stock</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-[10px] font-bold flex items-center gap-2 shadow-sm transition-colors uppercase tracking-widest"
        >
          <Plus size={14} /> Nova Guia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm flex items-center justify-between">
          <div>
            <span className="text-blue-600 font-bold text-[9px] uppercase tracking-widest block mb-1 text-blue-400">Total Entradas</span>
            <h4 className="text-2xl font-bold text-slate-800">{stats.entradas}</h4>
          </div>
          <div className="bg-blue-50 p-3 rounded text-blue-600"><ArrowUpCircle size={24} /></div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-md shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest block mb-1">Total Saídas</span>
            <h4 className="text-2xl font-bold text-slate-800">{stats.saidas}</h4>
          </div>
          <div className="bg-slate-50 p-3 rounded text-slate-400"><ArrowDownCircle size={24} /></div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Designação do Item</th>
              <th className="px-6 py-4 text-center">Qtd</th>
              <th className="px-6 py-4">Referência</th>
              <th className="px-6 py-4">Data/Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movimentos.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${
                    m.tipo === 'ENTRADA' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {m.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">{m.medication_name}</td>
                <td className="px-6 py-4 text-center font-bold text-slate-900">{m.quantidade}</td>
                <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{m.referencia || '---'}</td>
                <td className="px-6 py-4 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                   <Calendar size={10} /> {new Date(m.data_movimento).toLocaleString('pt-PT')}
                </td>
              </tr>
            ))}
            {movimentos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium">Nenhum registo encontrado nas últimas 24h.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-md shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Nova Guia de Operação</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Medicamento</label>
                <select 
                  required 
                  className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50"
                  value={formData.medicamento_id}
                  onChange={e => setFormData({...formData, medicamento_id: e.target.value})}
                >
                  <option value="">Selecionar item em stock...</option>
                  {meds.map(med => (
                    <option key={med.id} value={med.id}>{med.name} (Stock: {med.stock})</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Operação</label>
                  <select 
                    className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50"
                    value={formData.tipo}
                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option value="SAÍDA">Saída (Venda/Dispensa)</option>
                    <option value="ENTRADA">Entrada (Abastecimento)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Quantidade</label>
                  <input 
                    required 
                    type="number" 
                    min="1"
                    className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50"
                    placeholder="0"
                    value={formData.quantidade}
                    onChange={e => setFormData({...formData, quantidade: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Referência (Guia/Fatura)</label>
                <input 
                  className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50"
                  placeholder="Ex: NF-2024-001"
                  value={formData.referencia}
                  onChange={e => setFormData({...formData, referencia: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded text-xs font-bold hover:bg-blue-700 mt-4 transition-all shadow-sm uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Confirmar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimentos;
