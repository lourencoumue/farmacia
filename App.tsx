
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  AlertTriangle, 
  Truck, 
  Users as UsersIcon,
  LogOut, 
  Search,
  Activity
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Stock from './components/Stock';
import Movimentos from './components/Movimentos';
import Alerts from './components/Alerts';
import Login from './components/Login';
import Fornecedores from './components/Fornecedores';
import UsersList from './components/Users';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stock' | 'movimentos' | 'alerts' | 'fornecedores' | 'users'>('dashboard');
  const [user, setUser] = useState<{ name: string; role: 'ADMIN' | 'USER' } | null>(null);

  const handleLogin = (username: string, role: string) => {
    setIsAuthenticated(true);
    const userRole = (role.toUpperCase().includes('ADMIN') ? 'ADMIN' : 'USER') as 'ADMIN' | 'USER';
    setUser({ name: username, role: userRole });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated || !user) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdmin = user.role === 'ADMIN';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard userRole={user.role} setActiveTab={setActiveTab} />;
      case 'stock': return <Stock userRole={user.role} />;
      case 'movimentos': return <Movimentos userRole={user.role} />;
      case 'alerts': return <Alerts />;
      case 'fornecedores': return isAdmin ? <Fornecedores /> : <Dashboard userRole={user.role} setActiveTab={setActiveTab} />;
      case 'users': return isAdmin ? <UsersList /> : <Dashboard userRole={user.role} setActiveTab={setActiveTab} />;
      default: return <Dashboard userRole={user.role} setActiveTab={setActiveTab} />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Painel de Controle';
      case 'stock': return 'Gestão de Inventário';
      case 'movimentos': return 'Fluxo de Movimentações';
      case 'alerts': return 'Alertas de Sistema';
      case 'fornecedores': return 'Registo de Fornecedores';
      case 'users': return 'Gestão de Utilizadores';
      default: return 'Sistema';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-700 font-sans antialiased">
      <aside className="w-60 bg-slate-800 text-slate-300 flex flex-col border-r border-slate-700" role="navigation">
        <div className="p-5 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-600 p-1.5 rounded text-white shadow-lg shadow-blue-900/20">
             <Activity size={18} />
          </div>
          <h1 className="font-bold text-white text-base tracking-tight">Vida Saudável</h1>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Início" />
          <NavItem active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package size={18}/>} label="Stock" />
          {isAdmin && <NavItem active={activeTab === 'fornecedores'} onClick={() => setActiveTab('fornecedores')} icon={<Truck size={18}/>} label="Fornecedores" />}
          {isAdmin && <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<UsersIcon size={18}/>} label="Utilizadores" />}
          <NavItem active={activeTab === 'movimentos'} onClick={() => setActiveTab('movimentos')} icon={<ArrowLeftRight size={18}/>} label="Movimentações" />
          <NavItem active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} icon={<AlertTriangle size={18}/>} label="Alertas" />
        </nav>

        <div className="p-4 border-t border-slate-700 mt-auto bg-slate-900/20">
          <div className="flex items-center gap-3 px-2 py-2 mb-4">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{isAdmin ? 'Administrador' : 'Técnico'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest">
            <LogOut size={14} /> <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{getTitle()}</h2>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Pesquisa rápida..." 
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 rounded text-xs outline-none transition-all w-48 text-black font-medium"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-400">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest">Servidor Ativo</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-sm font-medium ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-700 hover:text-white'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
