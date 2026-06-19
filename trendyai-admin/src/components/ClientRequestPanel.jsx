import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaTasks, FaInfoCircle, FaRobot, FaRocket } from 'react-icons/fa';
import { useToast } from './Toast';

export default function ClientRequestPanel() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'seo',
    description: '',
    keywords: '',
    targetUrl: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      showError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate n8n workflow intake call or local backend creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess(`Campaign "${formData.name}" submitted successfully! AI Agents have been assigned.`);
      navigate('/client');
    } catch (err) {
      showError('Failed to submit campaign brief.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pt-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Request Campaign</h1>
        <p className="text-text-sub mt-1 text-sm md:text-base">Provide a brief and configure the scope. Our AI agent team will immediately begin execution.</p>
      </div>

      <div className="crm-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-text-main mb-2">
              Campaign / Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Summer Product Launch SEO"
              className="crm-input"
              disabled={submitting}
            />
          </div>

          {/* Goal Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-text-main mb-2">
              Optimization Goal
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="crm-input"
              disabled={submitting}
            >
              <option value="seo">SEO & Keywords Audit (StratoBoss & WebWiz)</option>
              <option value="content">Marketing Copy & Blog posts (ContentSmith)</option>
              <option value="design">Landing Page Wireframes & Copy (WebWiz & ContentSmith)</option>
              <option value="full">Full AI Service Stack (All 8 Agents)</option>
            </select>
          </div>

          {/* Target URL */}
          <div>
            <label htmlFor="targetUrl" className="block text-sm font-semibold text-text-main mb-2">
              Target Website URL
            </label>
            <input
              id="targetUrl"
              name="targetUrl"
              type="url"
              value={formData.targetUrl}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="crm-input"
              disabled={submitting}
            />
          </div>

          {/* Keywords */}
          <div>
            <label htmlFor="keywords" className="block text-sm font-semibold text-text-main mb-2">
              Focus Keywords / Topics
            </label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              value={formData.keywords}
              onChange={handleInputChange}
              placeholder="e.g. ai automations, marketing solutions, web flow integration"
              className="crm-input"
              disabled={submitting}
            />
            <p className="text-xs text-text-muted mt-1.5">Separate multiple keywords with commas.</p>
          </div>

          {/* Description / Brief */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-text-main mb-2">
              Campaign Brief & Target Audience <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your goals, target audience, brand tone, and any key points you want our AI writers and designers to focus on..."
              className="crm-input resize-none"
              disabled={submitting}
            />
          </div>

          {/* Agent allocation preview */}
          <div className="p-4 bg-bg-panel border border-border-main rounded-lg">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-1.5 mb-2">
              <FaRobot className="text-primary" /> Auto-Assigned AI Agents
            </h4>
            <p className="text-xs text-text-sub mb-3">Based on your optimization goal, these agents will automatically trigger:</p>
            <div className="flex flex-wrap gap-2">
              {formData.type === 'seo' && (
                <>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">StratoBoss (SEO Audit & Strategy)</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">WebWiz (Structure auditor)</span>
                </>
              )}
              {formData.type === 'content' && (
                <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">ContentSmith (Intentionally Creative Writer)</span>
              )}
              {formData.type === 'design' && (
                <>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">WebWiz (UI & Code)</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">ContentSmith (Copywriter)</span>
                </>
              )}
              {formData.type === 'full' && (
                <>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">WebWiz (Code & Dev)</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">ContentSmith (Creative Copy)</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-bg-card border border-border-main rounded text-text-main">StratoBoss (SEO Strategy)</span>
                </>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="crm-btn crm-btn-primary flex-1 sm:flex-initial"
            >
              {submitting ? 'Submitting brief...' : (
                <>
                  <FaPaperPlane /> Submit Brief
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/client')}
              disabled={submitting}
              className="crm-btn crm-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
