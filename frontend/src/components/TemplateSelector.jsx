import { useState, useEffect, useRef } from 'react';
import { FileText, Check, Sparkles, Eye, Download, Star } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const TemplateSelector = ({ selectedTemplate, onSelect, onSave, saving = false, profileId }) => {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [previewingTemplate, setPreviewingTemplate] = useState(null);
  const cardRefs = useRef({});

  const templates = [
    {
      id: 'executive',
      name: 'Executive Classic',
      description: 'Professional, structured, authoritative corporate style',
      bestFor: 'Large construction companies, formal hiring',
      features: ['Navy header', 'Two-column skills', 'Service details grid', 'Photo in header'],
      color: '#1F3A5F',
      icon: '👔'
    },
    {
      id: 'modern',
      name: 'Modern Minimal Elite',
      description: 'Elegant, airy, minimalistic design',
      bestFor: 'Urban skilled workers, modern companies',
      features: ['Centered layout', 'Skill pills', 'Timeline experience', 'Large whitespace'],
      color: '#2563EB',
      icon: '✨'
    },
    {
      id: 'sidebar',
      name: 'Sidebar Professional',
      description: 'Contemporary two-column hiring layout',
      bestFor: 'Recruiters scanning quickly, professional hiring',
      features: ['Blue sidebar', 'Photo at top', 'Compact info', 'Modern layout'],
      color: '#3B82F6',
      icon: '📋'
    },
    {
      id: 'construction',
      name: 'Premium Construction',
      description: 'Bold, confident, industry-focused design',
      bestFor: 'Site contractors, facility managers, construction industry',
      features: ['Bold typography', 'Info cards', 'Highlight boxes', 'Strong visuals'],
      color: '#0F172A',
      icon: '🏗️'
    },
    {
      id: 'compact',
      name: 'Recruiter Quick Scan',
      description: 'Efficient, sharp, optimized for 1 page',
      bestFor: 'Mass hiring environments, quick screening',
      features: ['Compact layout', 'Inline format', 'Pipe separators', 'One-page design'],
      color: '#64748B',
      icon: '⚡'
    }
  ];

  // Fetch recommendations on mount
  useEffect(() => {
    if (profileId) {
      fetchRecommendations();
    }
  }, [profileId]);

  const fetchRecommendations = async () => {
    if (!profileId) return;
    
    setLoadingRecommendations(true);
    try {
      const response = await axios.get(
        `${API_URL}/resumes/${profileId}/template-recommendations`
      );
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleQuickPreview = async (templateId) => {
    if (!profileId) return;
    
    setPreviewingTemplate(templateId);
    try {
      const response = await axios.get(
        `${API_URL}/resumes/${profileId}/preview?template=${templateId}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `preview_${templateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading preview:', err);
      alert('Failed to generate preview. Please try again.');
    } finally {
      setPreviewingTemplate(null);
    }
  };

  const isRecommended = (templateId) => {
    return recommendations.some(rec => rec.template === templateId);
  };

  const getRecommendationScore = (templateId) => {
    const rec = recommendations.find(r => r.template === templateId);
    return rec ? rec.score : 0;
  };

  const handleSelect = (templateId) => {
    onSelect(templateId);
  };

  // Mouse tracking for hover light effect
  const handleMouseMove = (e, templateId) => {
    const card = cardRefs.current[templateId];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div className="premium-card p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1F3A5F]">Choose Your Resume Template</h2>
          <p className="text-slate-600">Select a professional design that matches your style</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {templates.map((template, index) => {
          const isSelected = selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;
          const recommended = isRecommended(template.id);
          const recScore = getRecommendationScore(template.id);
          const isPreviewing = previewingTemplate === template.id;

          return (
            <div
              key={template.id}
              ref={el => cardRefs.current[template.id] = el}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onMouseMove={(e) => handleMouseMove(e, template.id)}
              className={`
                premium-card relative cursor-pointer p-6 transition-all duration-300
                animate-fade-in-stagger
                ${isSelected 
                  ? 'border-[#2563EB] bg-blue-50 shadow-xl shadow-blue-200/50 scale-105 ring-2 ring-[#2563EB] ring-opacity-50' 
                  : 'border-slate-200 bg-white hover:border-[#2563EB]'
                }
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {/* Selection Ring */}
              {isSelected && (
                <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-[#1F3A5F] rounded-2xl opacity-20 blur-md animate-glow-pulse"></div>
              )}

              {/* Check Badge */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-full flex items-center justify-center shadow-xl z-10 animate-fade-in">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}

              {/* Recommended Badge */}
              {recommended && (
                <div className="absolute -top-3 -left-3 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center gap-1 shadow-lg z-10 animate-glow-pulse">
                  <Star className="w-3 h-3 text-white fill-white" />
                  <span className="text-xs font-bold text-white">Recommended</span>
                </div>
              )}

              <div className="relative">
                {/* Icon and Name */}
                <div className="flex items-center gap-3 mb-3" onClick={() => handleSelect(template.id)}>
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${template.color}15` }}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1F3A5F] text-lg leading-tight">
                      {template.name}
                    </h3>
                    {recommended && recScore > 0 && (
                      <span className="text-xs text-amber-600 font-semibold">
                        {recScore}% match
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div onClick={() => handleSelect(template.id)}>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Best For */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">
                      Best For:
                    </span>
                    <p className="text-xs text-slate-700 mt-1">
                      {template.bestFor}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></div>
                        <span className="text-xs text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Preview Mock */}
                  <div className="mt-4 h-32 rounded-lg overflow-hidden border border-slate-200">
                    <div 
                      className="h-full w-full"
                      style={{
                        background: template.id === 'executive' 
                          ? 'linear-gradient(to bottom, #1F3A5F 30%, #ffffff 30%)'
                          : template.id === 'modern'
                          ? 'linear-gradient(to bottom, #ffffff 20%, #EFF6FF 20%, #EFF6FF 80%, #ffffff 80%)'
                          : template.id === 'sidebar'
                          ? 'linear-gradient(to right, #1F3A5F 30%, #ffffff 30%)'
                          : template.id === 'construction'
                          ? 'linear-gradient(to bottom, #1F3A5F 25%, #F8FAFC 25%)'
                          : 'linear-gradient(to bottom, #ffffff 100%)'
                      }}
                    >
                      <div className="p-3 space-y-2">
                        {template.id === 'executive' && (
                          <>
                            <div className="h-2 bg-white/80 rounded w-3/4"></div>
                            <div className="h-1.5 bg-white/60 rounded w-1/2"></div>
                          </>
                        )}
                        {template.id === 'modern' && (
                          <>
                            <div className="h-2 bg-slate-300 rounded w-2/3 mx-auto"></div>
                            <div className="h-0.5 bg-blue-400 rounded w-1/4 mx-auto"></div>
                          </>
                        )}
                        {template.id === 'sidebar' && (
                          <>
                            <div className="h-2 bg-white/80 rounded w-2/3"></div>
                            <div className="h-1.5 bg-white/60 rounded w-1/2"></div>
                          </>
                        )}
                        {template.id === 'construction' && (
                          <>
                            <div className="h-2 bg-white/80 rounded w-3/4"></div>
                            <div className="h-1.5 bg-blue-400 rounded w-1/3"></div>
                          </>
                        )}
                        {template.id === 'compact' && (
                          <>
                            <div className="h-1.5 bg-slate-300 rounded w-full"></div>
                            <div className="h-1 bg-slate-200 rounded w-4/5"></div>
                            <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(template.id);
                    }}
                    className={`
                      flex-1 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                      ${isSelected
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#1F3A5F] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickPreview(template.id);
                    }}
                    disabled={isPreviewing}
                    className="px-3 py-2.5 bg-white border-2 border-[#2563EB] text-[#2563EB] rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-md"
                    title="Download preview PDF"
                  >
                    {isPreviewing ? (
                      <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-center pt-6 border-t border-slate-200">
          <button
            onClick={onSave}
            disabled={saving}
            className={`
              premium-button premium-button-primary
              px-10 py-4 text-lg
              flex items-center gap-3
              ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
          >
            <FileText className="w-6 h-6" />
            {saving ? 'Saving Template...' : 'Save Template Choice'}
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-[#1F3A5F] mb-1.5">
              Premium Templates
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              All templates are professionally designed to match paid resume builders. 
              Your selected template will be used when you download your resume PDF. 
              You can change it anytime!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
