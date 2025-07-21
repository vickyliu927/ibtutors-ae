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
    <section className="py-16 flex justify-center items-center min-h-screen bg-gray-50">
      <div className="relative rounded-[20px] bg-primary overflow-hidden max-w-[1056px] w-full mx-4">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          {/* Background SVG Lines */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1056 927" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1079.2 -79.7461L22.7704 793.785C8.98548 805.183 1.00488 822.137 1.00488 840.025V1140.85" stroke="white" strokeWidth="1" opacity="0.3"/>
            <path d="M961.324 0.662109L1.12402 795.404" stroke="white" strokeWidth="1" opacity="0.3"/>
            <path d="M941.087 0.404297L0.938477 758.001" stroke="white" strokeWidth="1" opacity="0.3"/>
            <path d="M366.085 -95.9531L24.2694 163.946C9.3468 175.292 0.584961 192.961 0.584961 211.708V561.133" stroke="white" strokeWidth="1" opacity="0.3"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 lg:p-16">
          {/* Header Text */}
          <div className="text-center mb-12">
            <h2 className="font-gilroy text-4xl lg:text-5xl font-medium leading-[120%] text-white mb-4">
              Hire a tutor
            </h2>
            <p className="font-gilroy text-base leading-[160%] text-white max-w-4xl mx-auto" style={{ fontWeight: 200 }}>
              Please fill out the form and an academic consultant from{' '}
              <span className="underline">TutorChase</span> will find a tutor for you
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-[20px] p-8 max-w-[773px] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row - Full Name and Country */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label htmlFor="fullName" className="block font-gilroy text-base font-normal text-textDark">
                    Full name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name here"
                    className="w-full h-12 px-4 py-2 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <label htmlFor="country" className="block font-gilroy text-base font-normal text-textDark">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter your country here"
                    className="w-full h-12 px-4 py-2 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600">{errors.country}</p>
                  )}
                </div>
              </div>

              {/* Second Row - Phone and Email */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label htmlFor="phone" className="block font-gilroy text-base font-normal text-textDark">
                    Your phone (with country code) *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone here"
                    className="w-full h-12 px-4 py-2 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <label htmlFor="email" className="block font-gilroy text-base font-normal text-textDark">
                    Your email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email here"
                    className="w-full h-12 px-4 py-2 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Details Textarea */}
              <div className="space-y-2">
                <label htmlFor="details" className="block font-gilroy text-base font-normal text-textDark">
                  Details of tutoring request (e.g. exams, subjects, how long for etc.) *
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={6}
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Enter details"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                {errors.details && (
                  <p className="text-sm text-red-600">{errors.details}</p>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label htmlFor="budget" className="block font-gilroy text-base font-normal text-textDark">
                  Hourly budget (including currency) *
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  required
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter your budget here"
                  className="w-full h-12 px-4 py-2 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.budget && (
                  <p className="text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full h-12 bg-primary text-white font-gilroy text-base font-semibold rounded-[28px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit'}
              </button>
              
              {message && (
                <p className={`text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
