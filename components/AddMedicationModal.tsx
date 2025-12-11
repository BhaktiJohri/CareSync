
import React, { useState } from 'react';
import { Medication, TimeOfDay } from '../types';
import { X, Save, Clock, Pill, Camera } from 'lucide-react';

interface AddMedicationModalProps {
  onSave: (med: Medication) => void;
  onClose: () => void;
  onScanClick: () => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ onSave, onClose, onScanClick }) => {
  const [step, setStep] = useState<'method' | 'form'>('method');
  const [formData, setFormData] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: 'Daily',
    instructions: '',
    times: [TimeOfDay.MORNING]
  });

  const handleChange = (field: keyof Medication, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTime = (time: TimeOfDay) => {
    setFormData(prev => {
      const currentTimes = prev.times || [];
      const times = currentTimes.includes(time)
        ? currentTimes.filter(t => t !== time)
        : [...currentTimes, time];
      return { ...prev, times };
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.dosage) return;

    const newMed: Medication = {
      id: `manual-${Date.now()}`,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency || 'As directed',
      instructions: formData.instructions || '',
      times: formData.times || [TimeOfDay.MORNING],
      color: 'bg-teal-500',
      category: 'Manual Entry',
      generalUse: 'Manually added medication.'
    };

    onSave(newMed);
    onClose();
  };

  if (step === 'method') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-slide-up relative overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Add Medication</h3>
          <p className="text-slate-500 mb-8">How would you like to add this medicine?</p>

          <div className="space-y-4">
            <button 
              onClick={onScanClick}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-200"
            >
              <div className="bg-white/20 p-3 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Scan Label / Prescription</p>
                <p className="text-indigo-100 text-sm opacity-90">Use AI to extract details</p>
              </div>
            </button>

            <button 
              onClick={() => setStep('form')}
              className="w-full bg-white border border-slate-200 text-slate-700 p-5 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="bg-slate-100 p-3 rounded-xl">
                <Pill className="w-6 h-6 text-slate-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Type Manually</p>
                <p className="text-slate-400 text-sm">Enter name and dosage yourself</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-lg text-slate-800">Manual Entry</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Medication Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Paracetamol"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Dosage</label>
              <input 
                type="text" 
                value={formData.dosage}
                onChange={(e) => handleChange('dosage', e.target.value)}
                placeholder="e.g. 500mg"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Frequency</label>
              <input 
                type="text" 
                value={formData.frequency}
                onChange={(e) => handleChange('frequency', e.target.value)}
                placeholder="e.g. Daily"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Schedule Times</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(TimeOfDay).filter(t => t !== TimeOfDay.SOS).map((time) => {
                const isSelected = formData.times?.includes(time);
                return (
                  <button
                    key={time}
                    onClick={() => toggleTime(time)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold border transition-all
                      ${isSelected 
                        ? 'bg-teal-50 border-teal-200 text-teal-700' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }
                    `}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
          
           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Instructions</label>
              <textarea 
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                rows={2}
                placeholder="e.g. Take after food"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              />
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">Save Medication</button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicationModal;