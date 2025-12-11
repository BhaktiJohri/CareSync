
import React, { useState, useEffect } from 'react';
import { getCaregivers, generateReportLink } from '../services/storageService';
import { X, Share2, Calendar, Check, Copy, Link, ShieldCheck, Mail } from 'lucide-react';

const ShareReportModal = ({ isOpen, onClose }) => {
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCgId, setSelectedCgId] = useState('');
  const [range, setRange] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const list = getCaregivers();
      setCaregivers(list);
      if (list.length > 0) setSelectedCgId(list[0].id);
      setResult(null);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!selectedCgId) return;
    setIsLoading(true);
    try {
      const data = await generateReportLink(selectedCgId, range);
      setResult({ url: data.shareableReportUrl, expires: data.expiresAt });
    } catch (e) {
      alert("Failed to generate report.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up flex flex-col">

        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <Share2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-xl text-slate-800">Share Health Report</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {!result ? (
            <div className="space-y-6">
              {caregivers.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 mb-4">You haven't added any caregivers yet.</p>
                  <button onClick={onClose} className="text-teal-600 font-bold hover:underline">Go to Caregivers Tab</button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Share with</label>
                    <select
                      value={selectedCgId}
                      onChange={(e) => setSelectedCgId(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    >
                      {caregivers.map(cg => (
                        <option key={cg.id} value={cg.id}>{cg.name} ({cg.relation})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Data Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setRange(7)}
                        className={`p-3 rounded-xl border font-bold text-sm transition-all ${range === 7 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-500'}`}
                      >
                        Last 7 Days
                      </button>
                      <button
                        onClick={() => setRange(30)}
                        className={`p-3 rounded-xl border font-bold text-sm transition-all ${range === 30 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-500'}`}
                      >
                        Last 30 Days
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                      This will generate a temporary link containing your medication list, adherence stats, and recent vitals.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Generating...' : 'Generate Secure Link'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">Link Ready!</h4>
              <p className="text-slate-500 text-sm">Share this link with your caregiver.</p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <Link className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={result.url}
                  className="bg-transparent border-none outline-none text-sm font-medium text-slate-600 w-full truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="text-indigo-600 font-bold text-xs hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="bg-indigo-50 text-indigo-800 text-xs font-medium px-4 py-2 rounded-lg inline-block">
                Expires on {new Date(result.expires).toLocaleDateString()}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 italic mb-4">
                  (In the real app, this would also be emailed automatically to the selected caregiver.)
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;
