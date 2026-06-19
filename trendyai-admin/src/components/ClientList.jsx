import React from 'react';
import { FaUser, FaEnvelope, FaBuilding, FaEdit, FaTrash } from 'react-icons/fa';

export default function ClientList({ clients, onEdit, onDelete, onView }) {
  return (
    <div className="crm-card">
      <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border-main pb-3">Accounts Overview</h2>
      
      {clients.length === 0 ? (
        <div className="text-center py-10 text-text-muted">
          <FaBuilding className="mx-auto text-3xl mb-3" />
          <p className="text-sm">No client accounts match your search filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {clients.map(client => (
            <div 
              key={client.id} 
              className="p-7 md:p-8 bg-bg-panel border border-border-main rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors"
            >
              {/* Account details */}
              <button
                type="button"
                onClick={() => onView(client)}
                className="text-left bg-transparent border-none p-0 focus:outline-none flex-1"
                aria-label={`View details for ${client.name}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main text-base hover:text-primary transition-colors flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {client.name}
                      <span className={`badge ${client.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {client.status}
                      </span>
                    </h3>
                    <p className="text-xs text-text-sub mt-1.5 flex items-center gap-1.5">
                      <FaEnvelope size={11} className="text-text-muted" /> {client.email}
                    </p>
                  </div>
                </div>
                {client.briefing && (
                  <div className="text-xs text-text-sub mt-4 bg-bg-card border border-border-main/50 px-4 py-3 rounded font-sans italic">
                    <span className="font-bold not-italic text-text-muted uppercase text-[9px] block mb-1 tracking-wider">Briefing objective:</span>
                    "{client.briefing}"
                  </div>
                )}
              </button>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 md:pt-0 self-end md:self-center">
                <button 
                  onClick={() => onEdit(client)} 
                  className="crm-btn crm-btn-secondary py-2 px-4 text-xs"
                >
                  Edit Account
                </button>
                <button 
                  onClick={() => onDelete(client.id)} 
                  className="crm-btn crm-btn-danger py-2 px-4 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}