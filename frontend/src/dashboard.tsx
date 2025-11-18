import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  cpf: string;
  funcao: string;
  full_name: string;
}

// Função para mostrar nomes bonitos das funções
const getRoleDisplayName = (role: string) => {
  const roleNames: { [key: string]: string } = {
    'medico': 'Médico',
    'agente': 'Agente de Saúde',
    'enfermeiro': 'Enfermeiro', 
    'administrador': 'Administrador',
    'paciente': 'Paciente'
  };
  return roleNames[role] || role;
};

// Ícones SVG
const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const UserCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </svg>
);

const FileTextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const StatCard = ({ title, value, description, icon: Icon, variant = 'default', trend }: any) => (
  <div className={`stat-card stat-card--${variant}`}>
    <div className="stat-card__header">
      <div className="stat-card__icon">
        <Icon />
      </div>
      {trend && (
        <div className={`stat-card__trend ${trend.positive ? 'positive' : 'negative'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </div>
    <div className="stat-card__content">
      <h3 className="stat-card__title">{title}</h3>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__description">{description}</p>
    </div>
  </div>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'default', className = '', ...props }: any) => (
  <button className={`btn btn--${variant} ${className}`} {...props}>
    {children}
  </button>
);

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!user) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-with-sidebar">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="heart-icon">
              <HeartIcon />
            </div>
            <div className="logo-text">
              <h1 className="logo-title">Monitora SUS</h1>
              <p className="logo-subtitle">Dados que salvam vidas</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-item ${location.pathname === '/hanseniase' ? 'active' : ''}`}
            onClick={() => handleNavigation('/hanseniase')}
          >
            Hanseníase
          </button>
          <button 
            className={`nav-item ${location.pathname === '/tuberculose' ? 'active' : ''}`}
            onClick={() => handleNavigation('/tuberculose')}
          >
            Tuberculose
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar">
              {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name-sidebar">{user.full_name}</div>
              <div className="user-role-sidebar">{getRoleDisplayName(user.funcao)}</div>
            </div>
          </div>
          <button className="logout-btn-sidebar" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <div>
            <h1 className="content-title">Dashboard</h1>
            <p className="content-subtitle">
              Visão geral do monitoramento de doenças negligenciadas
            </p>
          </div>
        </header>

        <div className="content-area">
          {/* Stats Grid */}
          <div className="stats-grid">
            <StatCard
              title="Casos Ativos Hanseníase"
              value="247"
              description="Total em acompanhamento"
              icon={ActivityIcon}
              variant="primary"
              trend={{ value: "12", positive: false }}
            />
            <StatCard
              title="Casos Ativos Tuberculose"
              value="189"
              description="Total em Acompanhamento"
              icon={UsersIcon}
              variant="secondary"
              trend={{ value: "8", positive: false }}
            />
            <StatCard
              title="Contatos Monitorados"
              value="436"
              description="Total de Casos"
              icon={UserCheckIcon}
              variant="default"
              trend={{ value: "15", positive: true }}
            />
          </div>

          {/* Action Cards */}
          <div className="action-grid">
            <Card className="action-card">
              <div className="action-card__header action-card__header--primary">
                <FileTextIcon />
                <h3 className="action-card__title">Hanseníase</h3>
                <p className="action-card__description">
                  Sistema de estratificação de risco para pacientes com hanseníase
                </p>
              </div>
              <div className="action-card__content">
                <div className="action-card__stats">
                  <div className="stat-item">
                    <span className="stat-label">Avaliações pendentes</span>
                    <span className="stat-value">18</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Alta prioridade</span>
                    <span className="stat-value warning">7</span>
                  </div>
                </div>
                <Button 
                  className="action-card__btn" 
                  variant="default"
                  onClick={() => handleNavigation('/hanseniase')}
                >
                  Acessar Módulo
                </Button>
              </div>
            </Card>

            <Card className="action-card">
              <div className="action-card__header action-card__header--secondary">
                <UsersIcon />
                <h3 className="action-card__title">Tuberculose</h3>
                <p className="action-card__description">
                  Painel de monitoramento de contatos e acompanhamento de tratamento
                </p>
              </div>
              <div className="action-card__content">
                <div className="action-card__stats">
                  <div className="stat-item">
                    <span className="stat-label">Contatos a convocar</span>
                    <span className="stat-value">34</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">TPT em andamento</span>
                    <span className="stat-value success">156</span>
                  </div>
                </div>
                <Button 
                  className="action-card__btn" 
                  variant="secondary"
                  onClick={() => handleNavigation('/tuberculose')}
                >
                  Acessar Módulo
                </Button>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="activity-card">
            <h3 className="activity-title">Atividades Recentes</h3>
            <div className="activity-list">
              {[
                { type: "hanseniase", action: "Nova avaliação de risco realizada", patient: "Paciente #1247", time: "Há 2 horas", status: "alto" },
                { type: "tuberculose", action: "Contato avaliado", patient: "Contato #523", time: "Há 3 horas", status: "baixo" },
                { type: "hanseniase", action: "Revisão de estratificação", patient: "Paciente #1189", time: "Há 5 horas", status: "medio" },
                { type: "tuberculose", action: "TPT iniciado", patient: "Contato #498", time: "Há 6 horas", status: "baixo" },
              ].map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className={`activity-icon ${activity.type === "hanseniase" ? "primary" : "secondary"}`}>
                    {activity.type === "hanseniase" ? <FileTextIcon /> : <UsersIcon />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-meta">{activity.patient} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;