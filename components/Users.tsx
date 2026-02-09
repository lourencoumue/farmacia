
import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, User as UserIcon, Loader2, X, Trash2 } from 'lucide-react';

interface SystemUser {
  id: number;
  nome_completo: string;
  username: string;
  cargo: string;
  data_criacao: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    username: '',
    senha: '',
    cargo: 'USER'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost/farmacia-backend/api.php?endpoint=users');
      const data = await res.json();
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/farmacia-backend/api.php?endpoint=users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        fetchUsers();
        setFormData({ nome_completo: '', username: '', senha: '', cargo: 'USER' });
      }
    } catch (err) { alert("Erro ao salvar"); }
  };

  if (loading) return <div className="flex flex-col items-center justify-center h-64 text-blue-600"><Loader2 className="animate-spin mb-2" size={32} /></div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Utilizadores</h3>
          <p className="text-slate-500 text-xs">Gestão de credenciais e permissões.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <Plus size={16} /> NOVO UTILIZADOR
        </button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-6 py-3">Nome do Utilizador</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Cargo</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <UserIcon size={14} />
                    </div>
                    <div className="font-semibold text-slate-800">{u.nome_completo}</div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-500">@{u.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tight flex items-center gap-1.5 w-fit ${
                    u.cargo === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    <Shield size={10} /> {u.cargo === 'ADMIN' ? 'Administrador' : 'Operador'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-300 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-md shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Registar Utilizador</h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nome Completo</label>
                <input required className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50" value={formData.nome_completo} onChange={e => setFormData({...formData, nome_completo: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Username</label>
                   <input required className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cargo</label>
                   <select className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50" value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})}>
                     <option value="USER">Operador</option>
                     <option value="ADMIN">Administrador</option>
                   </select>
                 </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Palavra-passe</label>
                <input required type="password" className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-black font-medium outline-none focus:border-blue-500 bg-slate-50" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded text-xs font-bold hover:bg-blue-700 mt-4 transition-all shadow-sm uppercase">Criar Conta</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
