
import React, { useState, useEffect } from 'react';
import { getCaregivers, saveCaregiver, deleteCaregiver } from '../services/storageService';
import { Users, UserPlus, Trash2, Mail, Heart, Phone } from 'lucide-react';

const CaregiversPage = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    email: ''
  });

  useEffect(() => {
    setCaregivers(getCaregivers());
  }, []);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this caregiver?')) {
      deleteCaregiver(id);
      setCaregivers(getCaregivers());
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

    const newCaregiver = {
      id: `cg-${Date.now()}`,
      name: formData.name,
      relation: formData.relation || 'Family',
      email: formData.email,
      isPrimary: caregivers.length === 0 // First one is primary by default
    };

    saveCaregiver(newCaregiver);
    setCaregivers(getCaregivers());

    // Reset
    setFormData({ name: '', relation: '', email: '' });
    setShowAddForm(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="bg-indigo-50 p-4 rounded-2xl">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Caregivers & Family</h2>
            <p className="text-slate-500 font-medium mt-1">Manage who can access your health reports.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Caregiver
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 animate-slide-up">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            New Caregiver Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g. Sarah Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Relationship</label>
              <input
                type="text"
                value={formData.relation}
                onChange={e => setFormData({ ...formData, relation: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g. Daughter"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email / Contact</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="sarah@example.com"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-md shadow-teal-200"
            >
              Save Caregiver
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caregivers.length === 0 && !showAddForm && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-white">
            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No caregivers added yet.</p>
          </div>
        )}

        {caregivers.map(cg => (
          <div key={cg.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
                  {cg.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    {cg.name}
                    {cg.isPrimary && <span className="bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Primary</span>}
                  </h4>
                  <p className="text-slate-500 font-medium flex items-center gap-1.5 text-sm mt-0.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    {cg.relation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cg.id)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400" />
                {cg.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaregiversPage;
