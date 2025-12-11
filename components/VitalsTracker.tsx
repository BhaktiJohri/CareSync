import React, { useState, useEffect } from 'react';
import { VitalRecord, VitalStatus } from '../types';
import { analyzeVitalSign } from '../utils';
import { Activity, Plus, Heart, Droplet, Scale, Thermometer, TrendingUp, Wind, CheckCircle2, X } from 'lucide-react';
import VitalsHistory from './VitalsHistory';

// Configuration for dynamic UI
const VITAL_CONFIG: Record<string, { unit: string; placeholder: string; icon: React.ReactNode; color: string }> = {
  'Blood Pressure': { unit: 'mmHg', placeholder: 'e.g. 120/80', icon: <Activity className="w-5 h-5" />, color: 'sky' },
  'Heart Rate': { unit: 'bpm', placeholder: 'e.g. 72', icon: <Heart className="w-5 h-5" />, color: 'rose' },
  'Blood Sugar': { unit: 'mg/dL', placeholder: 'e.g. 95', icon: <Droplet className="w-5 h-5" />, color: 'emerald' },
  'Weight': { unit: 'kg', placeholder: 'e.g. 70', icon: <Scale className="w-5 h-5" />, color: 'violet' },
  'Temperature': { unit: '°F', placeholder: 'e.g. 98.6', icon: <Thermometer className="w-5 h-5" />, color: 'amber' },
  'SpO2': { unit: '%', placeholder: 'e.g. 98', icon: <Wind className="w-5 h-5" />, color: 'teal' },
};

interface VitalsTrackerProps {
  vitals: VitalRecord[];
  onAddVital: (vital: VitalRecord) => void;
}

const VitalsTracker: React.FC<VitalsTrackerProps> = ({ vitals, onAddVital }) => {
  const [viewMode, setViewMode] = useState<'list' | 'history'>('list');
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [selectedType, setSelectedType] = useState<string>('Blood Pressure');
  const [value, setValue] = useState('');

  // Derived state for current config
  const currentConfig = VITAL_CONFIG[selectedType] || VITAL_CONFIG['Blood Pressure'];

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSave = () => {
    if (!value.trim()) return;
    
    const record: VitalRecord = {
      id: `manual-${Date.now()}`,
      type: selectedType as any,
      value: value.trim(),
      unit: currentConfig.unit,
      date: new Date().toISOString(),
      status: analyzeVitalSign(selectedType, value),
      source: 'manual'
    };

    onAddVital(record);
    setValue('');
    setShowForm(false);
    setShowSuccess(true);
  };

  // Get latest record for each type
  const sortedVitals = [...vitals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const uniqueLatest = Array.from(new Map(sortedVitals.map(item => [item.type, item])).values());

  if (viewMode === 'history') {
    return (
      <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] p-8 border border-white/50 shadow-xl shadow-slate-200/50 h-full">
        <VitalsHistory vitals={vitals} onBack={() => setViewMode('list')} />
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] p-8 border border-white/50 shadow-xl shadow-slate-200/50 h-full relative overflow-hidden">
      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-fade-in z-20">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          Vital Saved
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-3">
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-2 rounded-xl shadow-lg shadow-rose-500/20">
             <Heart className="w-5 h-5 text-white" />
          </div>
          Health Vitals
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('history')}
            className="p-2.5 rounded-xl text-slate-500 hover:bg-white/80 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
            title="View History"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`p-2.5 rounded-xl transition-all font-medium border ${showForm ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100'}`}
            title={showForm ? "Cancel" : "Add Vital"}
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-[24px] border border-white shadow-lg animate-slide-up relative z-10">
          <div className="flex justify-between items-center mb-4">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Add New Record</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Vital Type</label>
              <select 
                value={selectedType} 
                onChange={(e) => {
                    setSelectedType(e.target.value);
                    setValue('');
                }}
                className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-700"
              >
                {Object.keys(VITAL_CONFIG).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">
                Value <span className="text-slate-400 font-normal">({currentConfig.unit})</span>
              </label>
              <input 
                type="text" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={currentConfig.placeholder}
                className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold"
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={!value}
            className="w-full bg-slate-900 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Record
          </button>
        </div>
      )}

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-2 gap-4">
        {uniqueLatest.length === 0 ? (
          <div className="col-span-2 py-16 text-center border-2 border-dashed border-slate-200/60 rounded-[24px] bg-white/30">
             <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-400 font-medium text-sm">No vitals recorded yet.</p>
             <button onClick={() => setShowForm(true)} className="mt-2 text-teal-600 font-bold text-xs hover:underline uppercase tracking-wide">Add first record</button>
          </div>
        ) : (
          uniqueLatest.map((vital) => {
             const config = VITAL_CONFIG[vital.type] || VITAL_CONFIG['Blood Pressure'];
             return (
              <div 
                key={vital.id} 
                className={`
                   relative overflow-hidden p-5 rounded-[24px] flex flex-col justify-between aspect-[1.2] transition-all duration-300 group
                   bg-gradient-to-br from-white to-slate-50 border border-white/60 shadow-lg hover:-translate-y-1 hover:shadow-xl
                `}
              >
                {/* Accent Background Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${config.color}-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity`}></div>

                <div className="flex items-start justify-between relative z-10">
                  <div className={`p-2.5 rounded-xl bg-${config.color}-50 text-${config.color}-600`}>
                    {config.icon}
                  </div>
                  {vital.status !== 'normal' && (
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${vital.status === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {vital.status}
                    </span>
                  )}
                </div>
                
                <div className="relative z-10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 truncate">{vital.type}</div>
                  <div className="font-extrabold text-2xl tracking-tight text-slate-800 mb-1 group-hover:scale-105 transition-transform origin-left">
                    {vital.value}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400">
                     {vital.unit}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VitalsTracker;