'use client';
import React, { useState } from 'react';
import DOMPurify from 'dompurify';

type ValidationError = {
  [key: string]: string;
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    phone: '',
    email: '',
    details: '',
    budget: ''
  });

  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [message, setMessage] = useState('');
  
  // Basic validation function
  const validateForm = () => {
    const newErrors: ValidationError = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Name is too long';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.details.trim()) {
      newErrors.details = 'Details are required';
    } else if (formData.details.length < 10) {
      newErrors.details = 'Please provide more details';
    }
    
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous status and errors
    setStatus('idle');
    setMessage('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setStatus('loading');
    
    try {
      // Sanitize all form inputs before sending to API
      const sanitizedData = {
        fullName: DOMPurify.sanitize(formData.fullName.trim()),
        country: DOMPurify.sanitize(formData.country.trim()),
        phone: DOMPurify.sanitize(formData.phone.trim()),
        email: DOMPurify.sanitize(formData.email.trim()),
        details: DOMPurify.sanitize(formData.details.trim()),
        budget: DOMPurify.sanitize(formData.budget.trim())
      };
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Thank you! Your request has been submitted.');
        setFormData({
          fullName: '',
          country: '',
          phone: '',
          email: '',
          details: '',
          budget: '',
        });
        setErrors({});
      } else {
        setStatus('error');
        
        // Check for validation errors from server
        if (response.status === 400 && data.details) {
          const serverErrors: ValidationError = {};
          Object.entries(data.details).forEach(([field, error]: [string, any]) => {
            if (error._errors && error._errors.length > 0) {
              serverErrors[field] = error._errors[0];
            }
          });
          setErrors(serverErrors);
          setMessage('Please correct the errors in the form.');
        } else {
          setMessage('There was a problem submitting your request. Please try again.');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('There was a problem submitting your request. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <section id="contact-form" className="py-16 bg-blue-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Hire a tutor</h2>
          <p className="text-blue-100 mt-2">
            Please fill out the form and an academic consultant from{' '}
            <span className="underline">TutorChase</span> will find a tutor for you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Your phone (with country code)<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">
              Details of tutoring request (e.g. exams, subjects, how long for etc.)<span className="text-red-500">*</span>
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              required
              value={formData.details}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.details ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.details && (
              <p className="mt-1 text-sm text-red-600">{errors.details}</p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Hourly budget (including currency)<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              required
              value={formData.budget}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
            )}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-900 transition-colors"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting...' : 'SUBMIT'}
            </button>
            {message && (
              <p className={`mt-4 text-center ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm; 