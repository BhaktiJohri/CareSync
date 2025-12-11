
import React, { useState } from 'react';
import { Medication, TimeOfDay } from '../types';
import { X, Save, Clock } from 'lucide-react';

interface EditMedicationModalProps {
  medication: Medication;
  onSave: (updatedMed: Medication) => void;
  onClose: () => void;
}

const EditMedicationModal: React.FC<EditMedicationModalProps> = ({ medication, onSave, onClose }) => {
  const [formData, setFormData] = useState<Medication>({ ...medication });

  const handleChange = (field: keyof Medication, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTime = (time: TimeOfDay) => {
    setFormData(prev => {
      const times = prev.times.includes(time)
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time];
      return { ...prev, times };
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-lg text-slate-800">Edit Medication</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Medication Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Dosage */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Dosage</label>
                <input 
                  type="text" 
                  value={formData.dosage}
                  onChange={(e) => handleChange('dosage', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              {/* Frequency Text */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Frequency (Text)</label>
                <input 
                  type="text" 
                  value={formData.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            {/* Schedule Times */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Schedule Times</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(TimeOfDay).filter(t => t !== TimeOfDay.SOS).map((time) => {
                  const isSelected = formData.times.includes(time);
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

            {/* Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Instructions</label>
              <textarea 
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              />
            </div>

            {/* General Use */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">General Use (AI Context)</label>
              <textarea 
                value={formData.generalUse || ''}
                onChange={(e) => handleChange('generalUse', e.target.value)}
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicationModal;