import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1e40af]">Privacy Policy</h1>
              <p className="text-slate-600 mt-2">Last updated: March 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              SkillLink ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>Personal Information:</strong> Name, email, phone number, location, profile photo, work experience, skills, and qualifications.</p>
              <p><strong>Account Information:</strong> Username, password, account type (Worker/Company), and account settings.</p>
              <p><strong>Usage Data:</strong> Pages visited, time spent, clicks, searches, and interactions with the platform.</p>
              <p><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</p>
              <p><strong>Communication Data:</strong> Messages, ratings, reviews, and feedback you provide.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-2 text-slate-700 list-disc list-inside">
              <li>To create and maintain your account</li>
              <li>To match workers with job opportunities</li>
              <li>To process applications and job postings</li>
              <li>To send notifications and updates</li>
              <li>To improve our platform and services</li>
              <li>To comply with legal obligations</li>
              <li>To prevent fraud and ensure security</li>
              <li>To analyze platform usage and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">4. Data Sharing</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>With Other Users:</strong> Your profile information is visible to other users based on your privacy settings.</p>
              <p><strong>Service Providers:</strong> We may share data with third-party services (email, analytics, hosting) that help us operate the platform.</p>
              <p><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</p>
              <p><strong>No Sale of Data:</strong> We do not sell your personal information to third parties.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">5. Data Security</h2>
            <p className="text-slate-700">
              We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">6. Your Rights</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>Access:</strong> You can request access to your personal data.</p>
              <p><strong>Correction:</strong> You can update or correct your information.</p>
              <p><strong>Deletion:</strong> You can request deletion of your account and data.</p>
              <p><strong>Opt-out:</strong> You can opt-out of marketing communications.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">7. Cookies</h2>
            <p className="text-slate-700">
              We use cookies to enhance your experience. You can control cookie settings in your browser. Disabling cookies may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">8. Third-Party Links</h2>
            <p className="text-slate-700">
              Our platform may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">9. Children's Privacy</h2>
            <p className="text-slate-700">
              SkillLink is not intended for users under 18 years old. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">10. Policy Changes</h2>
            <p className="text-slate-700">
              We may update this Privacy Policy. Changes will be posted on this page with an updated date. Your continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">11. Contact Us</h2>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p className="text-slate-700">
                For privacy concerns, contact us at:<br />
                <strong>Email:</strong> privacy@skilllink.com<br />
                <strong>Address:</strong> SkillLink, India
              </p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
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

export default PrivacyPolicy;
