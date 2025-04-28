'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import  Link  from "next/link"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    try {
      console.log('Sending data:', { email, password });
  
      const response = await fetch('http://127.0.0.1:8000/authentication/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user :{
            email,
            password,
          }
        }),
      });
  
      const data = await response.json();
      console.log('Server response:', data);
  
      if (response.ok) {
        console.log('Sign in successfull:', data);
        const token = data.user.token; // зависит от твоего бэкенда
        if (token) {
          localStorage.setItem('token', token);
        } else {
          console.error('Token not found in response:', data);
        }
        router.push('/dashboard');
      } else {
        let errorMessage = 'Login failed';
        if (data.errors) {
          // Если ошибки находятся в поле "errors"
          errorMessage = Object.values(data.errors).flat().join(' ') || 'Login failed';
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors.join(' ');
        } else {
          errorMessage = Object.values(data).flat().join(' ') || 'Login failed';
        }
        setError(errorMessage);
        console.error('Server error:', data);
      }
    } catch (err: any) {
      setError('Network error occurred. Please check the server and CORS settings.');
      console.error('Detailed error:', err.message || err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-slate-600 mb-1">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-slate-600">Don't have an account yet?</p>
          <Link href="/register">
            <button className="px-4 py-2 bg-gray-200 text-slate-800 rounded-lg hover:bg-gray-300 transition">
              Register
            </button>
          </Link>
        </div>
      </motion.div>
    </div>

  );
};

export default LoginPage;