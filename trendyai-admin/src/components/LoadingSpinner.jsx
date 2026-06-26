import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  text = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'border-cyan-500',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${variantClasses[variant]} border-2 border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-2 text-sm text-navy-900 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-navy-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton loading component
export const SkeletonLoader = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-cyan-200 rounded mb-2"
          style={{ width: `${100 - (i * 10)}%` }}
        />
      ))}
    </div>
  );
};

// Page loading component
export const PageLoader = ({ message = 'Loading page...' }) => {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" text={message} />
      </div>
    </div>
  );
};

export default LoadingSpinner; 
