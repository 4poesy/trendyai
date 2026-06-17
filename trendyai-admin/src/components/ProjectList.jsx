import React from 'react';

// ProjectList: Lists all projects with search/filter and click-to-view
const ProjectList = ({ projects, onSelect, onAdd }) => {
  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-500">Projects</h2>
        <button
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition"
          onClick={onAdd}
          aria-label="Add Project"
        >
          + Add Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-lg rounded-xl p-4 shadow-lg cursor-pointer hover:ring-2 hover:ring-cyan-400 transition"
            onClick={() => onSelect(project)}
            tabIndex={0}
            role="button"
            aria-label={`View details for project ${project.name}`}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(project)}
          >
            <h3 className="font-semibold text-lg mb-1 text-cyan-700 dark:text-cyan-300">{project.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-cyan-100 dark:bg-cyan-900/40 px-2 py-1 rounded">Status: {project.status}</span>
              <span className="bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">Progress: {project.progress}%</span>
              <span className="bg-gray-100 dark:bg-gray-800/40 px-2 py-1 rounded">Client: {project.clientName}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectList; 