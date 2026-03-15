import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <Header onMenuClick={handleMenuClick} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content */}
      <main className="pt-16 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1e40af] text-white border-t border-[#1e3a8a] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">SkillLink</h3>
              <p className="text-sm text-blue-100">
                AI-powered platform connecting skilled workers with trusted companies.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-blue-100 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/switch-role" className="text-blue-100 hover:text-white transition-colors">
                    Switch Role
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-blue-100 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/contact" className="text-blue-100 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@skilllink.com" className="text-blue-100 hover:text-white transition-colors">
                    Email Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms-of-service" className="text-blue-100 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-blue-100 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#1e3a8a] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-blue-100">
                © 2026 SkillLink. All rights reserved.
              </p>
              <p className="text-sm text-blue-100 mt-4 md:mt-0">
                Made with ❤️ for skilled workers
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
