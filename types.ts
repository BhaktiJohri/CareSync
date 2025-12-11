
export enum TimeOfDay {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
  NIGHT = 'Night',
  SOS = 'As Needed'
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  duration?: string;
  times: TimeOfDay[];
  color?: string;
  generalUse?: string;
  category?: string;
}

export interface DoseEvent {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string; // HH:mm
  date: string; // YYYY-MM-DD (ISO date part)
  status: 'pending' | 'taken' | 'skipped' | 'missed';
  actionTime?: string; // ISO timestamp of when it was taken
  instructions: string;
  label: TimeOfDay;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SummaryReport {
  summary: string;
  riskFlags: string[];
  caregiverNote: string;
}

export type VitalStatus = 'normal' | 'warning' | 'critical' | 'unknown';

export interface VitalRecord {
  id: string;
  type: 'Blood Pressure' | 'Blood Sugar' | 'Heart Rate' | 'Weight' | 'SpO2' | 'Temperature';
  value: string;
  unit: string;
  date: string;
  status: VitalStatus;
  source: 'extracted' | 'manual';
}

export interface ExtractionResult {
  medications: Medication[];
  vitals: VitalRecord[];
}

export interface Prescription {
  id: string;
  imageUrl: string; // Base64
  uploadDate: string; // ISO
  medicationIds: string[];
  doctorName?: string;
  notes?: string;
}

export interface Caregiver {
  id: string;
  name: string;
  relation: string;
  email: string;
  isPrimary?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  age: string;
  gender: string;
  email: string;
  phone?: string;
  primaryCondition?: string;
  timezone: string;
  preferredLanguage: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    weeklySummary: boolean;
    caregiverAlerts: boolean;
  };
  viewMode: 'Patient' | 'Caregiver';
  avatarInitials?: string;
}