import React, { useState } from 'react';

// ✅ URL da API configurada via variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    cpf: string;
    funcao: string;
    full_name: string;
  };
}

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profissional' | 'paciente'>('profissional');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cpfRecuperar, setCpfRecuperar] = useState('');
  
  const [cpfProf, setCpfProf] = useState('');
  const [senhaProf, setSenhaProf] = useState('');
  
  const [cpfPac, setCpfPac] = useState('');
  const [cartaoSUS, setCartaoSUS] = useState('');

  // Estados para erros de validação
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successData, setSuccessData] = useState<{name: string, role: string} | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      let formatted = numbers.replace(/(\d{3})(\d)/, '$1.$2');
      formatted = formatted.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      formatted = formatted.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      return formatted;
    }
    return value;
  };

  const formatCartaoSUS = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 15) {
      let formatted = numbers.replace(/(\d{3})(\d)/, '$1 $2');
      formatted = formatted.replace(/(\d{3}) (\d{4})(\d)/, '$1 $2 $3');
      formatted = formatted.replace(/(\d{3}) (\d{4}) (\d{4})(\d)/, '$1 $2 $3 $4');
      return formatted;
    }
    return value;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (activeTab === 'profissional') {
      if (!cpfProf || cpfProf.replace(/\D/g, '').length !== 11) {
        newErrors.cpfProf = 'Por favor, informe um CPF válido';
      }
      if (!senhaProf) {
        newErrors.senhaProf = 'Por favor, informe sua senha';
      }
    } else {
      if (!cpfPac || cpfPac.replace(/\D/g, '').length !== 11) {
        newErrors.cpfPac = 'Por favor, informe um CPF válido';
      }
      if (!cartaoSUS || cartaoSUS.replace(/\D/g, '').length !== 15) {
        newErrors.cartaoSUS = 'Por favor, informe um Cartão SUS válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfissionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const cpfSemMascara = cpfProf.replace(/\D/g, '');
      
      // ✅ URL CORRIGIDA - usando variável de ambiente
      const response = await fetch(`${API_BASE_URL}/api/v1/token/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'username': cpfSemMascara,
          'password': senhaProf
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha no login');
      }

      const data: LoginResponse = await response.json();
      
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Mostra o popup simples e redireciona automaticamente
      setSuccessData({
        name: data.user.full_name,
        role: data.user.funcao
      });
      setShowSuccess(true);

      // Redireciona automaticamente após 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      alert(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('Erro ao fazer login:', error);
    }
  };

  const handlePacienteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    alert('Login paciente - em desenvolvimento');
  };

  const handleEnviarEmail = () => {
    if (cpfRecuperar.trim() === "") {
      alert("Por favor, digite seu CPF.");
      return;
    }
    alert(`Um link de recuperação foi enviado por E-MAIL para o CPF: ${cpfRecuperar}`);
    setShowModal(false);
    setCpfRecuperar('');
  };

  const handleEnviarTelefone = () => {
    if (cpfRecuperar.trim() === "") {
      alert("Por favor, digite seu CPF.");
      return;
    }
    alert(`Um código foi enviado por SMS para o CPF: ${cpfRecuperar}`);
    setShowModal(false);
    setCpfRecuperar('');
  };

  const testAccounts = [
    { funcao: 'Médico', cpf: '111.111.111-11', senha: 'senha123' },
    { funcao: 'Agente', cpf: '222.222.222-22', senha: 'agente456' },
    { funcao: 'Enfermeiro', cpf: '333.333.333-33', senha: 'admin789' },
    { funcao: 'Administrador', cpf: '444.444.444-44', senha: 'usuario000' },
    { funcao: 'Paciente', cpf: '555.555.555-55', senha: 'paciente001' }
  ];

  return (
    <div className="container">
      <div className="logo">
        <div className="icon">💙</div>
        <h1>Monitora SUS</h1>
        <p>Dados que salvam vidas</p>
      </div>

      <div className="form-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'profissional' ? 'active' : ''}`}
            onClick={() => setActiveTab('profissional')}
          >
            Profissional
          </button>
          <button 
            className={`tab ${activeTab === 'paciente' ? 'active' : ''}`}
            onClick={() => setActiveTab('paciente')}
          >
            Paciente
          </button>
        </div>

        {/* FORMULÁRIO PROFISSIONAL */}
        <form 
          className={`form ${activeTab === 'profissional' ? 'active' : ''}`}
          onSubmit={handleProfissionalLogin}
          noValidate
        >
          <label htmlFor="cpf-prof">CPF *</label>
          <input 
            type="text" 
            id="cpf-prof" 
            placeholder="000.000.000-00" 
            value={cpfProf}
            onChange={(e) => {
              setCpfProf(formatCPF(e.target.value));
              setErrors(prev => ({ ...prev, cpfProf: '' }));
            }}
            maxLength={14}
            className={errors.cpfProf ? 'error' : ''}
          />
          {errors.cpfProf && <span className="error-message">{errors.cpfProf}</span>}

          <label htmlFor="senha">Senha *</label>
          <input 
            type="password" 
            id="senha" 
            placeholder="Digite sua senha" 
            value={senhaProf}
            onChange={(e) => {
              setSenhaProf(e.target.value);
              setErrors(prev => ({ ...prev, senhaProf: '' }));
            }}
            className={errors.senhaProf ? 'error' : ''}
          />
          {errors.senhaProf && <span className="error-message">{errors.senhaProf}</span>}

          <a href="#" className="link" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>
            Esqueceu a senha?
          </a>
          <button type="submit" className="btn">Entrar</button>
          <p className="note">Acesso restrito a profissionais de saúde</p>
        </form>

        {/* FORMULÁRIO PACIENTE */}
        <form 
          className={`form ${activeTab === 'paciente' ? 'active' : ''}`}
          onSubmit={handlePacienteLogin}
          noValidate
        >
          <label htmlFor="cpf-pac">CPF *</label>
          <input 
            type="text" 
            id="cpf-pac" 
            placeholder="000.000.000-00" 
            value={cpfPac}
            onChange={(e) => {
              setCpfPac(formatCPF(e.target.value));
              setErrors(prev => ({ ...prev, cpfPac: '' }));
            }}
            maxLength={14}
            className={errors.cpfPac ? 'error' : ''}
          />
          {errors.cpfPac && <span className="error-message">{errors.cpfPac}</span>}

          <label htmlFor="cartao">Número do Cartão SUS *</label>
          <input 
            type="text" 
            id="cartao" 
            placeholder="000 0000 0000 0000" 
            value={cartaoSUS}
            onChange={(e) => {
              setCartaoSUS(formatCartaoSUS(e.target.value));
              setErrors(prev => ({ ...prev, cartaoSUS: '' }));
            }}
            maxLength={18}
            className={errors.cartaoSUS ? 'error' : ''}
          />
          {errors.cartaoSUS && <span className="error-message">{errors.cartaoSUS}</span>}

          <a href="#" className="link" onClick={(e) => e.preventDefault()}>
            Não tenho cartão SUS
          </a>
          <button type="submit" className="btn">Acessar</button>
          <p className="note">Consulte seus atendimentos e histórico médico</p>
        </form>
      </div>

      <div className="test-accounts">
        <h3>Contas de Teste:</h3>
        <div className="account-list">
          {testAccounts.map((account, index) => (
            <div key={index} className="account">
              <strong>{account.funcao}:</strong> {account.cpf} / {account.senha}
            </div>
          ))}
        </div>
      </div>

      <footer>
        <p>© 2025 Monitora SUS<br />Governo Federal do Brasil</p>
      </footer>

      {/* MODAL DE RECUPERAÇÃO DE SENHA */}
      {showModal && (
        <div 
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Recuperar Senha</h2>
            <label htmlFor="cpf-recuperar">Digite seu CPF</label>
            <input 
              type="text" 
              id="cpf-recuperar" 
              placeholder="000.000.000-00" 
              value={cpfRecuperar}
              onChange={(e) => setCpfRecuperar(formatCPF(e.target.value))}
              maxLength={14}
            />

            <div className="modal-buttons">
              <button onClick={handleEnviarEmail}>Enviar por E-mail</button>
              <button onClick={handleEnviarTelefone}>Enviar por Telefone</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DE SUCESSO SIMPLES */}
      {showSuccess && (
        <div className="success-simple">
          <div className="success-simple-content">
            <div className="success-simple-icon">✓</div>
            <h3>Login Realizado com Sucesso!</h3>
            <p className="success-simple-welcome">Bem-vindo ao sistema</p>
            <p className="success-simple-name">{successData?.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;