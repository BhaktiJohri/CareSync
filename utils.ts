
import { Medication, DoseEvent, TimeOfDay, VitalRecord, VitalStatus } from './types';

export const TIME_MAPPING: Record<string, string> = {
  [TimeOfDay.MORNING]: '08:00',
  [TimeOfDay.AFTERNOON]: '13:00',
  [TimeOfDay.EVENING]: '18:00',
  [TimeOfDay.NIGHT]: '21:00',
  [TimeOfDay.SOS]: 'SOS',
};

export const generateDailyDoses = (medications: Medication[]): DoseEvent[] => {
  const doses: DoseEvent[] = [];
  const today = new Date().toISOString().split('T')[0];

  medications.forEach((med) => {
    med.times.forEach((timeOfDay) => {
      // Skip SOS for the main timeline for now, or handle differently
      if (timeOfDay === TimeOfDay.SOS) return;

      const time = TIME_MAPPING[timeOfDay] || '09:00';
      
      doses.push({
        id: `${med.id}-${timeOfDay}-${Date.now()}`,
        medicationId: med.id,
        medicationName: med.name,
        dosage: med.dosage,
        time: time,
        date: today,
        status: 'pending',
        instructions: med.instructions,
        label: timeOfDay as TimeOfDay
      });
    });
  });

  return doses.sort((a, b) => a.time.localeCompare(b.time));
};

export const checkReminders = (doses: DoseEvent[]): DoseEvent[] => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  return doses.filter(dose => {
    if (dose.status !== 'pending') return false;
    
    const [h, m] = dose.time.split(':').map(Number);
    const doseTimeVal = h * 60 + m;

    // Trigger if within the last 1 minute or next 1 minute (simple demo window)
    return Math.abs(currentTimeVal - doseTimeVal) <= 1;
  });
};

/**
 * Analyzes a vital sign value and returns its status based on standard medical ranges.
 * This is a simplified demo logic.
 */
export const analyzeVitalSign = (type: string, value: string): VitalStatus => {
  const num = parseFloat(value);
  
  switch (type) {
    case 'Blood Pressure':
      // Expect format "120/80"
      const parts = value.split('/').map(p => parseInt(p.trim()));
      if (parts.length !== 2) return 'unknown';
      const [sys, dia] = parts;
      
      if (sys > 140 || dia > 90) return 'critical'; // High
      if (sys < 90 || dia < 60) return 'warning';  // Low
      if (sys > 120 || dia > 80) return 'warning'; // Elevated
      return 'normal';

    case 'Blood Sugar':
      // Random/Post-prandial assumption for demo
      if (isNaN(num)) return 'unknown';
      if (num > 200) return 'critical';
      if (num > 140) return 'warning';
      if (num < 70) return 'warning';
      return 'normal';

    case 'Heart Rate':
      if (isNaN(num)) return 'unknown';
      if (num > 100) return 'warning'; // Tachycardia
      if (num < 60) return 'warning';  // Bradycardia
      return 'normal';
      
    case 'SpO2':
      if (isNaN(num)) return 'unknown';
      if (num < 90) return 'critical';
      if (num < 95) return 'warning';
      return 'normal';

    default:
      return 'unknown';
  }
};