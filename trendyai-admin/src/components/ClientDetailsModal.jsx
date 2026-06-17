import React, { useEffect } from 'react';

export default function ClientDetailsModal({ client, onClose, onEdit, onDelete }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!client) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose} aria-modal="true" role="dialog">
      <div className="glass p-6 rounded-xl shadow-xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-500 hover:text-primary" aria-label="Close">&times;</button>
        <h2 className="text-xl font-bold mb-2">{client.name}</h2>
        <div className="mb-2"><span className="font-semibold">Email:</span> {client.email}</div>
        <div className="mb-2"><span className="font-semibold">Status:</span> <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-xs">{client.status}</span></div>
        <div className="mb-4"><span className="font-semibold">Briefing:</span> <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{client.briefing}</div></div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => onEdit(client)} className="px-4 py-2 rounded bg-primary/20 text-primary hover:bg-primary/40">Edit</button>
          <button onClick={() => onDelete(client)} className="px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200">Delete</button>
        </div>
      </div>
    </div>
  );
} 