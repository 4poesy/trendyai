import React, { useState } from 'react';
import { FaProjectDiagram, FaUser, FaCalendar, FaClock, FaPlus, FaEdit, FaTrash, FaCheck, FaPause, FaPlay, FaTimes, FaSave } from 'react-icons/fa';
import { useToast } from './Toast';

const ProjectsPage = () => {
  const { showSuccess, showError } = useToast();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Social Media Campaign',
      owner: 'Acme Corporation',
      status: 'Active',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      description: 'Comprehensive social media marketing campaign for Q1',
      budget: '$15,000',
      team: ['Content Creator', 'Designer', 'Analyst']
    },
    {
      id: 2,
      name: 'Website Redesign',
      owner: 'TechStart Solutions',
      status: 'In Progress',
      progress: 45,
      startDate: '2024-02-01',
      endDate: '2024-04-30',
      description: 'Complete website redesign with modern UI/UX',
      budget: '$25,000',
      team: ['UI Designer', 'Developer', 'QA Tester']
    },
    {
      id: 3,
      name: 'Email Marketing Automation',
      owner: 'Global Innovations',
      status: 'Completed',
      progress: 100,
      startDate: '2024-01-01',
      endDate: '2024-02-28',
      description: 'Automated email marketing system implementation',
      budget: '$8,000',
      team: ['Marketing Specialist', 'Developer']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    owner: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: ''
  });

  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectData, setEditProjectData] = useState({ name: '', owner: '', description: '', budget: '', startDate: '', endDate: '' });

  const addProject = () => {
    if (newProject.name && newProject.owner) {
      const project = {
        id: projects.length + 1,
        ...newProject,
        status: 'In Progress',
        progress: 0,
        team: ['Project Manager']
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', owner: '', description: '', budget: '', startDate: '', endDate: '' });
      setShowAddForm(false);
      showSuccess(`Project "${project.name}" created!`);
    } else {
      showError('Please fill out Project Name and Client Owner.');
    }
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
    showSuccess('Project deleted.');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'badge-info';
      case 'In Progress': return 'badge-warning';
      case 'Completed': return 'badge-success';
      case 'Paused': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const startEditProject = (project) => {
    setEditProjectId(project.id);
    setEditProjectData({
      name: project.name,
      owner: project.owner,
      description: project.description,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate
    });
  };

  const saveEditProject = () => {
    setProjects(projects.map(project =>
      project.id === editProjectId ? { ...project, ...editProjectData } : project
    ));
    setEditProjectId(null);
    showSuccess('Project details updated.');
  };

  const cancelEditProject = () => {
    setEditProjectId(null);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-main pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Campaigns & Projects</h1>
          <p className="text-text-sub mt-1 text-sm md:text-base">Orchestrate active marketing copy edits, SEO tasks, and site layouts.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="crm-btn crm-btn-primary"
        >
          <FaPlus /> Create Campaign
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <div className="crm-card">
          <h2 className="text-xl font-bold text-text-main mb-4">Create New Campaign</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-sub mb-2">Campaign Title</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="crm-input"
                placeholder="e.g. Q3 SEO Optimization"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-sub mb-2">Client Account</label>
              <input
                type="text"
                value={newProject.owner}
                onChange={(e) => setNewProject({...newProject, owner: e.target.value})}
                className="crm-input"
                placeholder="e.g. Acme Corporation"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-sub mb-2">Budget Allocation</label>
              <input
                type="text"
                value={newProject.budget}
                onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                className="crm-input"
                placeholder="$10,000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-sub mb-2">Start Date</label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                className="crm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-sub mb-2">Target End Date</label>
              <input
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                className="crm-input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-sub mb-2">Target Brief / Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="crm-input"
                rows="3"
                placeholder="Details of the marketing project..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={addProject}
              className="crm-btn crm-btn-primary"
            >
              Save Campaign
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="crm-btn crm-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {projects.map((project) => (
          <div key={project.id} className="crm-card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary-light border border-primary/10 flex items-center justify-center text-primary text-lg">
                    <FaProjectDiagram />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-main">{project.name}</h3>
                    <p className="text-xs text-text-sub font-semibold mt-0.5">{project.owner}</p>
                  </div>
                </div>
                <span className={`badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {editProjectId === project.id ? (
                <div className="p-4 bg-bg-panel border border-border-main rounded-lg space-y-3 mb-4">
                  <input
                    type="text"
                    value={editProjectData.name}
                    onChange={e => setEditProjectData({ ...editProjectData, name: e.target.value })}
                    className="crm-input text-xs"
                    placeholder="Project Name"
                  />
                  <input
                    type="text"
                    value={editProjectData.owner}
                    onChange={e => setEditProjectData({ ...editProjectData, owner: e.target.value })}
                    className="crm-input text-xs"
                    placeholder="Owner"
                  />
                  <textarea
                    value={editProjectData.description}
                    onChange={e => setEditProjectData({ ...editProjectData, description: e.target.value })}
                    className="crm-input text-xs"
                    rows="2"
                    placeholder="Description"
                  />
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEditProject} className="crm-btn crm-btn-primary py-1 px-3 text-xs"><FaSave /> Save</button>
                    <button onClick={cancelEditProject} className="crm-btn crm-btn-secondary py-1 px-3 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-text-sub text-sm mb-5 leading-relaxed">
                  {project.description}
                </p>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                  <span className="text-text-sub">Task Completion</span>
                  <span className="text-primary">{project.progress}%</span>
                </div>
                <div className="w-full bg-bg-panel border border-border-main rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Details Meta Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-xs text-text-sub font-semibold">
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-text-muted" />
                  <span>Start: {project.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-text-muted" />
                  <span>End: {project.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-text-muted" />
                  <span>Budget: {project.budget}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <FaUser className="text-text-muted" />
                  <span className="truncate">Staff: {project.team && project.team.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {editProjectId !== project.id && (
              <div className="flex justify-end gap-2 border-t border-border-main pt-4 mt-2">
                <button 
                  onClick={() => startEditProject(project)}
                  className="crm-btn crm-btn-secondary py-1.5 px-3 text-xs"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="crm-btn crm-btn-danger py-1.5 px-3 text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-base font-semibold">No active campaigns. Press the Create button to launch one.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
