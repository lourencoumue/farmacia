
import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin(username, 'ADMIN');
    } else if (username === 'operador' && password === 'op123') {
      onLogin(username, 'USER');
    } else {
      setError('Acesso negado. Verifique as credenciais.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-md shadow-sm p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white mx-auto mb-4">
              <Lock size={20} />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight uppercase">Vida Saudável</h1>
            <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest">Controlo de Acesso</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded text-[11px] flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Utilizador</label>
              <input 
                type="text" 
                autoComplete="username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded py-2 px-3 outline-none focus:border-blue-500 font-medium text-sm text-black"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                autoComplete="current-password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded py-2 px-3 outline-none focus:border-blue-500 font-medium text-sm text-black"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded flex items-center justify-center gap-2 text-xs shadow-sm uppercase tracking-widest transition-colors">
              Entrar <ArrowRight size={14} />
            </button>
          </form>
        </div>
        <div className="mt-8 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          Terminal ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Login;
