import React, { useState } from 'react';
import '../../index.css';
import { useNavigate } from 'react-router-dom';
import { validateLogin, addUser } from '../../data/user.js';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthInput = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="block mb-3 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-sm mb-2">{message}</p>
);

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirm: '' });

  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  const updateLogin = (field) => (e) =>
    setLoginData((prev) => ({ ...prev, [field]: e.target.value }));

  const updateSignup = (field) => (e) =>
    setSignupData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleLogin = async () => {
    const { email, password } = loginData;

    // Basic validation
    if (!email || !password) {
      setLoginError('Preencha todos os campos.');
      return;
    }
    if (!emailRegex.test(email)) {
      setLoginError('Insira um e-mail valido, por favor.');
      return;
    }

    try {
      const success = await validateLogin(email, password);
      if (success) {
        setLoginError('');
        navigate('/home');
      } else {
        setLoginError('E-mail ou senha inválidos.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Um erro ocorreu durante o login.');
    }
  };

  const handleSignup = async () => {
    const { email, password, confirm } = signupData;

    // Validation
    if (!email || !password || !confirm) {
      setSignupError('Preencha todos os campos, por favor.');
      return;
    }
    if (!emailRegex.test(email)) {
      setSignupError('Insira um e-mail válido, por favor.');
      return;
    }
    if (password !== confirm) {
      setSignupError('As senhas estão diferentes.');
      return;
    }

    try {
      await addUser(email, password);
      setSignupError('');
      navigate('/home');
    } catch (err) {
      console.error('Signup error:', err);
      setSignupError('Um erro ocorreu durante o cadastro.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-gray-50 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Bem-vindo ao Research Planner</h1>
      <p className="text-gray-600 text-lg mb-10">Planeje e organize os seus projetos de pesquisa com facilidade.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
        {/* Login Section */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
          {loginError && <ErrorMessage message={loginError} />}
          <AuthInput
            type="email"
            placeholder="E-mail"
            value={loginData.email}
            onChange={updateLogin('email')}
          />
          <AuthInput
            type="password"
            placeholder="Senha"
            value={loginData.password}
            onChange={updateLogin('password')}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>

        {/* Signup Section */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sign Up</h2>
          {signupError && <ErrorMessage message={signupError} />}
          <AuthInput
            type="email"
            placeholder="E-mail"
            value={signupData.email}
            onChange={updateSignup('email')}
          />
          <AuthInput
            type="password"
            placeholder="Senha"
            value={signupData.password}
            onChange={updateSignup('password')}
          />
          <AuthInput
            type="password"
            placeholder="Confirme a senha"
            value={signupData.confirm}
            onChange={updateSignup('confirm')}
          />
          <button
            onClick={handleSignup}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;