import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useLocation } from 'react-router-dom';
import { useCustomToast } from '../components/ui/toast-context';

const ContactMe = () => {
  const location = useLocation();
  const showToast = useCustomToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: location.state?.subject || '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .send(
        'service_tb170xp',    // örn: service_gmail
        'template_6rez0q9',   // örn: template_contact
        {
          name: formData.name,
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'HPGdH6pTAslP_R5k0'     // örn: xYzAbC123456
      )
      .then(() => {
        showToast({ type: "success", message: 'Your message was sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((error) => {
        showToast({ type: "error", message: 'An error occurred. Please try again.' });
        console.error('Email send error:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses = "w-full px-4 py-3 border border-primary/30 rounded-lg bg-background-dark text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center my-12 tracking-wide">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Get in Touch</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-sans">
          I'd love to hear from you! Whether you're interested in purchasing artwork,
          commissioning a piece, or just want to say hello.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-primary/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 font-serif tracking-wide">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              {location.state?.subject && !formData.subject.includes(location.state.subject) ? (
                 <input 
                   type="text"
                   name="subject"
                   value={formData.subject}
                   onChange={handleChange}
                   required
                   className={inputClasses}
                 />
              ) : (
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                >
                  <option className='bg-[#121212]' value="">Select a subject</option>
                  <option className='bg-[#121212]' value="Purchase Inquiry">Purchase Inquiry</option>
                  <option className='bg-[#121212]' value="Commission Request">Commission Request</option>
                  <option className='bg-[#121212]' value="Exhibition Opportunity">Exhibition Opportunity</option>
                  <option className='bg-[#121212]' value="General Question">General Question</option>
                  {location.state?.subject && (
                    <option className='bg-[#121212]' value={location.state.subject}>{location.state.subject}</option>
                  )}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={inputClasses + " resize-y"}
                placeholder="Tell me about your interest in my artwork or any questions you have..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8 flex items-center">
          <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-primary/20 shadow-xl w-full">
            <h3 className="text-2xl font-bold text-white mb-4 font-serif">Commission Work</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              I accept custom commissions for paintings, portraits, and special projects.
              Each piece is created with careful attention to your vision and preferences.
            </p>
            <ul className="text-gray-300 space-y-4">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Initial consultation to discuss your vision</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Sketch approval process</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Progress updates throughout creation</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Professional framing options available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;