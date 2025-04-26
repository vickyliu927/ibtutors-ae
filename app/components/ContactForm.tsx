'use client';
import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    phone: '',
    email: '',
    details: '',
    budget: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
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
      } else {
        setStatus('error');
        setMessage('There was a problem submitting your request. Please try again.');
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
  };

  return (
    <section className="py-16 bg-blue-800">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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