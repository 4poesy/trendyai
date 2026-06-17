// Validation utilities for TrendyAI Admin Dashboard

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  if (email.length > 254) return 'Email is too long';
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character';
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
  if (name.length > 50) return `${fieldName} is too long`;
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return `${fieldName} contains invalid characters`;
  return null;
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return 'URL is required';
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// Company name validation
export const validateCompanyName = (name) => {
  if (!name) return 'Company name is required';
  if (name.length < 2) return 'Company name must be at least 2 characters long';
  if (name.length > 100) return 'Company name is too long';
  return null;
};

// Project description validation
export const validateDescription = (description) => {
  if (!description) return 'Description is required';
  if (description.length < 10) return 'Description must be at least 10 characters long';
  if (description.length > 1000) return 'Description is too long (max 1000 characters)';
  return null;
};

// Budget validation
export const validateBudget = (budget) => {
  if (!budget) return 'Budget is required';
  const num = parseFloat(budget);
  if (isNaN(num)) return 'Please enter a valid number';
  if (num < 0) return 'Budget cannot be negative';
  if (num > 1000000) return 'Budget is too high';
  return null;
};

// Date validation
export const validateDate = (date) => {
  if (!date) return 'Date is required';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Please enter a valid date';
  if (dateObj < new Date()) return 'Date cannot be in the past';
  return null;
};

// Rate limiting utility
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old requests
    if (this.requests.has(identifier)) {
      this.requests.set(identifier, 
        this.requests.get(identifier).filter(time => time > windowStart)
      );
    }

    const requests = this.requests.get(identifier) || [];
    
    if (requests.length >= this.maxRequests) {
      return false;
    }

    requests.push(now);
    this.requests.set(identifier, requests);
    return true;
  }

  getRemainingRequests(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (this.requests.has(identifier)) {
      const validRequests = this.requests.get(identifier).filter(time => time > windowStart);
      return Math.max(0, this.maxRequests - validRequests.length);
    }
    
    return this.maxRequests;
  }
}

// XSS prevention
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rule = validationRules[field];
    
    if (typeof rule === 'function') {
      const error = rule(value);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      for (const validator of rule) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const commonValidations = {
  email: validateEmail,
  password: validatePassword,
  firstName: (value) => validateName(value, 'First name'),
  lastName: (value) => validateName(value, 'Last name'),
  companyName: validateCompanyName,
  phone: validatePhone,
  url: validateUrl,
  description: validateDescription,
  budget: validateBudget,
  startDate: validateDate
}; 