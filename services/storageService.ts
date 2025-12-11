
import { DoseEvent, Prescription, Medication, Caregiver, UserProfile } from '../types';

const STORAGE_KEYS = {
  DOSES: 'caresync_doses_history',
  PRESCRIPTIONS: 'caresync_prescriptions',
  MEDICATIONS: 'caresync_medications',
  CAREGIVERS: 'caresync_caregivers',
  PROFILE: 'caresync_profile'
};

// --- USER PROFILE ---

export const getUserProfile = (): UserProfile => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (data) return JSON.parse(data);

  // Default Profile
  return {
    id: 'user-1',
    fullName: 'Demo User',
    age: '65',
    gender: 'Female',
    email: 'demo@caresync.app',
    phone: '',
    primaryCondition: 'Hypertension',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredLanguage: 'English',
    notificationPreferences: {
      email: true,
      sms: false,
      inApp: true,
      weeklySummary: true,
      caregiverAlerts: true
    },
    viewMode: 'Patient',
    avatarInitials: 'DU'
  };
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

// --- DOSES HISTORY ---

export const saveDoseHistory = (dose: DoseEvent) => {
  const history = getDoseHistory();
  // Update if exists (e.g. changing status), else add
  const index = history.findIndex(d => d.id === dose.id);
  if (index >= 0) {
    history[index] = dose;
  } else {
    history.push(dose);
  }
  localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(history));
};

export const getDoseHistory = (): DoseEvent[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DOSES);
  return data ? JSON.parse(data) : [];
};

export const getAdherenceStats = (days: number = 7) => {
  const history = getDoseHistory();
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() - days);

  const relevantDoses = history.filter(d => new Date(d.date) >= cutoff);
  const total = relevantDoses.length;
  if (total === 0) return { percentage: 100, taken: 0, missed: 0, total: 0 };

  const taken = relevantDoses.filter(d => d.status === 'taken').length;
  const missed = relevantDoses.filter(d => d.status === 'missed').length;

  return {
    percentage: Math.round((taken / total) * 100),
    taken,
    missed,
    total
  };
};

// --- PRESCRIPTIONS ---

export const savePrescription = (prescription: Prescription) => {
  const list = getPrescriptions();
  list.unshift(prescription); // Add to top
  localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
};

export const getPrescriptions = (): Prescription[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
  return data ? JSON.parse(data) : [];
};

export const getPrescriptionById = (id: string): Prescription | undefined => {
  return getPrescriptions().find(p => p.id === id);
};

// --- MEDICATIONS (PERSISTENCE) ---

export const saveMedicationsToStorage = (meds: Medication[]) => {
  localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
};

export const getMedicationsFromStorage = (): Medication[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
  return data ? JSON.parse(data) : [];
};

// --- CAREGIVERS ---

export const getCaregivers = (): Caregiver[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CAREGIVERS);
  return data ? JSON.parse(data) : [];
};

export const saveCaregiver = (cg: Caregiver) => {
  const list = getCaregivers();
  list.push(cg);
  localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(list));
};

export const deleteCaregiver = (id: string) => {
  const list = getCaregivers().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(list));
};

// --- REPORTS ---

export const generateReportLink = async (caregiverId: string, rangeDays: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real backend, we would aggregate data here and store a snapshot.
  // For the demo, we generate a fake secure link.
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // Expires in 7 days
  
  return {
    shareableReportUrl: `https://caresync.app/report/${uniqueId}`,
    expiresAt: expiry.toISOString()
  };
};