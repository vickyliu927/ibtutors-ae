'use client';
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getContactFormData, type ContactFormData } from '../lib/getContactFormData';

type ValidationError = {
  [key: string]: string;
};

const ContactForm = () => {
  const router = useRouter();
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
  const [contentData, setContentData] = useState<ContactFormData | null>(null);

  // Fetch contact form content data
  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const data = await getContactFormData();
        setContentData(data);
      } catch (error) {
        console.error('Error fetching contact form content:', error);
      }
    };

    fetchContentData();
  }, []);

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
        setMessage(contentData?.successModal.title || 'Thank you! Your request has been submitted.');
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
          setMessage(contentData?.errorMessages.validationError || 'Please correct the errors in the form.');
        } else {
        setMessage(contentData?.errorMessages.genericError || 'There was a problem submitting your request. Please try again.');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage(contentData?.errorMessages.genericError || 'There was a problem submitting your request. Please try again.');
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

  const handleReturnHome = () => {
    closeSuccessModal();
    router.push(contentData?.successModal.secondaryButtonLink || '/');
  };

  const handleViewResources = () => {
    closeSuccessModal();
    router.push(contentData?.successModal.primaryButtonLink || '/');
  };

  const closeSuccessModal = () => {
    setStatus('idle');
    setMessage('');
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-[0px_40px_60px_0px_rgba(0,14,81,0.05)] max-w-[800px] w-full max-h-[90vh] overflow-auto">
        <div className="flex flex-col items-center gap-10 py-10 px-8 md:px-20">
          {/* Check Icon */}
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full absolute inset-0" style={{ backgroundColor: 'rgba(245, 124, 64, 0.20)' }}></div>
            <div className="w-8 h-8 absolute top-4 left-4">
              <Check className="w-8 h-8" style={{ color: '#F57C40' }} strokeWidth={3} />
            </div>
          </div>

          {/* Headlines */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-gilroy text-2xl md:text-4xl font-normal leading-[140%] text-textDark text-center">
              {contentData?.successModal.title.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < contentData.successModal.title.replace(/\\n/g, '\n').split('\n').length - 1 && <br />}
                </React.Fragment>
              )) || 'Thank you for your Enquiry'}
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-[680px] text-textDark text-center font-gilroy text-lg md:text-xl font-light leading-[150%]">
            {contentData?.successModal.description || 'You can additionally message on WhatsApp now with one of our academic consultants to discuss your tutoring requirements in more detail'}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleViewResources}
              className="flex h-12 px-[52px] justify-center items-center rounded-[28px] bg-primary text-white font-gilroy text-base font-normal leading-[140%] hover:bg-blue-800 transition-colors"
            >
              {contentData?.successModal.primaryButtonText || 'View Study Resources'}
            </button>
            <button
              onClick={handleReturnHome}
              className="flex h-12 px-[52px] justify-center items-center rounded-[28px] bg-greyBorder text-textDark font-gilroy text-base font-normal leading-[140%] hover:bg-gray-300 transition-colors"
            >
              {contentData?.successModal.secondaryButtonText || 'Return Home'}
            </button>
          </div>

          {/* Footer Text */}
          <p className="self-stretch text-textDark text-center font-gilroy text-lg md:text-xl font-light leading-[150%]">
            {contentData?.successModal.footerText || 'Please also check your junk email folder if you have not heard from us'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Success Modal */}
      {status === 'success' && <SuccessModal />}

      <section id="contact-form" className="py-0 md:py-16 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="relative rounded-none md:rounded-[20px] bg-primary overflow-hidden max-w-[1056px] w-full md:mx-4 min-h-screen md:min-h-0">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        {/* Background SVG Lines - Desktop */}
        <svg className="hidden md:block absolute top-0 left-0 w-full h-full" viewBox="0 0 1056 927" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1079.2 -79.7461L22.7704 793.785C8.98548 805.183 1.00488 822.137 1.00488 840.025V1140.85" stroke="white" strokeWidth="1" opacity="0.3"/>
          <path d="M961.324 0.662109L1.12402 795.404" stroke="white" strokeWidth="1" opacity="0.3"/>
          <path d="M941.087 0.404297L0.938477 758.001" stroke="white" strokeWidth="1" opacity="0.3"/>
          <path d="M366.085 -95.9531L24.2694 163.946C9.3468 175.292 0.584961 192.961 0.584961 211.708V561.133" stroke="white" strokeWidth="1" opacity="0.3"/>
        </svg>

        {/* Background SVG Lines - Mobile */}
        <svg className="md:hidden absolute top-0 left-0 w-full h-full" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <path d="M420 -50L-30 650C-35 665 -40 680 -40 695V900" stroke="white" strokeWidth="1" opacity="0.25"/>
          <path d="M375 0L-15 600" stroke="white" strokeWidth="1" opacity="0.25"/>
          <path d="M350 10L5 580" stroke="white" strokeWidth="1" opacity="0.25"/>
          <path d="M160 -80L15 140C8 155 0 170 0 185V450" stroke="white" strokeWidth="1" opacity="0.25"/>
          <path d="M400 120L80 750" stroke="white" strokeWidth="1" opacity="0.28"/>
          <path d="M320 80L40 680" stroke="white" strokeWidth="1" opacity="0.22"/>
          <path d="M-20 200L300 812" stroke="white" strokeWidth="1" opacity="0.2"/>
        </svg>
      </div>

        {/* Content */}
        <div className="relative z-10 pt-16 px-4 pb-8 lg:pt-20 lg:px-8 lg:pb-8">
      {/* Header Text */}
          <div className="text-center mb-12">
            <h2 className="font-gilroy text-4xl lg:text-5xl font-medium leading-[120%] text-white mb-4">
          {contentData?.formHeader || 'Hire a tutor'}
        </h2>
            <p className="font-gilroy text-base leading-[160%] text-white max-w-4xl mx-auto" style={{ fontWeight: 200 }}>
          {contentData?.formSubtitle || 'Please fill out the form and an academic consultant from'}{' '}
          {contentData?.formSubtitle ? null : (
            <span className="underline">{contentData?.companyName || 'TutorChase'}</span>
          )}
          {contentData?.formSubtitle ? null : ' will find a tutor for you'}
        </p>
      </div>

      {/* Form Container */}
          <div className="bg-white rounded-[20px] p-4 lg:p-6 max-w-[773px] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row - Full Name and Country - Responsive Layout */}
              <div className="flex flex-col md:flex-row gap-4">
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

          {/* Second Row - Phone and Email - Responsive Layout */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <label htmlFor="phone" className="block font-gilroy text-base font-normal text-textDark">
                {contentData?.formFields.phoneLabel || 'Your phone (with country code - e.g. +44) *'}
              </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={contentData?.formFields.phonePlaceholder || "Enter your phone here"}
                    className="w-full h-12 px-4 py-2 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

                <div className="flex-1 space-y-2">
                  <label htmlFor="email" className="block font-gilroy text-base font-normal text-textDark">
                {contentData?.formFields.emailLabel || 'Your email *'}
              </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={contentData?.formFields.emailPlaceholder || "Enter your email here"}
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
              {contentData?.formFields.detailsLabel || 'Details of tutoring request (e.g. exams, subjects, how long for etc.) *'}
            </label>
              <textarea
                id="details"
                name="details"
                required
                  rows={6}
                value={formData.details}
                onChange={handleChange}
                placeholder={contentData?.formFields.detailsPlaceholder || "Enter details"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            {errors.details && (
                  <p className="text-sm text-red-600">{errors.details}</p>
            )}
          </div>

          {/* Budget */}
              <div className="space-y-2">
                <label htmlFor="budget" className="block font-gilroy text-base font-normal text-textDark">
              {contentData?.formFields.budgetLabel || 'Hourly budget (including currency) *'}
            </label>
              <input
                type="text"
                id="budget"
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                placeholder={contentData?.formFields.budgetPlaceholder || "Enter your budget here"}
                  className="w-full h-12 px-4 py-2 border border-gray-300 rounded-xl font-gilroy text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            {errors.budget && (
                  <p className="text-sm text-red-600">{errors.budget}</p>
            )}
          </div>

          {/* Submit Button - Enhanced Mobile Design */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full md:w-full max-w-sm md:max-w-full h-14 md:h-12 bg-primary text-white font-gilroy text-lg md:text-base font-semibold rounded-[28px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {status === 'loading' ? (contentData?.submittingText || 'Submitting...') : (contentData?.submitButtonText || 'Submit')}
            </button>
          </div>

          {status === 'error' && message && (
                <p className="text-center text-sm text-red-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
        </div>
      </section>
    </>
  );
};

export default ContactForm;
