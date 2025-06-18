import '../assets/styles/aboutMe.css';
import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactMe = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

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
        alert('Your message was sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((error) => {
        alert('An error occurred. Please try again.');
        console.error('Email send error:', error);
      });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
          I'd love to hear from you! Whether you're interested in purchasing artwork,
          commissioning a piece, or just want to say hello.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-card p-8 rounded-lg border border-border" style={{ borderColor: '#e5e7eb24' }}>
          <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderColor: '#e5e7eb24' }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ borderColor: '#e5e7eb24' }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ borderColor: '#e5e7eb24' }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option className='text-black' value="">Select a subject</option>
                <option className='text-black' value="purchase">Purchase Inquiry</option>
                <option className='text-black' value="commission">Commission Request</option>
                <option className='text-black' value="exhibition">Exhibition Opportunity</option>
                <option className='text-black' value="general">General Question</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                style={{ borderColor: '#e5e7eb24' }}
                className="w-full px-4 py-2 border border-input rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                placeholder="Tell me about your interest in my artwork or any questions you have..."
              />
            </div>

            <button
              type="submit"
              className="w-full text-black bg-white inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-card bg-red-500/25 p-8 rounded-lg border-border">
            <h3 className="text-xl font-bold text-white mb-4">Commission Work</h3>
            <p className="text-muted-foreground mb-4" style={{ color: '#94a3b8' }}>
              I accept custom commissions for paintings, portraits, and special projects.
              Each piece is created with careful attention to your vision and preferences.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2" style={{ color: '#94a3b8' }}>
              <li>• Initial consultation to discuss your vision</li>
              <li>• Sketch approval process</li>
              <li>• Progress updates throughout creation</li>
              <li>• Professional framing options available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;