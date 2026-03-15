import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#1e40af] mb-2">Contact & Support</h1>
            <p className="text-lg text-slate-600">We're here to help. Get in touch with us anytime.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Get in Touch</h2>
              
              {/* Email */}
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#1e40af]" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">support@skilllink.com</p>
                  <p className="text-sm text-slate-500">We respond within 24 hours</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                  <p className="text-slate-600">+91-XXXXXXXXXX</p>
                  <p className="text-sm text-slate-500">Monday - Friday, 9 AM - 6 PM IST</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                  <p className="text-slate-600">SkillLink Headquarters</p>
                  <p className="text-sm text-slate-500">India</p>
                </div>
              </div>
            </div>

            {/* Support Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Support Categories</h2>
              <div className="space-y-3">
                {[
                  { emoji: '👤', title: 'Account Issues', desc: 'Login, password, profile' },
                  { emoji: '💼', title: 'Job Related', desc: 'Applications, postings' },
                  { emoji: '⭐', title: 'Ratings & Reviews', desc: 'Disputes, feedback' },
                  { emoji: '🔒', title: 'Security', desc: 'Account safety, privacy' }
                ].map((cat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{cat.title}</p>
                      <p className="text-sm text-slate-600">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Send us a Message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">Message Sent!</h3>
                <p className="text-green-600">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">Quick Answers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'How do I create a profile?', a: 'Visit the home page and click "Create Profile" to get started.' },
              { q: 'How do I apply for jobs?', a: 'Browse available jobs and click "Apply" to submit your application.' },
              { q: 'How are workers rated?', a: 'Companies rate workers after job completion based on quality and professionalism.' },
              { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption and security measures.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-900 mb-2">❓ {item.q}</p>
                <p className="text-sm text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              View Full FAQ →
            </Link>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
