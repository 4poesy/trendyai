import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border-2 border-cyan-500" onSubmit={handleSubmit} aria-label="Login form">
        <h1 className="text-2xl font-bold mb-6 text-center text-navy-900">TrendyAI Admin Login</h1>
        <label className="block mb-2 text-sm font-medium text-navy-900" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="w-full mb-4 px-3 py-2 rounded border-2 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-navy-900"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          aria-required="true"
        />
        <label className="block mb-2 text-sm font-medium text-navy-900" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="w-full mb-4 px-3 py-2 rounded border-2 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-navy-900"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-required="true"
        />
        {error && <div className="mb-4 text-red-600 text-sm" role="alert">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded bg-cyan-500 text-navy-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 
