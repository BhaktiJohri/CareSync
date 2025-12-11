import React, { useState } from 'react';
import { Pill, ChevronDown, ChevronUp, Info, ShieldCheck } from 'lucide-react';

const MedicationList = ({ medications }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (medications.length === 0) return null;

  return (
    <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] p-8 border border-white/50 shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
          <Pill className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Your Medications</h3>
      </div>

      <div className="space-y-4">
        {medications.map((med) => {
          const isExpanded = expandedId === med.id;
          const colorClass = med.color || 'bg-indigo-500';
          const themeColor = colorClass.replace('bg-', '').replace('-500', '');

          return (
            <div
              key={med.id}
              className={`
                relative overflow-hidden rounded-[24px] transition-all duration-300 border
                ${isExpanded
                  ? 'bg-white border-white shadow-lg ring-1 ring-slate-100 scale-[1.01]'
                  : 'bg-white/80 border-transparent hover:bg-white hover:shadow-md'
                }
              `}
            >
              {/* Color Bar */}
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${colorClass}`} />

              <div className="p-5 pl-7">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-slate-800">{med.name}</h4>
                      {med.category && (
                        <span className={`px-2 py-0.5 rounded-md bg-${themeColor}-50 text-${themeColor}-600 border border-${themeColor}-100 text-[10px] font-bold uppercase tracking-wide`}>
                          {med.category}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 font-medium text-sm">{med.dosage} â€¢ {med.frequency}</p>
                  </div>

                  {/* Time Badges */}
                  <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                    {med.times.map(t => (
                      <span key={t} className="text-[10px] uppercase font-bold bg-slate-50 border border-slate-200 px-1.5 py-1 rounded text-slate-500">
                        {t.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleExpand(med.id)}
                  className={`
                    w-full mt-2 flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${isExpanded
                      ? 'bg-slate-50 text-slate-600'
                      : 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    What is this usually for?
                  </div>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Accordion Content */}
              <div className={`
                overflow-hidden transition-all duration-500 ease-in-out
                ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                <div className="p-5 pl-7 bg-slate-50/50 border-t border-slate-100">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        <span className={`font-bold text-${themeColor}-700 block mb-1`}>General Usage:</span>
                        {med.generalUse}
                      </p>

                      <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-100">
                        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                        <p className="text-xs leading-normal opacity-90 font-medium">
                          This is general information. Your doctor may have prescribed this for a specific reason suited to your health history.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicationList;
