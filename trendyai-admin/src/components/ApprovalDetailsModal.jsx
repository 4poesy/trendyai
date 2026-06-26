import React, { useState } from 'react';

const statusColors = {
  Pending: 'bg-brand-cyan-soft text-brand-cyan border border-brand-cyan/25',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  'Revisions Requested': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
};

const ApprovalDetailsModal = ({ approval, client, onApprove, onReject, onRequestRevisions, onClose }) => {
  const [showRevision, setShowRevision] = useState(false);
  const [revisionComment, setRevisionComment] = useState('');
  const [error, setError] = useState('');
  if (!approval) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-cyan-500 text-2xl"
          onClick={onClose}
          aria-label="Close approval details"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-cyan-600 mb-2">{approval.task}</h2>
        <div className="mb-2 flex gap-2 items-center">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[approval.status]}`}>{approval.status}</span>
          <span className="text-xs text-gray-500">Submitted: {approval.submittedAt}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Client:</span> {client ? `${client.name} (${client.email})` : approval.clientId}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Agent:</span> {approval.agent}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Details:</span> {approval.details}
        </div>
        {approval.outputPreview && (
          <div className="mb-2">
            <span className="font-semibold">Output Preview:</span>
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 mt-1 text-xs max-h-40 overflow-auto">{approval.outputPreview}</div>
          </div>
        )}
        {showRevision ? (
          <form
            className="mt-4"
            onSubmit={e => {
              e.preventDefault();
              if (!revisionComment.trim()) {
                setError('Revision comment is required.');
                return;
              }
              setError('');
              onRequestRevisions(approval, revisionComment);
            }}
          >
            <label className="block font-medium mb-1" htmlFor="revision-comment">Revision Comment <span className="text-red-500">*</span></label>
            <textarea
              id="revision-comment"
              className="w-full rounded px-3 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400"
              value={revisionComment}
              onChange={e => setRevisionComment(e.target.value)}
              rows={3}
              required
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition">Submit Revision</button>
              <button type="button" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition" onClick={()=>setShowRevision(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="flex gap-2 mt-6">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
              onClick={() => onApprove(approval)}
              disabled={approval.status !== 'Pending'}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
              onClick={() => onReject(approval)}
              disabled={approval.status !== 'Pending'}
            >
              Reject
            </button>
            <button
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition"
              onClick={() => setShowRevision(true)}
              disabled={approval.status !== 'Pending'}
            >
              Request Revisions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalDetailsModal; 
