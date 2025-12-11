
import React, { useState, useEffect } from 'react';
import { parsePrescriptionImage, generateHealthReport } from './services/geminiService.js';
import { generateDailyDoses, checkReminders } from './utils.js';
import { saveDoseHistory, savePrescription, getDoseHistory, saveMedicationsToStorage, getMedicationsFromStorage, getUserProfile } from './services/storageService.js';
import Timeline from './components/Timeline.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';
import UploadSection from './components/UploadSection.jsx';
import VitalsTracker from './components/VitalsTracker.jsx';
import EditMedicationModal from './components/EditMedicationModal.jsx';
import AddMedicationModal from './components/AddMedicationModal.jsx';
import HistoryPage from './components/HistoryPage.jsx';
import CaregiversPage from './components/CaregiversPage.jsx';
import ShareReportModal from './components/ShareReportModal.jsx';
import CelebrationModal from './components/CelebrationModal.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import Logo from './components/Logo.jsx';
import { Share2, Bell, AlertTriangle, LayoutDashboard, History, Users, Sparkles, UserCircle, Plus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data State
  const [userProfile, setUserProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [doses, setDoses] = useState([]);
  const [report, setReport] = useState(null);

  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);

  // Load initial data from storage
  useEffect(() => {
    // Load Profile
    const profile = getUserProfile();
    setUserProfile(profile);

    const savedMeds = getMedicationsFromStorage();
    if (savedMeds.length > 0) {
      setMedications(savedMeds);
      // Re-generate today's schedule from saved meds
      const generated = generateDailyDoses(savedMeds);

      // Merge with today's history to see what's already taken
      const today = new Date().toISOString().split('T')[0];
      const history = getDoseHistory().filter(h => h.date === today);

      const merged = generated.map(genDose => {
        const found = history.find(h => h.medicationId === genDose.medicationId && h.time === genDose.time);
        return found ? found : { ...genDose, date: today }; // Ensure genDose has date
      });

      setDoses(merged);
    }
  }, []);

  // Poll for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const alerts = checkReminders(doses);
      if (alerts.length > 0) {
        setActiveAlert(alerts[0]);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [doses]);

  const handleImageUpload = async (base64Image) => {
    setIsProcessing(true);
    try {
      const extractionResult = await parsePrescriptionImage(base64Image);

      const newMeds = extractionResult.medications;
      const updatedMeds = [...medications, ...newMeds];
      setMedications(updatedMeds);
      saveMedicationsToStorage(updatedMeds);

      const newVitals = extractionResult.vitals;
      setVitals(prev => [...newVitals, ...prev]);

      // Generate Schedule
      const dailyDoses = generateDailyDoses(newMeds);
      // Add date field
      const today = new Date().toISOString().split('T')[0];
      const dailyDosesWithDate = dailyDoses.map(d => ({ ...d, date: today }));

      setDoses(prev => [...prev, ...dailyDosesWithDate]);

      const healthReport = await generateHealthReport(newMeds, newVitals);
      setReport(healthReport);

      // Save Prescription Record
      const newPrescription = {
        id: `rx-${Date.now()}`,
        imageUrl: `data:image/png;base64,${base64Image}`,
        uploadDate: new Date().toISOString(),
        medicationIds: newMeds.map(m => m.id),
        doctorName: "Unknown",
        notes: healthReport.summary
      };
      savePrescription(newPrescription);
      setShowAddMedication(false); // Close modal if open

    } catch (error) {
      console.error("Pipeline failed", error);
      alert("Failed to analyze prescription. Please try a clearer image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualMedAdd = (newMed) => {
    const updatedMeds = [...medications, newMed];
    setMedications(updatedMeds);
    saveMedicationsToStorage(updatedMeds);

    // Regenerate schedule
    const newDoses = generateDailyDoses(updatedMeds);
    const today = new Date().toISOString().split('T')[0];

    const mergedDoses = newDoses.map(newDose => {
      const existing = doses.find(d => d.medicationId === newDose.medicationId && d.time === newDose.time);
      return existing || { ...newDose, date: today };
    });
    setDoses(mergedDoses);
    setShowAddMedication(false);
  };

  const handleManualVitalAdd = async (newVital) => {
    const updatedVitals = [newVital, ...vitals];
    setVitals(updatedVitals);
    const healthReport = await generateHealthReport(medications, updatedVitals);
    setReport(healthReport);
  };

  const toggleDoseStatus = (id) => {
    setDoses(prev => {
      return prev.map(dose => {
        if (dose.id === id) {
          const newStatus = dose.status === 'taken' ? 'pending' : 'taken';
          const updatedDose = {
            ...dose,
            status: newStatus,
            actionTime: newStatus === 'taken' ? new Date().toISOString() : undefined
          };
          // Persist change
          saveDoseHistory(updatedDose);
          return updatedDose;
        }
        return dose;
      });
    });

    if (activeAlert?.id === id) setActiveAlert(null);
  };

  const handleUpdateMedication = (updatedMed) => {
    const updatedMeds = medications.map(m => m.id === updatedMed.id ? updatedMed : m);
    setMedications(updatedMeds);
    saveMedicationsToStorage(updatedMeds);

    // Regenerate schedule
    const newDoses = generateDailyDoses(updatedMeds);
    const today = new Date().toISOString().split('T')[0];

    const mergedDoses = newDoses.map(newDose => {
      const existing = doses.find(d =>
        d.medicationId === newDose.medicationId &&
        d.time === newDose.time
      );
      return existing ? { ...newDose, status: existing.status, date: today } : { ...newDose, date: today };
    });

    setDoses(mergedDoses);
    setEditingMedication(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <HistoryPage />;
      case 'caregivers':
        return <CaregiversPage />;
      case 'profile':
        return <ProfilePage onProfileUpdate={setUserProfile} />;
      case 'dashboard':
      default:
        return (
          <div className="w-full px-4 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-12 xl:grid-cols-12 gap-8">
            {/* LEFT COLUMN */}
            <div className="md:col-span-12 xl:col-span-4 space-y-8 flex flex-col">
              {/* Greeting */}
              <div className="xl:hidden mb-4">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">{userProfile?.fullName.split(' ')[0]}</span>
                </h2>
              </div>

              <UploadSection onImageSelected={handleImageUpload} isProcessing={isProcessing} />

              {/* Report Card */}
              {report ? (
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-600/90 via-indigo-600/90 to-blue-700/90 backdrop-blur-xl border border-white/20 p-8 shadow-2xl shadow-indigo-500/20 text-white animate-fade-in group ring-1 ring-white/10">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-400 opacity-20 blur-3xl rounded-full mix-blend-overlay"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                        <Sparkles className="w-4 h-4 text-teal-300" />
                        <span className="text-xs font-bold tracking-widest uppercase text-indigo-100">AI Health Insight</span>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-medium leading-relaxed text-white drop-shadow-sm">
                        {report.summary}
                      </h3>
                    </div>

                    {report.riskFlags.length > 0 && (
                      <div className="mb-6 bg-rose-500/20 backdrop-blur-md border border-rose-500/30 rounded-2xl p-5 flex flex-col gap-3 shadow-inner">
                        <div className="flex items-center gap-2 text-rose-200 font-bold uppercase text-xs tracking-wider">
                          <AlertTriangle className="w-5 h-5" />
                          <span>Attention Required</span>
                        </div>
                        <div className="space-y-2">
                          {report.riskFlags.map((flag, i) => (
                            <div key={i} className="flex items-start gap-3 text-white/90 text-sm font-medium">
                              <div className="mt-1.5 w-1.5 h-1.5 bg-rose-400 rounded-full shadow-[0_0_8px_rgba(251,113,133,0.8)] shrink-0"></div>
                              <span className="leading-snug">{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-white/10 flex gap-3">
                      <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex-1 bg-white text-indigo-900 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/10 flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Report
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden xl:flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-slate-200/60 rounded-[32px] p-10 text-center bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors group">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg shadow-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">AI Health Analysis</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Upload a prescription to receive a personalized health summary.
                  </p>
                </div>
              )}
            </div>

            {/* MIDDLE COLUMN */}
            <div className="md:col-span-12 xl:col-span-4 flex flex-col gap-8">
              {/* Greeting for desktop */}
              <div className="hidden xl:block">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">{userProfile?.fullName.split(' ')[0]}</span>
                </h2>
              </div>

              <div className="bg-white/60 backdrop-blur-2xl rounded-[36px] p-8 shadow-xl shadow-slate-200/50 border border-white/40 h-full min-h-[600px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex items-end justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Today</h2>
                    <p className="text-lg text-slate-500 font-medium mt-1">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddMedication(true)}
                      className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg"
                      title="Add Medication Manually"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <div className="bg-white/80 backdrop-blur-md border border-white/50 text-teal-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                      {doses.filter(d => d.status === 'taken').length} / {doses.length} Doses
                    </div>
                  </div>
                </div>

                <Timeline
                  doses={doses}
                  medications={medications}
                  onToggleStatus={toggleDoseStatus}
                  onEdit={setEditingMedication}
                  onCelebration={() => setShowCelebration(true)}
                />

                {doses.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-100/50 text-center">
                    <p className="text-sm text-slate-400 max-w-xs mx-auto">
                      CareSync is a prototype. Always follow your doctor's official prescription.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:col-span-12 xl:col-span-4 space-y-8">
              <VitalsTracker vitals={vitals} onAddVital={handleManualVitalAdd} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-20">

      {/* Celebration Modal */}
      <CelebrationModal isOpen={showCelebration} onClose={() => setShowCelebration(false)} />

      {/* Reminder Pop-up */}
      {activeAlert && (
        <div className="fixed top-6 right-6 md:right-10 w-full max-w-md bg-slate-900/95 backdrop-blur-xl text-white p-6 rounded-3xl shadow-2xl z-[100] flex flex-col gap-4 animate-slide-up border border-white/10 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2.5 rounded-2xl shadow-lg shadow-teal-500/20">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase text-teal-300 tracking-wider">Dose Reminder</h4>
              <p className="font-bold text-xl leading-tight">{activeAlert.medicationName}</p>
            </div>
          </div>
          <div className="pl-14">
            <p className="text-slate-300 text-lg mb-4">{activeAlert.dosage} • {activeAlert.instructions}</p>
            <div className="flex gap-3">
              <button
                onClick={() => toggleDoseStatus(activeAlert.id)}
                className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold text-base hover:bg-slate-100 transition-colors shadow-lg"
              >
                Take Now
              </button>
              <button
                onClick={() => setActiveAlert(null)}
                className="px-6 py-3 text-slate-400 font-medium hover:text-white transition-colors"
              >
                Snooze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {editingMedication && (
        <EditMedicationModal
          medication={editingMedication}
          onSave={handleUpdateMedication}
          onClose={() => setEditingMedication(null)}
        />
      )}

      {/* Add Medication Modal */}
      {showAddMedication && (
        <AddMedicationModal
          onSave={handleManualMedAdd}
          onClose={() => setShowAddMedication(false)}
          onScanClick={() => {
            setShowAddMedication(false);
            // Scroll to upload section if on mobile/hidden, mostly handled by UI layout
          }}
        />
      )}

      {/* Share Report Modal */}
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="w-full px-6 lg:px-10 h-20 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Logo />
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100/50 p-1.5 rounded-2xl border border-white/50 shadow-inner">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:bg-slate-200/50 hover:text-slate-700'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:bg-slate-200/50 hover:text-slate-700'}`}
              >
                <History className="w-4 h-4" />
                History
              </button>
              <button
                onClick={() => setActiveTab('caregivers')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'caregivers' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:bg-slate-200/50 hover:text-slate-700'}`}
              >
                <Users className="w-4 h-4" />
                Caregivers
              </button>
            </nav>
            <div className="w-px h-8 bg-slate-200 hidden md:block"></div>

            {userProfile && (
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 p-2 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-white shadow-md ring-1 ring-slate-100' : 'hover:bg-white/50'}`}
              >
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-800">{userProfile.fullName}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{userProfile.viewMode}</span>
                </div>
                {userProfile.avatarInitials ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200 border-2 border-white">
                    {userProfile.avatarInitials}
                  </div>
                ) : (
                  <UserCircle className="w-10 h-10 text-slate-300" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Dynamic Main Content */}
      <main className="w-full max-w-[1600px] mx-auto">
        {renderContent()}
      </main>

      <ChatAssistant medications={medications} vitals={vitals} />
    </div>
  );
}

