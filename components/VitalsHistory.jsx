
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react';

const VitalsHistory = ({ vitals, onBack }) => {
  // Get unique types from history
  const availableTypes = useMemo(() => {
    const types = new Set(vitals.map(v => v.type));
    // Default to BP if available, otherwise first available
    return Array.from(types).sort();
  }, [vitals]);

  const [selectedType, setSelectedType] = useState(availableTypes[0] || 'Blood Pressure');
  const [range, setRange] = useState('7d');

  // Filter and sort data
  const chartData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (range === '7d') cutoff.setDate(now.getDate() - 7);
    if (range === '30d') cutoff.setDate(now.getDate() - 30);
    if (range === 'all') cutoff.setFullYear(1900); // Far past

    return vitals
      .filter(v => v.type === selectedType && new Date(v.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(v => {
        let values = {};
        if (selectedType === 'Blood Pressure') {
          const [sys, dia] = v.value.split('/').map(Number);
          values = { sys, dia };
        } else {
          values = { val: parseFloat(v.value) };
        }
        return {
          date: new Date(v.date),
          ...values
        };
      });
  }, [vitals, selectedType, range]);

  // Chart Rendering Helpers
  const width = 600;
  const height = 300;
  const padding = 40;

  const getPoints = (key) => {
    if (chartData.length === 0) return '';
    if (chartData.length === 1) {
      // If only one point, draw a flat line or single dot logic
      return `M ${padding} ${height / 2} L ${width - padding} ${height / 2}`;
    }

    // Find min/max for scaling
    let min = Infinity;
    let max = -Infinity;

    // Scan all data points involved in this chart (handles multi-line scaling like BP)
    chartData.forEach(d => {
      const val = d[key];
      if (val < min) min = val;
      if (val > max) max = val;
      // For BP, check both keys to keep scale consistent if we were drawing them together
      // But usually we scale based on the specific line or global max. 
      // Let's do global max for BP so lines are relative.
      if (selectedType === 'Blood Pressure') {
        if (d.dia < min) min = d.dia;
        if (d.sys > max) max = d.sys;
      }
    });

    // Buffer for nice visual
    const range = max - min || 10;
    const yMin = min - range * 0.1;
    const yMax = max + range * 0.1;

    return chartData.map((d, i) => {
      const val = d[key];
      const x = padding + (i / (chartData.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - yMin) / (yMax - yMin)) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
          <p>No data for this period</p>
        </div>
      );
    }

    const lines = [];
    if (selectedType === 'Blood Pressure') {
      lines.push({ key: 'sys', color: '#0ea5e9', label: 'Systolic' }); // Blue
      lines.push({ key: 'dia', color: '#ec4899', label: 'Diastolic' }); // Pink
    } else {
      lines.push({ key: 'val', color: '#0d9488', label: 'Value' }); // Teal
    }

    return (
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-sm">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />

          {/* Data Lines */}
          {lines.map(line => (
            <path
              key={line.key}
              d={getPoints(line.key)}
              fill="none"
              stroke={line.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Dots */}
          {chartData.map((d, i) => {
            const x = padding + (i / (chartData.length - 1)) * (width - padding * 2);
            // Just plotting dots for the first key for simplicity or all
            return lines.map(line => {
              // Same Y calc logic as above (should refactor but keep simple)
              // Find min/max again
              let min = Infinity;
              let max = -Infinity;
              chartData.forEach(cd => {
                const v = cd[line.key];
                if (v < min) min = v;
                if (v > max) max = v;
                if (selectedType === 'Blood Pressure') {
                  if (cd.dia < min) min = cd.dia;
                  if (cd.sys > max) max = cd.sys;
                }
              });
              const range = max - min || 10;
              const yMin = min - range * 0.1;
              const yMax = max + range * 0.1;
              const val = d[line.key];
              const y = height - padding - ((val - yMin) / (yMax - yMin)) * (height - padding * 2);

              return (
                <g key={`${i}-${line.key}`}>
                  <circle cx={x} cy={y} r="4" fill="white" stroke={line.color} strokeWidth="2" />
                  {/* Show value on top of last point or if sparse */}
                  {(chartData.length < 10 || i === chartData.length - 1) && (
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="12" fill="#64748b">{val}</text>
                  )}
                </g>
              );
            });
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          {lines.map(line => (
            <div key={line.key} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
              <span className="text-xs text-slate-600 font-medium">{line.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-bold text-slate-800">Vitals History</h2>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* Type Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableTypes.length > 0 ? availableTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedType === t
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {t}
            </button>
          )) : <span className="text-sm text-slate-400">No data available</span>}
        </div>

        {/* Range Tabs */}
        <div className="flex justify-end">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex">
            {['7d', '30d', 'all'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${range === r ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        {renderChart()}
        <div className="mt-4 flex justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
          <span>{range === 'all' ? 'First Record' : range === '30d' ? '30 days ago' : '7 days ago'}</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default VitalsHistory;
