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
    <form className="bg-bg-card border border-border-main p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto mb-4" onSubmit={handleSubmit} aria-label="Client form">
      <h2 className="text-xl font-bold mb-4 text-text-main font-heading">{initial ? 'Edit Client Account' : 'Add Client Account'}</h2>
      
      <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-text-sub" htmlFor="name">Name</label>
      <input id="name" type="text" className="crm-input mb-4" value={name} onChange={e => setName(e.target.value)} required />
      
      <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-text-sub" htmlFor="email">Email</label>
      <input id="email" type="email" className="crm-input mb-4" value={email} onChange={e => setEmail(e.target.value)} required />
      
      <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-text-sub" htmlFor="status">Status</label>
      <select id="status" className="crm-input mb-4 appearance-none bg-bg-card" value={status} onChange={e => setStatus(e.target.value)}>
        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      
      <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-text-sub" htmlFor="briefing">Briefing (Natural Language Target)</label>
      <textarea id="briefing" className="crm-input mb-4 h-24 resize-none" value={briefing} onChange={e => setBriefing(e.target.value)} rows={3} placeholder="Paste or type client briefing details here..." />
      
      {error && <div className="mb-4 text-red-500 text-xs font-semibold" role="alert">{error}</div>}
      
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onCancel} className="crm-btn crm-btn-secondary py-2 px-4 text-xs font-bold">Cancel</button>
        <button type="submit" className="crm-btn crm-btn-primary py-2 px-4 text-xs font-bold">{initial ? 'Save Changes' : 'Add Account'}</button>
      </div>
    </form>
  );
} 
