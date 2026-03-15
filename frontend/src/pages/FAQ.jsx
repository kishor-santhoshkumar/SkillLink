import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      items: [
        {
          q: 'What is SkillLink?',
          a: 'SkillLink is an AI-powered platform that connects skilled blue-collar workers with trusted companies. Workers can create profiles and apply for jobs, while companies can post job openings and hire workers.'
        },
        {
          q: 'How do I create an account?',
          a: 'Visit the home page and click "Create Profile". Choose your role (Worker or Company), provide your email, create a password, and follow the registration steps.'
        },
        {
          q: 'Is SkillLink free to use?',
          a: 'Yes, SkillLink is currently free for both workers and companies. We may introduce premium features in the future.'
        },
        {
          q: 'What information do I need to provide?',
          a: 'Workers need to provide their name, contact details, skills, experience, and a profile photo. Companies need their business name, location, and contact information.'
        }
      ]
    },
    {
      category: 'For Workers',
      items: [
        {
          q: 'How do I create my profile?',
          a: 'You can create your profile in three ways: (1) Describe Your Work - write or speak about your skills, (2) Easy Form - fill out a step-by-step form, or (3) AI Resume - let our AI generate your profile.'
        },
        {
          q: 'How do I apply for jobs?',
          a: 'Browse available jobs in the Jobs section, review the job details, and click "Apply Now". You can track all your applications in the "My Applications" section.'
        },
        {
          q: 'Can I cancel my application?',
          a: 'Yes, you can cancel any pending application by clicking the "Cancel" button next to the job in your applications list.'
        },
        {
          q: 'How do I download my resume?',
          a: 'Go to your profile and click "Download Resume". Choose from 4 professional templates and download as PDF.'
        },
        {
          q: 'How are workers rated?',
          a: 'Companies rate workers after job completion based on quality, professionalism, and reliability. Ratings help build your reputation on the platform.'
        },
        {
          q: 'Can I publish my profile?',
          a: 'Yes, you can publish your profile to make it visible to companies. Go to your profile settings and click "Publish Profile".'
        }
      ]
    },
    {
      category: 'For Companies',
      items: [
        {
          q: 'How do I post a job?',
          a: 'Go to the Jobs section, click "Post New Job", fill in the job details (title, location, requirements, budget), and publish. Your job will be visible to all workers.'
        },
        {
          q: 'How do I search for workers?',
          a: 'Use the Search Workers section to find workers by trade, location, or rating. You can view their profiles and contact them directly.'
        },
        {
          q: 'How do I manage applications?',
          a: 'Go to your Jobs section to see all applications. You can accept or reject applications. Accepted workers will receive notifications.'
        },
        {
          q: 'How do I track hired workers?',
          a: 'Go to "My Workers" to see all your hired workers. You can view their status (In Progress/Completed) and rate them after job completion.'
        },
        {
          q: 'Can I rate workers?',
          a: 'Yes, after a job is completed, you can rate the worker from 1-5 stars. This helps build their reputation and helps other companies make informed decisions.'
        },
        {
          q: 'How do I mark a job as completed?',
          a: 'In the "My Workers" section, click "Mark as Completed" next to the worker. This moves them from In Progress to Completed.'
        }
      ]
    },
    {
      category: 'Payments & Transactions',
      items: [
        {
          q: 'How do payments work?',
          a: 'Currently, SkillLink does not process payments. Workers and companies arrange payment directly. We recommend using secure payment methods.'
        },
        {
          q: 'Will SkillLink charge fees?',
          a: 'SkillLink is currently free. We may introduce optional premium features in the future, but basic functionality will remain free.'
        },
        {
          q: 'What if there\'s a payment dispute?',
          a: 'Payment disputes are handled directly between workers and companies. Contact our support team if you need assistance.'
        }
      ]
    },
    {
      category: 'Safety & Security',
      items: [
        {
          q: 'Is my personal information safe?',
          a: 'Yes, we use industry-standard encryption and security measures to protect your data. Please review our Privacy Policy for details.'
        },
        {
          q: 'How do I report inappropriate behavior?',
          a: 'If you encounter harassment or inappropriate behavior, contact our support team immediately with details. We take safety seriously.'
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes, you can request account deletion by contacting our support team. Your data will be deleted as per our privacy policy.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions to reset your password.'
        }
      ]
    },
    {
      category: 'Ratings & Reviews',
      items: [
        {
          q: 'How does the rating system work?',
          a: 'After job completion, companies rate workers 1-5 stars. Workers can see their average rating on their profile. Ratings help build credibility.'
        },
        {
          q: 'Can I dispute a rating?',
          a: 'If you believe a rating is unfair, contact our support team with details. We review disputes and take appropriate action.'
        },
        {
          q: 'Are ratings visible to everyone?',
          a: 'Yes, your average rating is visible on your public profile. Individual reviews are visible to you and the person who gave the rating.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      items: [
        {
          q: 'What browsers are supported?',
          a: 'SkillLink works on all modern browsers: Chrome, Firefox, Safari, and Edge. For best experience, keep your browser updated.'
        },
        {
          q: 'Is there a mobile app?',
          a: 'SkillLink is fully responsive and works on mobile browsers. Native mobile apps may be available in the future.'
        },
        {
          q: 'What should I do if I encounter a bug?',
          a: 'Contact our support team with details about the issue, including screenshots if possible. We\'ll investigate and fix it.'
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#1e40af] mb-2">Frequently Asked Questions</h1>
            <p className="text-lg text-slate-600">Find answers to common questions about SkillLink</p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h2 className="text-2xl font-bold text-[#1e40af] mb-4 flex items-center gap-2">
                <span className="text-3xl">📚</span>
                {section.category}
              </h2>
              
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => {
                  const globalIdx = faqs.slice(0, sectionIdx).reduce((sum, s) => sum + s.items.length, 0) + itemIdx;
                  const isOpen = openIndex === globalIdx;

                  return (
                    <div
                      key={itemIdx}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <button
                        onClick={() => toggleFAQ(globalIdx)}
                        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-blue-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900 flex-1">{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#1e40af] flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 bg-blue-50 border-t border-blue-100">
                          <p className="text-slate-700 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-3">Still Need Help?</h2>
          <p className="text-slate-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Contact Support
          </Link>
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

export default FAQ;
