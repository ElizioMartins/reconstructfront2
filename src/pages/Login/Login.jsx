import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logoIssi from '../../assets/logo/logo-issi.svg';
import logoOperacional from '../../assets/logo/logo-operacional.svg';
import logoTi from '../../assets/logo/logo-ti.svg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { login} from '../../services/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

 const handleLogin =  async (e) => {
   e.preventDefault();

   try {
     const data = await login(username, password)
     console.log(data);

     navigate('/dashboard');
   } catch (error) {
     console.error('Erro de login:', error.message);
   }
 };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="photo-credit">Foto: Acervo Insanos M.C.</div>
      </div>
      <div className="login-form-container">
        <div className="login-header">
          <div className="logo-title-container">
            <img src={logoIssi} alt="Logo" className="logo" />
            <div className="title-container">
              <h1>Sistema de Gestão</h1>
              <h2>de Staff</h2>
            </div>
          </div>
          <h2 className="welcome-text">Seja bem vindo!</h2>
        </div>

        <div className="login-form">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                placeholder="Digite o usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Lembrar-me</label>
              </div>
              <a href="#" className="forgot-password">Esqueci a senha</a>
            </div>
            
            <button type="submit" className="login-button">Acessar</button>
          </form>
          
          <div className="support-contact">
            <button className="support-button">Contato com o suporte</button>
          </div>
        </div>
        
        <div className="login-footer">
          <div className="footer-logos">
            <img src={logoOperacional} alt="Logo Operacional" />
            <img src={logoTi} alt="Logo TI" />
          </div>
          <p>© Insanos M.C. Tecnologia e Instrução 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
