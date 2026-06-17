import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaShieldAlt, FaChartLine, FaLock, FaGlobe, FaCheckCircle, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import { socialMediaUtils } from '../utils/socialMediaIntegration';

const ClientOnboarding = ({ onClientCreated, onClose }) => {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    socialMediaGoals: [],
    preferredPlatforms: [],
    serviceTier: 'basic',
    privacyPreferences: 'public_only',
    referralSource: ''
  });

  const [onboardingResult, setOnboardingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const serviceTiers = socialMediaUtils.getServiceTiers();
  const supportedPlatforms = socialMediaUtils.getSupportedPlatforms();

  const businessTypes = [
    'E-commerce', 'Professional Services', 'Healthcare', 'Education', 
    'Technology', 'Food & Beverage', 'Fashion & Beauty', 'Real Estate',
    'Finance', 'Non-Profit', 'Entertainment', 'Other'
  ];

  const socialMediaGoals = [
    'Increase Brand Awareness', 'Generate Leads', 'Drive Website Traffic',
    'Improve Customer Engagement', 'Boost Sales', 'Build Community',
    'Establish Thought Leadership', 'Recruit Talent', 'Crisis Management'
  ];

  const referralSources = [
    'Website', 'Landing Page', 'Social Media Ad', 'Google Ad', 'Word of Mouth',
    'Referral Program', 'Industry Event', 'Cold Outreach', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setClientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setClientData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleOnboarding = async () => {
    setLoading(true);
    try {
      const result = await socialMediaUtils.onboardClient(clientData);
      setOnboardingResult(result);
      setStep(6); // Show results
      if (onClientCreated) {
        onClientCreated(result);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaUserPlus className="text-4xl text-cyan-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Welcome to TrendyAI Social Media Management</h2>
        <p className="text-cyan-600">Let's get started with your social media success journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-cyan-700 mb-2">Business Name *</label>
          <input
            type="text"
            value={clientData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
            placeholder="Enter your business name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyan-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={clientData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyan-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={clientData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-cyan-700 mb-2">Business Type *</label>
          <select
            value={clientData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
            className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Select business type</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-cyan-700 mb-2">How did you hear about us? *</label>
          <select
            value={clientData.referralSource}
            onChange={(e) => handleInputChange('referralSource', e.target.value)}
            className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Select referral source</option>
            {referralSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaChartLine className="text-4xl text-cyan-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Social Media Goals</h2>
        <p className="text-cyan-600">What do you want to achieve with your social media presence?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialMediaGoals.map(goal => (
          <label key={goal} className="flex items-center p-4 border-2 border-cyan-200 rounded-lg hover:border-cyan-400 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={clientData.socialMediaGoals.includes(goal)}
              onChange={(e) => handleArrayChange('socialMediaGoals', goal, e.target.checked)}
              className="mr-3 text-cyan-500 focus:ring-cyan-400"
            />
            <span className="text-navy-900">{goal}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaGlobe className="text-4xl text-cyan-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Preferred Platforms</h2>
        <p className="text-cyan-600">Which social media platforms would you like us to manage?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(supportedPlatforms).map(([key, platform]) => (
          <label key={key} className="flex items-center p-4 border-2 border-cyan-200 rounded-lg hover:border-cyan-400 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={clientData.preferredPlatforms.includes(key)}
              onChange={(e) => handleArrayChange('preferredPlatforms', key, e.target.checked)}
              className="mr-3 text-cyan-500 focus:ring-cyan-400"
            />
            <div>
              <div className="font-semibold text-navy-900">{platform.name}</div>
              <div className="text-sm text-cyan-600">{platform.features.length} features available</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaShieldAlt className="text-4xl text-cyan-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Service Tier & Privacy</h2>
        <p className="text-cyan-600">Choose the level of service that fits your needs and comfort level</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(serviceTiers).map(([key, tier]) => (
          <div
            key={key}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              clientData.serviceTier === key
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-cyan-200 hover:border-cyan-300'
            }`}
            onClick={() => handleInputChange('serviceTier', key)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy-900">{tier.name}</h3>
              {clientData.serviceTier === key && (
                <FaCheckCircle className="text-cyan-500 text-xl" />
              )}
            </div>
            
            <p className="text-cyan-600 mb-4">{tier.description}</p>
            
            <div className="space-y-2">
              {tier.features.map(feature => (
                <div key={feature} className="flex items-center text-sm text-navy-900">
                  <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-cyan-200">
              <div className="flex items-center text-sm">
                <FaLock className="text-cyan-500 mr-2" />
                <span className="text-cyan-600">
                  {tier.requiresAuth ? 'Authentication Required' : 'No Authentication Needed'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Privacy & Security</h4>
            <p className="text-blue-700 text-sm mb-2">
              We understand your privacy concerns. Here's how we handle your social media access:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>Basic Tier:</strong> We only analyze public profiles - no login required</li>
              <li>• <strong>Standard Tier:</strong> We use secure OAuth connections (you control access)</li>
              <li>• <strong>Premium Tier:</strong> We use enterprise-grade security for full management</li>
              <li>• <strong>All Tiers:</strong> Your credentials are encrypted and never stored in plain text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaCheckCircle className="text-4xl text-cyan-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Review & Confirm</h2>
        <p className="text-cyan-600">Please review your information before we proceed</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-navy-900 mb-2">Business Information</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {clientData.name}</p>
              <p><strong>Email:</strong> {clientData.email}</p>
              <p><strong>Phone:</strong> {clientData.phone || 'Not provided'}</p>
              <p><strong>Business Type:</strong> {clientData.businessType}</p>
              <p><strong>Referral Source:</strong> {clientData.referralSource}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-navy-900 mb-2">Social Media Strategy</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Goals:</strong> {clientData.socialMediaGoals.join(', ')}</p>
              <p><strong>Platforms:</strong> {clientData.preferredPlatforms.map(p => supportedPlatforms[p]?.name).join(', ')}</p>
              <p><strong>Service Tier:</strong> {serviceTiers[clientData.serviceTier]?.name}</p>
              <p><strong>Authentication:</strong> {serviceTiers[clientData.serviceTier]?.requiresAuth ? 'Required' : 'Not Required'}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-navy-900 mb-2">Next Steps</h4>
          <div className="text-sm text-cyan-600 space-y-1">
            {serviceTiers[clientData.serviceTier]?.requiresAuth ? (
              <>
                <p>• We'll schedule an initial consultation call</p>
                <p>• You'll receive secure authentication setup instructions</p>
                <p>• Our team will begin content strategy development</p>
                <p>• We'll create and schedule your first posts</p>
              </>
            ) : (
              <>
                <p>• We'll analyze your public social media profiles</p>
                <p>• You'll receive detailed content recommendations</p>
                <p>• We'll create a comprehensive content strategy</p>
                <p>• You'll get posting schedules and hashtag strategies</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Welcome to TrendyAI!</h2>
        <p className="text-cyan-600">Your onboarding is complete. Here's what happens next:</p>
      </div>

      {onboardingResult && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-4">Client ID: {onboardingResult.clientId}</h3>
            <p className="text-green-700">Your account has been successfully created. Please save this ID for future reference.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-navy-900 mb-3">Onboarding Workflow</h4>
              <div className="space-y-3">
                {onboardingResult.workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-navy-900">{step.title}</div>
                      <div className="text-sm text-cyan-600">{step.description}</div>
                      <div className="text-xs text-gray-500">Duration: {step.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-navy-900 mb-3">Next Actions</h4>
              <div className="space-y-3">
                {onboardingResult.nextSteps.map((action, index) => (
                  <div key={index} className="flex items-center p-3 bg-cyan-50 rounded-lg">
                    <FaArrowRight className="text-cyan-500 mr-3" />
                    <div>
                      <div className="font-medium text-navy-900">{action.description}</div>
                      <div className="text-sm text-cyan-600">Priority: {action.priority}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">What to Expect</h4>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• You'll receive a welcome email within 24 hours</p>
              <p>• Our team will contact you to schedule the initial consultation</p>
              <p>• We'll begin analyzing your social media presence</p>
              <p>• You'll receive your first content recommendations within 3-5 business days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return clientData.name && clientData.email && clientData.businessType && clientData.referralSource;
      case 2:
        return clientData.socialMediaGoals.length > 0;
      case 3:
        return clientData.preferredPlatforms.length > 0;
      case 4:
        return clientData.serviceTier;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 5) {
      handleOnboarding();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cyan-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-navy-900">Client Onboarding</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-cyan-600 mb-2">
              <span>Step {step} of 6</span>
              <span>{Math.round((step / 6) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-cyan-200 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-cyan-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2 border-2 border-cyan-200 text-cyan-600 rounded-lg hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <div className="flex items-center space-x-3">
              {step < 6 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || loading}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {step === 5 ? 'Complete Onboarding' : 'Next'}
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              )}

              {step === 6 && (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding; 