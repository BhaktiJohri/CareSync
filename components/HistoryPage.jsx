
import React, { useState, useEffect } from 'react';
import { getDoseHistory, getPrescriptions, getAdherenceStats, getMedicationsFromStorage } from '../services/storageService';
import { Calendar, CheckCircle2, XCircle, FileText, ChevronRight, Pill, AlertCircle, Clock } from 'lucide-react';

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('doses');
  const [history, setHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState({ percentage: 0, taken: 0, missed: 0, total: 0 });
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [allMedications, setAllMedications] = useState([]);

  useEffect(() => {
    // Load Data
    const doses = getDoseHistory();
    // Sort by date desc
    doses.sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());
    setHistory(doses);

    setPrescriptions(getPrescriptions());
    setStats(getAdherenceStats(7));
    setAllMedications(getMedicationsFromStorage());
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken': return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'missed': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'skipped': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getMedsForPrescription = (medIds) => {
    return allMedications.filter(m => medIds.includes(m.id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Health History</h2>
          <p className="text-slate-500 font-medium">Track your progress and past records</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('doses')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'doses' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Dose Log
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'prescriptions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Prescriptions
          </button>
        </div>
      </div>

      {activeTab === 'doses' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center gap-3 mb-2 opacity-90">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Adherence (7 Days)</span>
              </div>
              <div className="text-5xl font-extrabold mb-1">{stats.percentage}%</div>
              <div className="text-indigo-100 text-sm font-medium">
                {stats.taken} taken of {stats.total} scheduled
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 text-rose-500">
                <AlertCircle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Missed Doses</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-800 mb-1">{stats.missed}</div>
              <div className="text-slate-400 text-sm font-medium">
                In the last 7 days
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 text-teal-600">
                <Pill className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Total Tracked</span>
              </div>
              <div className="text-4xl font-extrabold text-slate-800 mb-1">{history.length}</div>
              <div className="text-slate-400 text-sm font-medium">
                Lifetime doses recorded
              </div>
            </div>
          </div>

          {/* Dose Log List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Activity Log</h3>
            </div>
            {history.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No history recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {history.map((dose) => (
                  <div key={dose.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${dose.status === 'taken' ? 'bg-teal-100 text-teal-600' : 'bg-rose-100 text-rose-500'}`}>
                        {dose.status === 'taken' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{dose.medicationName}</h4>
                        <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                          <span>{dose.dosage}</span>
                          <span>â€¢</span>
                          <span>{new Date(dose.date).toLocaleDateString()} at {dose.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(dose.status)} border`}>
                      {dose.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPrescription(p)}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group hover:shadow-md transition-all hover:border-indigo-200"
            >
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <img src={p.imageUrl} alt="Prescription" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Uploaded</p>
                    <p className="font-bold text-slate-800">{new Date(p.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                {p.doctorName && (
                  <p className="text-sm text-slate-600 mb-2 font-medium">Dr. {p.doctorName}</p>
                )}
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 mt-4">
                  View Details <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}

          {prescriptions.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No prescriptions uploaded yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedPrescription(null)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 bg-slate-900 h-64 md:h-auto flex items-center justify-center p-4">
              <img src={selectedPrescription.imageUrl} alt="Original" className="max-w-full max-h-full rounded-lg shadow-lg" />
            </div>
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Prescription Details</h3>
                  <p className="text-slate-500">{new Date(selectedPrescription.uploadDate).toDateString()}</p>
                </div>
                <button onClick={() => setSelectedPrescription(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Medications Found</h4>
                  <div className="space-y-3">
                    {getMedsForPrescription(selectedPrescription.medicationIds).map(med => (
                      <div key={med.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className={`w-1.5 self-stretch rounded-full ${med.color || 'bg-slate-400'}`} />
                        <div>
                          <p className="font-bold text-slate-800">{med.name}</p>
                          <p className="text-xs text-slate-500">{med.dosage} â€¢ {med.frequency}</p>
                        </div>
                      </div>
                    ))}
                    {getMedsForPrescription(selectedPrescription.medicationIds).length === 0 && (
                      <p className="text-sm text-slate-400 italic">No medications linked (or parsed data lost).</p>
                    )}
                  </div>
                </div>

                {selectedPrescription.notes && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">AI Notes</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{selectedPrescription.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HistoryPage;
