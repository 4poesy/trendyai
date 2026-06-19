import React, { useState } from 'react';
import { FaRobot, FaCheckCircle, FaSpinner, FaClock, FaClipboardList, FaFileSignature } from 'react-icons/fa';

export default function ClientProjectTracker() {
  const [selectedCampaign, setSelectedCampaign] = useState(1);

  // Mock campaigns with multi-agent pipeline states
  const campaigns = [
    {
      id: 1,
      name: 'SaaS Launch SEO',
      description: 'Optimize landing page copy, conduct keyword analysis, and auto-verify meta-tags.',
      created: 'June 10, 2026',
      status: 'In Progress',
      pipeline: [
        { step: 'Intake / Briefing', status: 'completed', agent: 'Client', details: 'Brief submitted with 12 focus keywords.' },
        { step: 'WebWiz (UI & Structure)', status: 'completed', agent: 'WebWiz Agent', details: 'Analyzed H1 tags, layout hierarchy, and internal link structure.' },
        { step: 'ContentSmith (Content Draft)', status: 'active', agent: 'ContentSmith Agent', details: 'Writing optimized blog post based on high-intent keywords.' },
        { step: 'StratoBoss (SEO Audit)', status: 'pending', agent: 'StratoBoss Agent', details: 'Will run Google Core Web Vitals checks and verify keyword density.' },
        { step: 'Client Review', status: 'pending', agent: 'Client', details: 'Final review and sign-off.' }
      ]
    },
    {
      id: 2,
      name: 'Social Lead Campaign',
      description: 'Create high-converting social copy and verify layout metrics for advertising.',
      created: 'June 15, 2026',
      status: 'Reviewing',
      pipeline: [
        { step: 'Intake / Briefing', status: 'completed', agent: 'Client', details: 'Brief submitted for 3 ad variants.' },
        { step: 'WebWiz (UI & Structure)', status: 'completed', agent: 'WebWiz Agent', details: 'Generated visual layout grid & verified image dimensions.' },
        { step: 'ContentSmith (Content Draft)', status: 'completed', agent: 'ContentSmith Agent', details: 'Generated ad copies and call-to-actions.' },
        { step: 'StratoBoss (SEO Audit)', status: 'completed', agent: 'StratoBoss Agent', details: 'Verified social tags and link redirects.' },
        { step: 'Client Review', status: 'active', agent: 'Client', details: 'Awaiting client feedback in the Deliverables tab.' }
      ]
    }
  ];

  const activeCampaign = campaigns.find(c => c.id === selectedCampaign) || campaigns[0];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main">Campaign Tracker</h1>
        <p className="text-text-sub mt-1 text-sm md:text-base">Track your campaign progress through the AI agent pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign List */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub mb-2">Campaigns</h3>
          {campaigns.map(camp => (
            <button
              key={camp.id}
              onClick={() => setSelectedCampaign(camp.id)}
              className={`w-full text-left p-7 rounded-xl border transition-all text-sm block ${
                selectedCampaign === camp.id
                  ? 'border-primary bg-bg-card shadow-sm ring-1 ring-primary'
                  : 'border-border-main bg-bg-panel hover:bg-bg-card'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-text-main text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>{camp.name}</span>
                <span className={`badge ${camp.status === 'Reviewing' ? 'badge-warning' : 'badge-info'}`}>
                  {camp.status}
                </span>
              </div>
              <p className="text-text-sub text-xs mt-2.5 line-clamp-2 leading-relaxed">{camp.description}</p>
              <div className="text-xs text-text-muted mt-4">Started {camp.created}</div>
            </button>
          ))}
        </div>

        {/* Pipeline Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="crm-card">
            <h2 className="text-xl font-bold text-text-main mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{activeCampaign.name}</h2>
            <p className="text-sm text-text-sub mb-6">{activeCampaign.description}</p>

            <div className="relative border-l border-border-main ml-4 md:ml-6 space-y-8 py-2">
              {activeCampaign.pipeline.map((step, idx) => (
                <div key={idx} className="relative pl-8 md:pl-10">
                  {/* Status Indicator Icon */}
                  <div className="absolute -left-[13px] md:-left-[15px] top-1.5 flex items-center justify-center">
                    {step.status === 'completed' ? (
                      <span className="bg-bg-card text-green-500 rounded-full border-2 border-green-500 p-0.5 z-10">
                        <FaCheckCircle size={16} />
                      </span>
                    ) : step.status === 'active' ? (
                      <span className="bg-bg-card text-primary rounded-full border-2 border-primary p-0.5 z-10 animate-pulse">
                        <FaSpinner size={16} className="animate-spin" />
                      </span>
                    ) : (
                      <span className="bg-bg-card text-text-muted rounded-full border-2 border-border-main p-0.5 z-10">
                        <FaClock size={16} />
                      </span>
                    )}
                  </div>

                  {/* Step details card */}
                  <div className={`p-5 md:p-6 rounded-lg border transition-all ${
                    step.status === 'active' 
                      ? 'border-primary bg-bg-card' 
                      : 'border-border-main bg-bg-panel'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="font-bold text-text-main text-sm md:text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>{step.step}</h4>
                      <span className="inline-flex items-center gap-1 text-xs text-text-sub bg-bg-card border border-border-main px-2.5 py-0.5 rounded">
                        <FaRobot className="text-primary" /> {step.agent}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-text-sub leading-relaxed">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
