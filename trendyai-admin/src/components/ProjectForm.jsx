import React, { useState, useEffect } from 'react';

const statusOptions = [
  'Briefing',
  'In Progress',
  'Awaiting Approval',
  'Completed',
  'On Hold',
  'Cancelled',
];

const ProjectForm = ({ clients, agents, initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    clientId: '',
    agent: '',
    status: 'Briefing',
    progress: 0,
    deadline: '',
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.clientId) return;
    onSave(form);
  };

  return (
    <form
      className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-xl max-w-lg mx-auto"
      onSubmit={handleSubmit}
      aria-label={initialData ? 'Edit Project' : 'Add Project'}
    >
      <h2 className="text-xl font-bold mb-6 text-text-main font-heading">{initialData ? 'Edit Campaign Project' : 'Create Campaign Project'}</h2>
      
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-sub mb-2" htmlFor="name">Project Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="crm-input"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-sub mb-2" htmlFor="description">Description / Campaign Briefing</label>
        <textarea
          id="description"
          name="description"
          className="crm-input h-24 resize-none"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-sub mb-2" htmlFor="clientId">Linked Client Account</label>
        <select
          id="clientId"
          name="clientId"
          className="crm-input appearance-none bg-bg-card"
          value={form.clientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Client Account</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-sub mb-2" htmlFor="agent">Assigned Agent / Group</label>
        <select
          id="agent"
          name="agent"
          className="crm-input appearance-none bg-bg-card"
          value={form.agent}
          onChange={handleChange}
        >
          <option value="">Select Agent/Group</option>
          {agents.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-sub mb-2" htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          className="crm-input appearance-none bg-bg-card"
          value={form.status}
          onChange={handleChange}
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-sub mb-2" htmlFor="progress">Progress (%)</label>
        <input
          id="progress"
          name="progress"
          type="number"
          min={0}
          max={100}
          className="crm-input"
          value={form.progress}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-sub mb-2" htmlFor="deadline">Target Deadline</label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          className="crm-input"
          value={form.deadline}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex gap-2 justify-end pt-4">
        <button
          type="button"
          className="crm-btn crm-btn-secondary py-2 px-4 text-xs font-bold"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="crm-btn crm-btn-primary py-2 px-4 text-xs font-bold"
        >
          Save Campaign
        </button>
      </div>
    </form>
  );
};

export default ProjectForm; 
