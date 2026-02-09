
import React, { useState, useEffect } from 'react';
import { Truck, Plus, Mail, Phone, Loader2, X } from 'lucide-react';
import { Supplier } from '../types';

const Fornecedores: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nome: '', contacto: '', email: '', endereco: '' });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost/farmacia-backend/api.php?endpoint=suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/farmacia-backend/api.php?endpoint=suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        fetchSuppliers();
        setFormData({ nome: '', contacto: '', email: '', endereco: '' });
      }
    } catch (err) { alert("Erro ao salvar"); }
  };

  if (loading) return <div className="flex flex-col items-center justify-center h-64 text-blue-600"><Loader2 className="animate-spin mb-2" size={32} /></div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Fornecedores</h3>
          <p className="text-slate-500 text-xs">Entidades parceiras de abastecimento.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold shadow-sm transition-all">
          <Plus size={16} /> NOVO FORNECEDOR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-md border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-50 p-2 rounded text-blue-600 border border-slate-100"><Truck size={20} /></div>
              <h4 className="font-bold text-slate-800 text-sm truncate">{s.nome}</h4>
            </div>
            <div className="space-y-2 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {s.email}</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {s.contacto}</div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-md shadow-xl animate-in zoom-in-95 border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Novo Fornecedor</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nome da Empresa</label>
                <input required className="w-full border border-slate-200 rounded p-2.5 text-black font-medium text-sm outline-none focus:border-blue-500 bg-slate-50" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Contacto</label>
                   <input className="w-full border border-slate-200 rounded p-2.5 text-black font-medium text-sm outline-none focus:border-blue-500 bg-slate-50" value={formData.contacto} onChange={e => setFormData({...formData, contacto: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Email</label>
                   <input className="w-full border border-slate-200 rounded p-2.5 text-black font-medium text-sm outline-none focus:border-blue-500 bg-slate-50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                 </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded text-xs font-bold hover:bg-blue-700 shadow-sm active:scale-95 transition-all mt-4">CONFIRMAR REGISTO</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fornecedores;
