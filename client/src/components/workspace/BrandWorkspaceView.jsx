import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function BrandWorkspaceView() {
  const { brand, updateBrand, resetToDemoData } = useApp();

  const [formData, setFormData] = useState({
    name: brand.name || '',
    tagline: brand.tagline || '',
    tone: brand.tone || '',
    audience: brand.audience || '',
    guidelines: brand.guidelines || '',
    approvedTerms: [...(brand.approvedTerms || [])],
    prohibitedTerms: [...(brand.prohibitedTerms || [])],
    products: brand.products ? JSON.parse(JSON.stringify(brand.products)) : []
  });

  const [newApprovedTerm, setNewApprovedTerm] = useState('');
  const [newProhibitedTerm, setNewProhibitedTerm] = useState('');

  const handleAddApprovedTerm = (e) => {
    e.preventDefault();
    if (newApprovedTerm.trim() && !formData.approvedTerms.includes(newApprovedTerm.trim())) {
      setFormData(prev => ({
        ...prev,
        approvedTerms: [...prev.approvedTerms, newApprovedTerm.trim()]
      }));
      setNewApprovedTerm('');
    }
  };

  const handleRemoveApprovedTerm = (termToRemove) => {
    setFormData(prev => ({
      ...prev,
      approvedTerms: prev.approvedTerms.filter(t => t !== termToRemove)
    }));
  };

  const handleAddProhibitedTerm = (e) => {
    e.preventDefault();
    if (newProhibitedTerm.trim() && !formData.prohibitedTerms.includes(newProhibitedTerm.trim())) {
      setFormData(prev => ({
        ...prev,
        prohibitedTerms: [...prev.prohibitedTerms, newProhibitedTerm.trim()]
      }));
      setNewProhibitedTerm('');
    }
  };

  const handleRemoveProhibitedTerm = (termToRemove) => {
    setFormData(prev => ({
      ...prev,
      prohibitedTerms: prev.prohibitedTerms.filter(t => t !== termToRemove)
    }));
  };

  const handleProductChange = (index, field, value) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value
      };
      if (field === 'approvedPrice') {
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num)) updatedProducts[index].approvedPriceNum = num;
      }
      if (field === 'previousPrice') {
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num)) updatedProducts[index].previousPriceNum = num;
      }
      return { ...prev, products: updatedProducts };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateBrand(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-depth rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Building2 className="w-4 h-4 text-midnight-950" />
            <span>Brand Administration</span>
          </div>
          <h1 className="text-xl font-extrabold text-midnight-950 tracking-tight">
            Brand Workspace & Policy Configuration
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Configure institutional guidelines, approved terminology, prohibited language, and commercial product price schedules used by the verification engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={resetToDemoData}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-lime px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-lime-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Brand Identity & Communication Tone */}
        <div className="card-depth rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-midnight-950" />
            <h2 className="text-sm font-extrabold text-midnight-950">Brand Identity & Communication Standards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Organization / Brand Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none transition-colors shadow-inner-subtle"
                placeholder="e.g. NovaFit Nutrition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none transition-colors shadow-inner-subtle"
                placeholder="e.g. Fueling Peak Human Performance"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Approved Communication Tone & Voice
              </label>
              <input
                type="text"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none transition-colors shadow-inner-subtle"
                placeholder="e.g. Professional, Friendly, Trustworthy"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Rule engine flags street slang, aggressive hype, and hyperbolic language against this standard.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Target Audience
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none transition-colors shadow-inner-subtle"
                placeholder="e.g. Health-conscious consumers and athletes"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              General Brand Governance Guidelines & Editorial Directives
            </label>
            <textarea
              rows={3}
              value={formData.guidelines}
              onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
              className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none transition-colors font-sans leading-relaxed shadow-inner-subtle"
              placeholder="Enter compliance rules and directives..."
            />
          </div>
        </div>

        {/* Section 2: Terminology Matrix (Approved vs. Prohibited) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Approved Terminology */}
          <div className="card-depth rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600" />
                <h3 className="text-sm font-extrabold text-midnight-950">Approved Terminology</h3>
              </div>
              <span className="text-xs font-bold text-midnight-950 bg-lime-400/30 px-2 py-0.5 rounded border border-lime-500/40">
                {formData.approvedTerms.length} terms
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newApprovedTerm}
                onChange={(e) => setNewApprovedTerm(e.target.value)}
                placeholder="Add approved phrase (e.g. Affordable)..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddApprovedTerm(e); }}
              />
              <button
                type="button"
                onClick={handleAddApprovedTerm}
                className="btn-dark px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 min-h-[90px]">
              {formData.approvedTerms.map((term, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-lime-400/20 text-midnight-950 border border-lime-500/40 shadow-sm"
                >
                  <span>{term}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveApprovedTerm(term)}
                    className="text-midnight-950 hover:text-red-600 ml-1 font-extrabold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Prohibited Terminology */}
          <div className="card-depth rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-extrabold text-midnight-950">Prohibited Terminology</h3>
              </div>
              <span className="text-xs font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {formData.prohibitedTerms.length} terms
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newProhibitedTerm}
                onChange={(e) => setNewProhibitedTerm(e.target.value)}
                placeholder="Add prohibited phrase (e.g. Cheap)..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddProhibitedTerm(e); }}
              />
              <button
                type="button"
                onClick={handleAddProhibitedTerm}
                className="btn-dark px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 min-h-[90px]">
              {formData.prohibitedTerms.map((term, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-900 border border-red-200 shadow-sm"
                >
                  <span>{term}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProhibitedTerm(term)}
                    className="text-red-700 hover:text-red-900 ml-1 font-extrabold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Commercial Product Catalog & Price Schedules */}
        <div className="card-depth rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-midnight-950" />
            <h3 className="text-sm font-extrabold text-midnight-950">Commercial Product Price Schedules</h3>
          </div>

          <div className="space-y-4">
            {formData.products.map((prod, idx) => (
              <div key={prod.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-inner-subtle">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={prod.name}
                      onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none font-bold text-midnight-950"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-midnight-950 mb-1">
                      Current Approved Retail Price
                    </label>
                    <input
                      type="text"
                      value={prod.approvedPrice}
                      onChange={(e) => handleProductChange(idx, 'approvedPrice', e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-lime-500/60 font-extrabold text-midnight-950 rounded-lg focus:border-lime-600 focus:outline-none shadow-sm"
                      placeholder="e.g. ₹1,199"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      Superseded / Outdated Price
                    </label>
                    <input
                      type="text"
                      value={prod.previousPrice}
                      onChange={(e) => handleProductChange(idx, 'previousPrice', e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 text-slate-500 line-through rounded-lg focus:border-slate-400 focus:outline-none"
                      placeholder="e.g. ₹999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Description</label>
                  <input
                    type="text"
                    value={prod.description || ''}
                    onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-lime px-6 py-2.5 rounded-lg text-xs shadow-lime-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
