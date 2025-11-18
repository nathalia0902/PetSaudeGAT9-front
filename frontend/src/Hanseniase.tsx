import React, { useState, useEffect } from 'react';
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
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const CalculatorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2"></rect>
    <path d="M8 6h8"></path>
    <path d="M16 14v4"></path>
    <path d="M16 10v.01"></path>
    <path d="M12 10v.01"></path>
    <path d="M8 10v.01"></path>
    <path d="M12 14v.01"></path>
    <path d="M8 14v.01"></path>
    <path d="M12 18v.01"></path>
    <path d="M8 18v.01"></path>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

// Componentes ESPECÍFICOS para Hanseníase/Tuberculose
const HTCard = ({ children, className = '' }: any) => (
  <div className={`ht-card ${className}`}>
    {children}
  </div>
);

const HTButton = ({ children, variant = 'default', className = '', ...props }: any) => (
  <button className={`ht-btn ht-btn--${variant} ${className}`} {...props}>
    {children}
  </button>
);

const HTInput = ({ className = '', ...props }: any) => (
  <input className={`ht-input ${className}`} {...props} />
);

const HTLabel = ({ children, className = '' }: any) => (
  <label className={`ht-label ${className}`}>
    {children}
  </label>
);

const HTSelect = ({ children, value, onValueChange, ...props }: any) => (
  <select className="ht-select" value={value} onChange={(e) => onValueChange && onValueChange(e.target.value)} {...props}>
    {children}
  </select>
);

const HTSelectItem = ({ value, children }: any) => (
  <option value={value}>{children}</option>
);

// Componente de Tabs ESPECÍFICO
const HTTabs = ({ defaultValue, children }: any) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab } as any);
    }
    return child;
  });

  return <div className="ht-tabs">{childrenWithProps}</div>;
};

const HTTabsList = ({ children, activeTab, setActiveTab }: any) => {
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab } as any);
    }
    return child;
  });

  return <div className="ht-tabs-list">{childrenWithProps}</div>;
};

