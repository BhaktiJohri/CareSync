
const STORAGE_KEYS = {
    DOSES: 'caresync_doses_history',
    PRESCRIPTIONS: 'caresync_prescriptions',
    MEDICATIONS: 'caresync_medications',
    CAREGIVERS: 'caresync_caregivers',
    PROFILE: 'caresync_profile'
};

// --- USER PROFILE ---

/**
 * Get user profile from localStorage
 * @returns {import('../types').UserProfile}
 */
export const getUserProfile = () => {
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

/**
 * Save user profile to localStorage
 * @param {import('../types').UserProfile} profile
 */
export const saveUserProfile = (profile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

// --- DOSES HISTORY ---

/**
 * Save dose history to localStorage
 * @param {import('../types').DoseEvent} dose
 */
export const saveDoseHistory = (dose) => {
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

/**
 * Get dose history from localStorage
 * @returns {import('../types').DoseEvent[]}
 */
export const getDoseHistory = () => {
    const data = localStorage.getItem(STORAGE_KEYS.DOSES);
    return data ? JSON.parse(data) : [];
};

/**
 * Get adherence statistics
 * @param {number} days
 * @returns {{percentage: number, taken: number, missed: number, total: number}}
 */
export const getAdherenceStats = (days = 7) => {
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

/**
 * Save prescription to localStorage
 * @param {import('../types').Prescription} prescription
 */
export const savePrescription = (prescription) => {
    const list = getPrescriptions();
    list.unshift(prescription); // Add to top
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
};

/**
 * Get all prescriptions from localStorage
 * @returns {import('../types').Prescription[]}
 */
export const getPrescriptions = () => {
    const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return data ? JSON.parse(data) : [];
};

/**
 * Get prescription by ID
 * @param {string} id
 * @returns {import('../types').Prescription | undefined}
 */
export const getPrescriptionById = (id) => {
    return getPrescriptions().find(p => p.id === id);
};

// --- MEDICATIONS (PERSISTENCE) ---

/**
 * Save medications to localStorage
 * @param {import('../types').Medication[]} meds
 */
export const saveMedicationsToStorage = (meds) => {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
};

/**
 * Get medications from localStorage
 * @returns {import('../types').Medication[]}
 */
export const getMedicationsFromStorage = () => {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    return data ? JSON.parse(data) : [];
};

// --- CAREGIVERS ---

/**
 * Get caregivers from localStorage
 * @returns {import('../types').Caregiver[]}
 */
export const getCaregivers = () => {
    const data = localStorage.getItem(STORAGE_KEYS.CAREGIVERS);
    return data ? JSON.parse(data) : [];
};

/**
 * Save a caregiver to localStorage
 * @param {import('../types').Caregiver} cg
 */
export const saveCaregiver = (cg) => {
    const list = getCaregivers();
    list.push(cg);
    localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(list));
};

/**
 * Delete a caregiver from localStorage
 * @param {string} id
 */
export const deleteCaregiver = (id) => {
    const list = getCaregivers().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(list));
};

// --- REPORTS ---

/**
 * Generate a report link (simulated)
 * @param {string} caregiverId
 * @param {number} rangeDays
 * @returns {Promise<{shareableReportUrl: string, expiresAt: string}>}
 */
export const generateReportLink = async (caregiverId, rangeDays) => {
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
