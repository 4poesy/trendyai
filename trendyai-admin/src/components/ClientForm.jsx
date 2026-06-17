import React, { useState } from 'react';

const statusOptions = ['Active', 'Onboarding', 'Inactive'];

export default function ClientForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [status, setStatus] = useState(initial?.status || 'Active');
  const [briefing, setBriefing] = useState(initial?.briefing || '');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    onSave({ ...initial, name, email, status, briefing });
  };

  return (
    <form className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto mb-6 border-2 border-cyan-500" onSubmit={handleSubmit} aria-label="Client form">
      <h2 className="text-lg font-semibold mb-4 text-navy-900">{initial ? 'Edit Client' : 'Add Client'}</h2>
      <label className="block mb-2 text-sm font-medium text-navy-900" htmlFor="name">Name</label>
      <input id="name" type="text" className="w-full mb-4 px-3 py-2 rounded border-2 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-navy-900" value={name} onChange={e => setName(e.target.value)} required />
      <label className="block mb-2 text-sm font-medium text-navy-900" htmlFor="email">Email</label>
      <input id="email" type="email" className="w-full mb-4 px-3 py-2 rounded border-2 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-navy-900" value={email} onChange={e => setEmail(e.target.value)} required />
      <label className="block mb-2 text-sm font-medium text-navy-900" htmlFor="status">Status</label>
      <select id="status" className="w-full mb-4 px-3 py-2 rounded border-2 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-navy-900" value={status} onChange={e => setStatus(e.target.value)}>
        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <label className="block mb-2 text-sm font-medium text-navy-900" htmlFor="briefing">Briefing (Natural Language)</label>
      <textarea id="briefing" className="w-full mb-4 px-3 py-2 rounded border-2 border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-navy-900" value={briefing} onChange={e => setBriefing(e.target.value)} rows={3} placeholder="Paste or type client briefing here..." />
      {error && <div className="mb-4 text-red-600 text-sm" role="alert">{error}</div>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 text-navy-900 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-cyan-500 text-navy-900 font-semibold hover:bg-cyan-400">{initial ? 'Save' : 'Add'}</button>
      </div>
    </form>
  );
} 