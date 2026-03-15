import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createCompany, getMyCompany, updateCompany } from '../../services/api';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingCompany, setExistingCompany] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    company_type: '',
    location: '',
    contact_person: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const data = await getMyCompany();
      setExistingCompany(data);
      setFormData({
        company_name: data.company_name || '',
        company_type: data.company_type || '',
        location: data.location || '',
        contact_person: data.contact_person || '',
        phone: data.phone || '',
        email: data.email || '',
      });
    } catch (error) {
      // Company doesn't exist yet, that's okay
      console.log('No existing company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      console.log('Submitting company profile:', formData);
      
      if (existingCompany) {
        // Update existing company
        const response = await updateCompany(existingCompany.id, formData);
        console.log('Update response:', response);
        alert('Company profile updated successfully!');
      } else {
        // Create new company
        const response = await createCompany(formData);
        console.log('Create response:', response);
        alert('Company profile created successfully!');
      }
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error saving company:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to save company profile. Please try again.';
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/company/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1F3A5F] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1F3A5F] rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1F3A5F]">
              {existingCompany ? 'Edit Company Profile' : 'Create Company Profile'}
            </h1>
            <p className="text-slate-600">
              {existingCompany ? 'Update your company information' : 'Tell us about your company'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${
                errors.company_name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="ABC Construction Pvt Ltd"
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-500">{errors.company_name}</p>
            )}
          </div>

          {/* Company Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Type
            </label>
            <select
              name="company_type"
              value={formData.company_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="Construction">Construction</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Interior Design">Interior Design</option>
              <option value="Maintenance Services">Maintenance Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder="Mumbai, Maharashtra"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder="Rajesh Kumar"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder="9876543210"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder="contact@company.com"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/company/dashboard')}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1F3A5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {existingCompany ? 'Update Profile' : 'Create Profile'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
