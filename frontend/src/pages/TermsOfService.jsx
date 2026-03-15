import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1e40af]">Terms of Service</h1>
              <p className="text-slate-600 mt-2">Last updated: March 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              Welcome to SkillLink ("Platform", "we", "us", "our"). These Terms of Service ("Terms") govern your access to and use of our website, mobile application, and services (collectively, the "Service"). By accessing or using SkillLink, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you may not use our Service.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">2. User Accounts</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Account Creation:</strong> To use SkillLink, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and password.
              </p>
              <p>
                <strong>Account Responsibility:</strong> You are solely responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              <p>
                <strong>User Roles:</strong> SkillLink offers two user roles: Workers (skilled professionals) and Companies (employers). You must select the appropriate role during registration and use the Service in accordance with your role.
              </p>
              <p>
                <strong>Account Termination:</strong> We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent or illegal activity.
              </p>
            </div>
          </section>

          {/* Worker Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">3. Worker Responsibilities</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Profile Accuracy:</strong> Workers agree to provide accurate and truthful information in their profiles, including skills, experience, qualifications, and availability.
              </p>
              <p>
                <strong>Professional Conduct:</strong> Workers must maintain professional conduct when communicating with companies and during job engagements. Harassment, discrimination, or abusive behavior is strictly prohibited.
              </p>
              <p>
                <strong>Job Acceptance:</strong> When a worker accepts a job, they commit to completing the work as agreed. Cancellation without valid reason may result in account penalties.
              </p>
              <p>
                <strong>Quality of Work:</strong> Workers are responsible for delivering quality work that meets industry standards and client expectations.
              </p>
            </div>
          </section>

          {/* Company Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">4. Company Responsibilities</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Job Posting:</strong> Companies must post accurate job descriptions with clear requirements, location, and compensation details.
              </p>
              <p>
                <strong>Fair Treatment:</strong> Companies agree to treat workers fairly and respectfully. Discrimination based on race, gender, religion, or other protected characteristics is prohibited.
              </p>
              <p>
                <strong>Payment Obligations:</strong> Companies are responsible for compensating workers as agreed upon. Failure to pay may result in account suspension or legal action.
              </p>
              <p>
                <strong>Professional Communication:</strong> Companies must communicate professionally with workers and provide clear instructions for job completion.
              </p>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">5. Prohibited Activities</h2>
            <p className="text-slate-700 mb-4">Users agree not to:</p>
            <ul className="space-y-2 text-slate-700 list-disc list-inside">
              <li>Provide false or misleading information</li>
              <li>Engage in harassment, discrimination, or abusive behavior</li>
              <li>Attempt to bypass payment through the platform</li>
              <li>Share contact information to conduct transactions outside the platform</li>
              <li>Post inappropriate, offensive, or illegal content</li>
              <li>Attempt to hack, exploit, or damage the platform</li>
              <li>Engage in fraud, scams, or deceptive practices</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Spam or send unsolicited messages</li>
            </ul>
          </section>

          {/* Ratings and Reviews */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">6. Ratings and Reviews</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Honest Feedback:</strong> Users agree to provide honest, fair, and accurate ratings and reviews based on their actual experience.
              </p>
              <p>
                <strong>No Manipulation:</strong> Fake reviews, rating manipulation, or incentivized ratings are prohibited and may result in account termination.
              </p>
              <p>
                <strong>Dispute Resolution:</strong> If you believe a rating is unfair or fraudulent, you may contact our support team to file a dispute.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">7. Intellectual Property</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Platform Content:</strong> All content on SkillLink, including logos, designs, text, and graphics, is owned by SkillLink or its licensors and protected by copyright laws.
              </p>
              <p>
                <strong>User Content:</strong> By uploading content (profiles, photos, resumes), you grant SkillLink a non-exclusive license to use, display, and distribute your content on the platform.
              </p>
              <p>
                <strong>Respect for Rights:</strong> Users must not infringe on the intellectual property rights of others. Any violation may result in legal action.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">8. Limitation of Liability</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>As-Is Service:</strong> SkillLink is provided "as-is" without warranties of any kind, express or implied.
              </p>
              <p>
                <strong>No Guarantees:</strong> We do not guarantee that the platform will be error-free, uninterrupted, or secure.
              </p>
              <p>
                <strong>Limitation:</strong> To the maximum extent permitted by law, SkillLink shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.
              </p>
              <p>
                <strong>Dispute Resolution:</strong> SkillLink is not responsible for disputes between workers and companies. Users agree to resolve disputes independently or through legal channels.
              </p>
            </div>
          </section>

          {/* Payment and Fees */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">9. Payment and Fees</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Direct Transactions:</strong> Currently, SkillLink does not process payments. Workers and companies are responsible for arranging payment directly.
              </p>
              <p>
                <strong>Future Fees:</strong> SkillLink reserves the right to introduce service fees in the future. Users will be notified of any changes.
              </p>
              <p>
                <strong>Refund Policy:</strong> Refunds are handled directly between workers and companies. SkillLink is not responsible for refund disputes.
              </p>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">10. Privacy and Data Protection</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                Your use of SkillLink is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding data collection and use.
              </p>
              <p>
                We are committed to protecting your personal information and complying with applicable data protection laws.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">11. Modifications to Terms</h2>
            <p className="text-slate-700">
              SkillLink reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">12. Termination</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                <strong>Termination by User:</strong> You may terminate your account at any time by contacting our support team.
              </p>
              <p>
                <strong>Termination by SkillLink:</strong> We may terminate or suspend your account immediately if you violate these Terms or engage in illegal activity.
              </p>
              <p>
                <strong>Effect of Termination:</strong> Upon termination, your right to use the platform ceases immediately. We may retain your data as required by law.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">13. Governing Law</h2>
            <p className="text-slate-700">
              These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal action or proceeding shall be brought exclusively in the courts located in India.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">14. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p className="text-slate-700">
                <strong>Email:</strong> support@skilllink.com<br />
                <strong>Address:</strong> SkillLink, India<br />
                <strong>Phone:</strong> +91-XXXXXXXXXX
              </p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
            <h2 className="text-xl font-bold text-[#1e40af] mb-3">Acknowledgment</h2>
            <p className="text-slate-700">
              By using SkillLink, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use our platform.
            </p>
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

export default TermsOfService;
