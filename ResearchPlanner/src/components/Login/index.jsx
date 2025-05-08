import React from 'react';
import '../../index.css';
import { useNavigate } from 'react-router-dom';
import { validateLogin, addUser } from '../../data/user.js';

const Login = () => {
    const navigate = useNavigate();
    const [loginEmail, setLoginEmail] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [signupEmail, setSignupEmail] = React.useState('');
    const [signupPassword, setSignupPassword] = React.useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = React.useState('');

    const handleLoginChange = (e) => setLoginEmail(e.target.value);
    const handlePasswordChange = (e) => setLoginPassword(e.target.value);
    const handleSignupEmailChange = (e) => setSignupEmail(e.target.value);
    const handleSignupPasswordChange = (e) => setSignupPassword(e.target.value);
    const handleSignupConfirmPasswordChange = (e) => setSignupConfirmPassword(e.target.value);

    const handleLogin = async () => {
        await validateLogin(loginEmail, loginPassword)
            .then((success) => {
                if (success) {
                    alert('Login successful!');
                    navigate('/home');
                } else {
                    alert('Invalid email or password!');
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                alert('An unexpected error occurred.');
            });
    };



    const handleSignup = async () => {
        if (signupPassword !== signupConfirmPassword) {
            alert('Passwords do not match!');
        } else {
            await addUser(signupEmail, signupPassword)
                .then(() => {
                    alert('Sign Up successful!');
                    navigate('/home');
                })
                .catch((error) => {
                    console.error('Sign Up error:', error);
                    alert('An error occurred during sign up.');
                });
        }
    };

    return (
        <div className="text-center p-12 font-sans bg-blue-50">
            <h1 className="text-gray-800 text-4xl mb-5">Welcome to Research Planner</h1>
            <p className="text-gray-600 text-lg mb-8">
                Plan and organize your research projects effortlessly.
            </p>
            <div className="flex justify-center gap-12">
                {/* Login Forms */}
                <div className="text-left">
                    <h2 className="text-gray-800 text-2xl mb-4">Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={handleLoginChange}
                        className="block mb-3 p-2 w-full border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={handlePasswordChange}
                        className="block mb-3 p-2 w-full border border-gray-300 rounded"
                    />
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>

                {/* Signup Forms */}
                <div className="text-left">
                    <h2 className="text-gray-800 text-2xl mb-4">Sign Up</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={signupEmail}
                        onChange={handleSignupEmailChange}
                        className="block mb-3 p-2 w-full border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={signupPassword}
                        onChange={handleSignupPasswordChange}
                        className="block mb-3 p-2 w-full border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={signupConfirmPassword}
                        onChange={handleSignupConfirmPasswordChange}
                        className="block mb-3 p-2 w-full border border-gray-300 rounded"
                    />
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                        onClick={handleSignup}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;