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
      className="bg-white/30 dark:bg-slate-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl max-w-lg mx-auto"
      onSubmit={handleSubmit}
      aria-label={initialData ? 'Edit Project' : 'Add Project'}
    >
      <h2 className="text-xl font-bold mb-4 text-cyan-500">{initialData ? 'Edit Project' : 'Add Project'}</h2>
      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="name">Project Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="description">Description/Briefing</label>
        <textarea
          id="description"
          name="description"
          className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="clientId">Linked Client</label>
        <select
          id="clientId"
          name="clientId"
          className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
          value={form.clientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Client</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="agent">Assigned Agent/Group</label>
        <select
          id="agent"
          name="agent"
          className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
          value={form.agent}
          onChange={handleChange}
        >
          <option value="">Select Agent/Group</option>
          {agents.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
          value={form.status}
          onChange={handleChange}
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="progress">Progress (%)</label>
        <input
          id="progress"
          name="progress"
          type="number"
          min={0}
          max={100}
          className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
          value={form.progress}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
          value={form.deadline}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm; 