const HTTabsTrigger = ({ value, children, activeTab, setActiveTab }: any) => (
  <button
    className={`ht-tabs-trigger ${activeTab === value ? 'ht-tabs-trigger--active' : ''}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const HTTabsContent = ({ value, children, activeTab }: any) => {
  if (activeTab !== value) return null;
  return <div className="ht-tabs-content">{children}</div>;
};

// StatusBadge mantém igual (não precisa modificar)
const StatusBadge = ({ status }: { status: 'alto' | 'medio' | 'baixo' | 'identificado' | 'convocado' | 'avaliado' | 'tpt_inicio' | 'tpt_concluido' }) => {
  const statusConfig = {
    alto: { label: 'Alto Risco', class: 'status-badge--warning' },
    medio: { label: 'Médio Risco', class: 'status-badge--info' },
    baixo: { label: 'Baixo Risco', class: 'status-badge--success' },
    identificado: { label: 'Identificado', class: 'status-badge--default' },
    convocado: { label: 'Convocado', class: 'status-badge--info' },
    avaliado: { label: 'Avaliado', class: 'status-badge--success' },
    tpt_inicio: { label: 'TPT Início', class: 'status-badge--warning' },
    tpt_concluido: { label: 'TPT Concluído', class: 'status-badge--success' }
  };

  const config = statusConfig[status] || { label: status, class: 'status-badge--default' };

  return (
    <span className={`status-badge ${config.class}`}>
      {config.label}
    </span>
  );
};

function Hanseniase() {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Novos estados para filtros
  const [filters, setFilters] = useState({
    street: "",
    neighborhood: "",
    riskLevel: "",
    status: "",
    lastAssessment: ""
  });

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

  // Dados mockados de pacientes atualizados
  const patients = [
    { 
      id: "1247", 
      name: "João Silva Santos", 
      cpf: "123.456.789-00", 
      lastRisk: "alto", 
      lastAssessment: "15/03/2024",
      address: "Rua das Flores, 123 - Centro",
      neighborhood: "Centro"
    },
    { 
      id: "1189", 
      name: "Maria Oliveira Lima", 
      cpf: "987.654.321-00", 
      lastRisk: "medio", 
      lastAssessment: "10/03/2024",
      address: "Av. Principal, 456 - Jardim",
      neighborhood: "Jardim das Flores"
    },
    { 
      id: "1156", 
      name: "Pedro Costa Alves", 
      cpf: "456.789.123-00", 
      lastRisk: "baixo", 
      lastAssessment: "08/03/2024",
      address: "Rua Secundária, 789 - Vila",
      neighborhood: "Vila Nova"
    },
  ];

  const handleSearch = () => {
    const patient = patients.find(p => 
      p.cpf.includes(searchTerm) || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (patient) {
      setSelectedPatient(patient);
    } else {
      alert("Paciente não encontrado");
    }
  };

  // Função para buscar com filtros
  const handleFilterSearch = () => {
    console.log("Buscando com filtros:", filters);
    alert("Busca com filtros realizada!");
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilters({
      street: "",
      neighborhood: "",
      riskLevel: "",
      status: "",
      lastAssessment: ""
    });
  };

  const calculateRisk = () => {
    alert("Cálculo de risco iniciado");
  };

  if (!user) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-with-sidebar">
      {/* Sidebar - mantém igual */}
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
              {user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
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

      {/* Main Content - Agora com classes específicas */}
      <main className="main-content hanseniase-tuberculose-content">
        <header className="content-header hanseniase-tuberculose-header">
          <div>
            <h1 className="content-title hanseniase-tuberculose-title">Hanseníase</h1>
            <p className="content-subtitle hanseniase-tuberculose-subtitle">
              Sistema de estratificação de risco e monitoramento de pacientes
            </p>
          </div>
        </header>

        <div className="content-area hanseniase-tuberculose-area">
          <HTTabs defaultValue="assessment">
            <HTTabsList>
              <HTTabsTrigger value="assessment">
                <CalculatorIcon />
                Nova Avaliação
              </HTTabsTrigger>
              <HTTabsTrigger value="history">
                <HistoryIcon />
                Histórico
              </HTTabsTrigger>
              <HTTabsTrigger value="map">
                <MapIcon />
                Mapa de Calor
              </HTTabsTrigger>
            </HTTabsList>

            <HTTabsContent value="assessment">
              {/* Filtros de Busca Avançados */}
              <div className="ht-search-filters">
                <h3 className="ht-filters-title">
                  <SearchIcon />
                  Filtros de Busca Avançada
                </h3>
                <div className="ht-filters-grid">
                  <div className="ht-filter-group">
                    <HTLabel htmlFor="street">Rua</HTLabel>
                    <HTInput
                      id="street"
                      placeholder="Nome da rua..."
                      value={filters.street}
                      onChange={(e) => setFilters({...filters, street: e.target.value})}
                    />
                  </div>
                  
                  <div className="ht-filter-group">
                    <HTLabel htmlFor="neighborhood">Bairro</HTLabel>
                    <HTInput
                      id="neighborhood"
                      placeholder="Nome do bairro..."
                      value={filters.neighborhood}
                      onChange={(e) => setFilters({...filters, neighborhood: e.target.value})}
                    />
                  </div>
                  
                  <div className="ht-filter-group">
                    <HTLabel htmlFor="riskLevel">Nível de Risco</HTLabel>
                    <HTSelect 
                      id="riskLevel"
                      value={filters.riskLevel}
                      onValueChange={(value) => setFilters({...filters, riskLevel: value})}
                    >
                      <option value="">Todos</option>
                      <option value="alto">Alto Risco</option>
                      <option value="medio">Médio Risco</option>
                      <option value="baixo">Baixo Risco</option>
                    </HTSelect>
                  </div>
                  
                  <div className="ht-filter-group">
                    <HTLabel htmlFor="status">Status</HTLabel>
                    <HTSelect 
                      id="status"
                      value={filters.status}
                      onValueChange={(value) => setFilters({...filters, status: value})}
                    >
                      <option value="">Todos</option>
                      <option value="identificado">Identificado</option>
                      <option value="convocado">Convocado</option>
                      <option value="avaliado">Avaliado</option>
                    </HTSelect>
                  </div>
                </div>
                
                <div className="ht-filter-actions">
                  <HTButton variant="outline" onClick={handleClearFilters}>
                    Limpar Filtros
                  </HTButton>
                  <HTButton onClick={handleFilterSearch}>
                    <SearchIcon />
                    Buscar com Filtros
                  </HTButton>
                </div>
              </div>

              {/* Busca Rápida */}
              <div className="ht-quick-search">
                <h3 className="ht-quick-search-title">
                  <SearchIcon />
                  Busca Rápida
                </h3>
                <div className="ht-quick-search-container">
                  <HTInput
                    placeholder="Digite CPF, nome do paciente ou endereço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <HTButton onClick={handleSearch}>
                    <SearchIcon />
                    Buscar
                  </HTButton>
                </div>
              </div>

              {/* Resultados ou Formulário */}
              {selectedPatient ? (
                <>
                  <HTCard className="ht-patient-card">
                    <div className="ht-results-header">
                      <h3 className="ht-results-title">
                        <FileTextIcon />
                        Paciente Encontrado
                      </h3>
                      <span className="ht-results-count">1 resultado</span>
                    </div>
                    <div className="ht-patient-info-grid">
                      <div className="ht-info-item">
                        <HTLabel>Nome Completo</HTLabel>
                        <p>{selectedPatient.name}</p>
                      </div>
                      <div className="ht-info-item">
                        <HTLabel>CPF</HTLabel>
                        <p>{selectedPatient.cpf}</p>
                      </div>
                      <div className="ht-info-item">
                        <HTLabel>Endereço</HTLabel>
                        <p>{selectedPatient.address}</p>
                      </div>
                      <div className="ht-info-item">
                        <HTLabel>Bairro</HTLabel>
                        <p>{selectedPatient.neighborhood}</p>
                      </div>
                      <div className="ht-info-item">
                        <HTLabel>Última Avaliação</HTLabel>
                        <p>{selectedPatient.lastAssessment}</p>
                      </div>
                      <div className="ht-info-item">
                        <HTLabel>Risco Atual</HTLabel>
                        <StatusBadge status={selectedPatient.lastRisk} />
                      </div>
                    </div>
                  </HTCard>

                  <HTCard className="ht-assessment-card">
                    <h3 className="ht-card-title">
                      <CalculatorIcon />
                      Questionário de Estratificação de Risco
                    </h3>
                    <form className="ht-assessment-form">
                      <div className="ht-form-grid">
                        <div className="ht-form-group">
                          <HTLabel htmlFor="classificacao">Classificação Operacional *</HTLabel>
                          <HTSelect id="classificacao">
                            <option value="">Selecione...</option>
                            <HTSelectItem value="paucibacilar">Paucibacilar (PB)</HTSelectItem>
                            <HTSelectItem value="multibacilar">Multibacilar (MB)</HTSelectItem>
                          </HTSelect>
                        </div>

                        <div className="ht-form-group">
                          <HTLabel htmlFor="grau-incapacidade">Grau de Incapacidade Física *</HTLabel>
                          <HTSelect id="grau-incapacidade">
                            <option value="">Selecione...</option>
                            <HTSelectItem value="0">Grau 0 (Nenhuma)</HTSelectItem>
                            <HTSelectItem value="1">Grau 1 (Leve)</HTSelectItem>
                            <HTSelectItem value="2">Grau 2 (Severa)</HTSelectItem>
                          </HTSelect>
                        </div>

                        <div className="ht-form-group">
                          <HTLabel htmlFor="num-lesoes">Número de Lesões Cutâneas *</HTLabel>
                          <HTInput id="num-lesoes" type="number" placeholder="Ex: 5" />
                        </div>

                        <div className="ht-form-group">
                          <HTLabel htmlFor="nervos-afetados">Nervos Afetados *</HTLabel>
                          <HTSelect id="nervos-afetados">
                            <option value="">Selecione...</option>
                            <HTSelectItem value="nenhum">Nenhum</HTSelectItem>
                            <HTSelectItem value="1-2">1-2 nervos</HTSelectItem>
                            <HTSelectItem value="3+">3 ou mais nervos</HTSelectItem>
                          </HTSelect>
                        </div>

                        <div className="ht-form-group">
                          <HTLabel htmlFor="condicao-moradia">Condição de Moradia *</HTLabel>
                          <HTSelect id="condicao-moradia">
                            <option value="">Selecione...</option>
                            <HTSelectItem value="adequada">Adequada</HTSelectItem>
                            <HTSelectItem value="precaria">Precária</HTSelectItem>
                            <HTSelectItem value="muito-precaria">Muito Precária</HTSelectItem>
                          </HTSelect>
                        </div>

                        <div className="ht-form-group">
                          <HTLabel htmlFor="renda">Faixa de Renda Familiar *</HTLabel>
                          <HTSelect id="renda">
                            <option value="">Selecione...</option>
                            <HTSelectItem value="ate-1sm">Até 1 salário mínimo</HTSelectItem>
                            <HTSelectItem value="1-3sm">1-3 salários mínimos</HTSelectItem>
                            <HTSelectItem value="acima-3sm">Acima de 3 salários</HTSelectItem>
                          </HTSelect>
                        </div>

                        <div className="ht-form-group">
                          <HTLabel htmlFor="contatos">Número de Contatos Domiciliares *</HTLabel>
                          <HTInput id="contatos" type="number" placeholder="Ex: 4" />
                        </div>

                        <div className="ht-form-group">
                          <HTLabel htmlFor="acesso-saude">Acesso a Serviços de Saúde *</HTLabel>
                          <HTSelect id="acesso-saude">
                            <option value="">Selecione...</option>
                            <HTSelectItem value="facil">Fácil</HTSelectItem>
                            <HTSelectItem value="moderado">Moderado</HTSelectItem>
                            <HTSelectItem value="dificil">Difícil</HTSelectItem>
                          </HTSelect>
                        </div>
                      </div>

                      <div className="ht-form-actions">
                        <HTButton variant="outline" type="button">
                          Cancelar
                        </HTButton>
                        <HTButton type="button" onClick={calculateRisk}>
                          <CalculatorIcon />
                          Calcular Risco
                        </HTButton>
                      </div>
                    </form>
                  </HTCard>
                </>
              ) : (
                <div className="ht-search-results">
                  <div className="ht-results-header">
                    <h3 className="ht-results-title">
                      <SearchIcon />
                      Resultados da Busca
                    </h3>
                    <span className="ht-results-count">Nenhum paciente encontrado</span>
                  </div>
                  <p>Use os filtros acima para buscar pacientes.</p>
                </div>
              )}
            </HTTabsContent>

            <HTTabsContent value="history">
              <HTCard className="ht-history-card">
                <div className="ht-results-header">
                  <h3 className="ht-results-title">Histórico de Avaliações</h3>
                  <span className="ht-results-count">{patients.length} pacientes</span>
                </div>
                <div className="ht-history-list">
                  {patients.map((patient) => (
                    <div key={patient.id} className="ht-history-item">
                      <div className="ht-patient-info">
                        <p className="ht-patient-name">{patient.name}</p>
                        <p className="ht-patient-details">
                          {patient.address} • CPF: {patient.cpf}
                        </p>
                      </div>
                      <div className="ht-patient-status">
                        <div className="ht-status-info">
                          <p>Última avaliação</p>
                          <p className="ht-assessment-date">{patient.lastAssessment}</p>
                        </div>
                        <StatusBadge status={patient.lastRisk} />
                        <HTButton variant="outline" className="ht-btn--sm">
                          Detalhes
                        </HTButton>
                      </div>
                    </div>
                  ))}
                </div>
              </HTCard>
            </HTTabsContent>

            <HTTabsContent value="map">
              <HTCard className="ht-map-card">
                <h3 className="ht-card-title">Mapa de Calor - Casos de Hanseníase</h3>
                <div className="ht-map-placeholder">
                  <p>Mapa de calor será implementado aqui</p>
                </div>
              </HTCard>
            </HTTabsContent>
          </HTTabs>
        </div>
      </main>
    </div>
  );
}

export default Hanseniase;