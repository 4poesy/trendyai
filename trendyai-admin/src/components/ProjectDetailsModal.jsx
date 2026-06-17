import React from 'react';

const ProjectDetailsModal = ({ project, client, onEdit, onDelete, onClose }) => {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-cyan-500 text-2xl"
          onClick={onClose}
          aria-label="Close project details"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-cyan-600 mb-2">{project.name}</h2>
        <p className="mb-2 text-gray-700 dark:text-gray-200">{project.description}</p>
        <div className="mb-2">
          <span className="font-semibold">Client:</span> {client ? `${client.name} (${client.email})` : project.clientId}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Assigned Agent/Group:</span> {project.agent}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Status:</span> {project.status}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Progress:</span> {project.progress}%
        </div>
        <div className="mb-2">
          <span className="font-semibold">Deadline:</span> {project.deadline || '—'}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Created:</span> {project.createdAt}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Last Updated:</span> {project.updatedAt}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition"
            onClick={() => onEdit(project)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            onClick={() => onDelete(project)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal; 