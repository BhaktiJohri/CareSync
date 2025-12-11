
import React, { useState } from 'react';
import { TimeOfDay } from '../types.js';
import { Check, Clock, Moon, Sun, Sunset, Coffee, ChevronDown, ChevronUp, ShieldCheck, Pencil, PartyPopper } from 'lucide-react';

const Timeline = ({ doses, medications, onToggleStatus, onEdit, onCelebration }) => {
  const [expandedDoseId, setExpandedDoseId] = useState(null);

  // Sort and group doses by time
  const sortedDoses = [...doses].sort((a, b) => a.time.localeCompare(b.time));
  const groupedByTime = new Map();

  sortedDoses.forEach(dose => {
    const timeKey = dose.time;
    const existing = groupedByTime.get(timeKey) || [];
    groupedByTime.set(timeKey, [...existing, dose]);
  });

  const timeGroups = Array.from(groupedByTime.entries());
  const allComplete = sortedDoses.length > 0 && sortedDoses.every(d => d.status === 'taken');

  const getTimeIcon = (label) => {
    switch (label) {
      case TimeOfDay.MORNING: return <Coffee className="w-4 h-4" />;
      case TimeOfDay.AFTERNOON: return <Sun className="w-4 h-4" />;
      case TimeOfDay.EVENING: return <Sunset className="w-4 h-4" />;
      case TimeOfDay.NIGHT: return <Moon className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getMedicationDetails = (medId) => medications.find(m => m.id === medId);

  const getColorTheme = (colorClass) => {
    const defaultColor = 'indigo';
    const color = colorClass ? colorClass.replace('bg-', '').replace('-500', '') : defaultColor;
    return {
      base: color,
      bgSoft: `bg-${color}-50`,
      bgGradient: `from-${color}-50 to-white`,
      border: `border-${color}-100`,
      textDark: `text-${color}-900`,
      textMedium: `text-${color}-700`,
      textLight: `text-${color}-600`,
      iconBg: `bg-${color}-100`,
      accent: `bg-${color}-500`,
      shadow: `shadow-${color}-500/10`
    };
  };

  const toggleExpand = (id) => setExpandedDoseId(expandedDoseId === id ? null : id);

  if (doses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-20 h-20 bg-slate-50/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <Clock className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No doses scheduled</h3>
        <p className="text-slate-400">Upload a prescription to build your schedule.</p>
      </div>
    );
  }

  return (
    <div className="relative pb-12 w-full max-w-4xl mx-auto">
      {/* Vertical Connection Line - Restored */}
      <div className="absolute left-9 top-6 bottom-0 w-0.5 bg-slate-200/60 -z-10 hidden sm:block"></div>

      <div className="flex flex-col gap-12 relative z-10">
        {timeGroups.map(([time, dosesInSlot]) => {
          const label = dosesInSlot[0].label;
          const isSlotComplete = dosesInSlot.every(d => d.status === 'taken');

          return (
            <div key={time} className="flex flex-col sm:flex-row gap-6 sm:gap-10">

              {/* Time Column */}
              <div className="flex-shrink-0">
                <div className={`
                   sticky top-24 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg transition-all transform w-fit
                   ${isSlotComplete
                    ? 'bg-slate-100 text-slate-400 opacity-80 border border-slate-200'
                    : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-slate-900/20 scale-105 ring-4 ring-white/30'
                  }
                `}>
                  <span className="font-bold text-xl tracking-tight">{time}</span>
                  <div className={`w-px h-4 ${isSlotComplete ? 'bg-slate-300' : 'bg-white/20'}`}></div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    {getTimeIcon(label)}
                  </div>
                </div>
              </div>

              {/* Cards Stack - Clean Vertical Column */}
              <div className="flex-1 flex flex-col gap-5">
                {dosesInSlot.map((dose) => {
                  const isCompleted = dose.status === 'taken';
                  const medDetails = getMedicationDetails(dose.medicationId);
                  const theme = getColorTheme(medDetails?.color);
                  const isExpanded = expandedDoseId === dose.id;

                  return (
                    <div
                      key={dose.id}
                      className={`
                        relative rounded-[24px] overflow-hidden transition-all duration-300 border backdrop-blur-md
                        ${isCompleted
                          ? 'bg-slate-50/50 border-slate-100 opacity-60 grayscale-[0.5]'
                          : `bg-gradient-to-br from-white/95 to-white/70 border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-0.5`
                        }
                      `}
                    >
                      {/* Neon Accent Strip */}
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${isCompleted ? 'bg-slate-300' : theme.accent} opacity-80`} />

                      <div className="p-5 pl-7">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className={`font-bold text-lg ${isCompleted ? 'text-slate-500 line-through' : theme.textDark}`}>
                              {dose.medicationName}
                            </h4>
                            <p className={`text-sm font-medium ${isCompleted ? 'text-slate-400' : theme.textLight}`}>
                              {dose.dosage}
                            </p>
                          </div>

                          {/* Check Button */}
                          <button
                            onClick={() => onToggleStatus(dose.id)}
                            className={`
                              w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm ml-4
                              ${isCompleted
                                ? 'bg-teal-500 text-white shadow-teal-500/30 scale-95'
                                : `bg-white border border-slate-100 text-slate-300 hover:text-teal-500 hover:border-teal-200 hover:scale-105 active:scale-95`
                              }
                            `}
                          >
                            {isCompleted ? <Check className="w-6 h-6" /> : <div className="w-5 h-5 rounded-full border-[2.5px] border-slate-200" />}
                          </button>
                        </div>

                        <div className={`flex items-center gap-2 text-xs font-semibold mt-2 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-slate-300' : theme.accent}`} />
                          {dose.instructions}
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/50">
                          {!isCompleted && medDetails && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onEdit(medDetails); }}
                              className="text-slate-400 hover:text-slate-600 transition-all duration-200 p-1.5 hover:bg-slate-100 rounded-lg hover:scale-110 active:scale-95"
                              title="Edit Dose"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {medDetails?.generalUse && (
                            <button
                              onClick={() => toggleExpand(dose.id)}
                              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${theme.textMedium} hover:opacity-80 ml-auto bg-slate-50/80 px-3 py-1.5 rounded-lg hover:bg-slate-100`}
                            >
                              <span>What is this for?</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Info */}
                      <div className={`transition-all duration-300 ease-in-out bg-slate-50/50 overflow-hidden ${isExpanded ? 'max-h-60' : 'max-h-0'}`}>
                        <div className="p-5 pt-2 pl-7 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50">
                          <div className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide mb-2 bg-white border ${theme.border} ${theme.textMedium}`}>
                            {medDetails?.category || 'General'}
                          </div>
                          <p className="mb-3 font-medium">{medDetails?.generalUse}</p>
                          <div className="flex items-start gap-2 text-[11px] font-bold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-100/50">
                            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="leading-snug">General information only. Follow your doctor's instructions.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* All Done Celebration Button */}
      {allComplete && (
        <div className="mt-20 flex flex-col items-center animate-slide-up pb-8">
          <div className="relative group cursor-pointer" onClick={onCelebration}>
            <div className="absolute inset-0 bg-yellow-400 rounded-[32px] blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
            <button
              className="relative bg-gradient-to-tr from-slate-900 to-slate-800 text-white px-12 py-6 rounded-[32px] font-bold text-2xl shadow-2xl flex items-center gap-4 border border-white/10 group-hover:scale-105 transition-transform"
            >
              <PartyPopper className="w-8 h-8 text-yellow-400 group-hover:rotate-12 transition-transform" />
              <span>All Done!</span>
            </button>
            <div className="absolute -top-3 -right-3 bg-white text-slate-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-yellow-400 rotate-12">
              100%
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold text-sm tracking-wide uppercase opacity-70">Great job keeping up with your health!</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;

