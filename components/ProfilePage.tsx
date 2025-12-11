
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../services/storageService';
import { UserCircle, Mail, Phone, Globe, Clock, Bell, Shield, Edit2, Save, X, CheckCircle2, User, Heart } from 'lucide-react';

interface ProfilePageProps {
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const data = getUserProfile();
    setProfile(data);
    setFormData(data);
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handlePreferenceChange = (field: keyof UserProfile['notificationPreferences'], value: boolean) => {
    if (!formData) return;
    setFormData({
      ...formData,
      notificationPreferences: {
        ...formData.notificationPreferences,
        [field]: value
      }
    });
  };

  const handleSave = () => {
    if (!formData) return;
    saveUserProfile(formData);
    setProfile(formData);
    onProfileUpdate(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (!profile || !formData) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-24 right-6 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-slide-up z-50">
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
          <span className="font-bold">Profile Updated Successfully</span>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-indigo-200 shrink-0 border-4 border-white">
            {profile.avatarInitials || profile.fullName.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">{profile.fullName}</h1>
            {profile.primaryCondition && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-sm font-bold">
                <Heart className="w-4 h-4 fill-current" />
                Living with {profile.primaryCondition}
              </div>
            )}
            <p className="text-slate-400 font-medium mt-4 flex items-center justify-center md:justify-start gap-2">
              <UserCircle className="w-4 h-4" />
              Member since {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personal Information */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              ) : (
                <div className="p-3 bg-slate-50 border border-transparent rounded-xl font-bold text-slate-800">
                  {profile.fullName}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Age</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 border border-transparent rounded-xl font-medium text-slate-800">
                    {profile.age}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Gender</label>
                {isEditing ? (
                  <select 
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="p-3 bg-slate-50 border border-transparent rounded-xl font-medium text-slate-800">
                    {profile.gender}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email Address</label>
              <div className="relative">
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                ) : (
                  <div className="p-3 pl-10 bg-slate-50 border border-transparent rounded-xl font-medium text-slate-800 truncate">
                    {profile.email}
                  </div>
                )}
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Phone Number</label>
              <div className="relative">
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                ) : (
                  <div className="p-3 pl-10 bg-slate-50 border border-transparent rounded-xl font-medium text-slate-800">
                    {profile.phone || 'Not set'}
                  </div>
                )}
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Health & Preferences */}
        <div className="space-y-8">
          
          {/* Settings Section */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-50 p-2.5 rounded-xl">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Health & Preferences</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Primary Condition / Note</label>
                  {isEditing ? (
                    <textarea 
                      value={formData.primaryCondition || ''}
                      onChange={(e) => handleInputChange('primaryCondition', e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                      placeholder="e.g. Hypertension, Diabetes Type 2..."
                    />
                  ) : (
                    <div className="p-3 bg-slate-50 border border-transparent rounded-xl font-medium text-slate-800">
                      {profile.primaryCondition || 'None listed'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Timezone</label>
                    <div className="relative">
                      {isEditing ? (
                         <select
                           value={formData.timezone}
                           onChange={(e) => handleInputChange('timezone', e.target.value)}
                           className="w-full p-3 pl-9 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                         >
                           <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>{Intl.DateTimeFormat().resolvedOptions().timeZone}</option>
                           <option value="UTC">UTC</option>
                           <option value="America/New_York">Eastern Time</option>
                           <option value="America/Los_Angeles">Pacific Time</option>
                         </select>
                      ) : (
                        <div className="p-3 pl-9 bg-slate-50 border border-transparent rounded-xl font-medium text-slate-800 truncate">
                          {profile.timezone}
                        </div>
                      )}
                      <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Language</label>
                    <div className="relative">
                      {isEditing ? (
                         <select
                           value={formData.preferredLanguage}
                           onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                           className="w-full p-3 pl-9 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                         >
                           <option value="English">English</option>
                           <option value="Spanish">Spanish</option>
                           <option value="French">French</option>
                           <option value="Hindi">Hindi</option>
                         </select>
                      ) : (
                        <div className="p-3 pl-9 bg-slate-50 border border-transparent rounded-xl font-medium text-slate-800">
                          {profile.preferredLanguage}
                        </div>
                      )}
                      <Globe className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-3 ml-1">Notifications</label>
                   <div className="space-y-3">
                     {[
                       { key: 'email', label: 'Email Reminders' },
                       { key: 'inApp', label: 'In-App Alerts' },
                       { key: 'weeklySummary', label: 'Weekly Summary Report' },
                       { key: 'caregiverAlerts', label: 'Notify Caregiver on Missed Dose' }
                     ].map((item) => (
                       <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-sm font-medium text-slate-700">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.notificationPreferences[item.key as keyof typeof formData.notificationPreferences]}
                              onChange={(e) => handlePreferenceChange(item.key as any, e.target.checked)}
                              disabled={!isEditing}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                          </label>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
          </div>

          {/* View Mode */}
          <div className="bg-slate-900 rounded-[32px] p-8 shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-400" />
              App Experience Mode
            </h3>
            <p className="text-slate-400 text-sm mb-6">Switch between seeing your own data and the caregiver dashboard view.</p>
            
            <div className="bg-slate-800 p-1.5 rounded-xl flex relative">
               <button
                 onClick={() => isEditing && handleInputChange('viewMode', 'Patient')}
                 disabled={!isEditing}
                 className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all relative z-10 ${formData.viewMode === 'Patient' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                 Patient View
               </button>
               <button
                 onClick={() => isEditing && handleInputChange('viewMode', 'Caregiver')}
                 disabled={!isEditing}
                 className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all relative z-10 ${formData.viewMode === 'Caregiver' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                 Caregiver View
               </button>
            </div>
            {!isEditing && <p className="text-center text-xs text-slate-500 mt-3">Click "Edit Profile" to change mode.</p>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;