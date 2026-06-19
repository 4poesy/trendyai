import React from 'react';
import { FaEnvelope, FaBuilding, FaEdit, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

export default function ClientList({ clients, onEdit, onDelete, onView }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border-main pb-4 mb-6">
        <h2 className="text-xl font-bold text-text-main" style={{ fontFamily: "'Outfit', sans-serif" }}>Accounts Overview</h2>
        <span className="text-xs text-text-muted font-medium">{clients.length} Clients Registered</span>
      </div>
      
      {clients.length === 0 ? (
        <div className="crm-card text-center py-12 text-text-muted">
          <FaBuilding className="mx-auto text-4xl mb-4 text-text-muted/60" />
          <p className="text-sm">No client accounts match your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map(client => (
            <div 
              key={client.id} 
              className="crm-card flex flex-col justify-between hover:border-primary/50 transition-all duration-300 p-8 bg-bg-card border border-border-main rounded-xl shadow-sm"
            >
              <div className="space-y-6">
                {/* Header: Avatar, Name & Status */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg shrink-0 border border-primary/10">
                    {client.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-text-main text-lg hover:text-primary transition-colors truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {client.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold mt-2 uppercase tracking-wider ${
                      client.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-text-sub flex items-center gap-2.5">
                    <FaEnvelope className="text-text-muted shrink-0" size={12} /> 
                    <span className="truncate">{client.email}</span>
                  </p>
                  {client.phone && (
                    <p className="text-xs text-text-sub flex items-center gap-2.5">
                      <FaBuilding className="text-text-muted shrink-0" size={12} /> 
                      <span>{client.phone}</span>
                    </p>
                  )}
                </div>

                {/* Briefing */}
                {client.briefing && (
                  <div className="text-xs text-text-sub bg-bg-panel border border-border-main/50 px-4 py-3.5 rounded-lg font-sans italic leading-relaxed">
                    <span className="font-bold not-italic text-text-muted uppercase text-[9px] block mb-1.5 tracking-wider">Briefing objective:</span>
                    "{client.briefing}"
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border-main/40">
                <button 
                  onClick={() => onView(client)}
                  className="crm-btn crm-btn-secondary py-2 px-3 text-xs flex-1 text-center flex items-center justify-center gap-1.5"
                >
                  Details <FaExternalLinkAlt size={10} />
                </button>
                <button 
                  onClick={() => onEdit(client)} 
                  className="crm-btn crm-btn-secondary py-2 px-3 text-xs text-center"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(client.id)} 
                  className="crm-btn crm-btn-danger py-2 px-3 text-xs text-center"
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