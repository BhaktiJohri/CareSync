
/**
 * @typedef {'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'As Needed'} TimeOfDay
 */

/**
 * TimeOfDay enum values
 */
export const TimeOfDay = {
    MORNING: 'Morning',
    AFTERNOON: 'Afternoon',
    EVENING: 'Evening',
    NIGHT: 'Night',
    SOS: 'As Needed'
};

/**
 * @typedef {Object} Medication
 * @property {string} id
 * @property {string} name
 * @property {string} dosage
 * @property {string} frequency
 * @property {string} instructions
 * @property {string} [duration]
 * @property {TimeOfDay[]} times
 * @property {string} [color]
 * @property {string} [generalUse]
 * @property {string} [category]
 */

/**
 * @typedef {Object} DoseEvent
 * @property {string} id
 * @property {string} medicationId
 * @property {string} medicationName
 * @property {string} dosage
 * @property {string} time - HH:mm format
 * @property {string} date - YYYY-MM-DD (ISO date part)
 * @property {'pending' | 'taken' | 'skipped' | 'missed'} status
 * @property {string} [actionTime] - ISO timestamp of when it was taken
 * @property {string} instructions
 * @property {TimeOfDay} label
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user' | 'model'} role
 * @property {string} text
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} SummaryReport
 * @property {string} summary
 * @property {string[]} riskFlags
 * @property {string} caregiverNote
 */

/**
 * @typedef {'normal' | 'warning' | 'critical' | 'unknown'} VitalStatus
 */

/**
 * @typedef {Object} VitalRecord
 * @property {string} id
 * @property {'Blood Pressure' | 'Blood Sugar' | 'Heart Rate' | 'Weight' | 'SpO2' | 'Temperature'} type
 * @property {string} value
 * @property {string} unit
 * @property {string} date
 * @property {VitalStatus} status
 * @property {'extracted' | 'manual'} source
 */

/**
 * @typedef {Object} ExtractionResult
 * @property {Medication[]} medications
 * @property {VitalRecord[]} vitals
 */

/**
 * @typedef {Object} Prescription
 * @property {string} id
 * @property {string} imageUrl - Base64
 * @property {string} uploadDate - ISO
 * @property {string[]} medicationIds
 * @property {string} [doctorName]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Caregiver
 * @property {string} id
 * @property {string} name
 * @property {string} relation
 * @property {string} email
 * @property {boolean} [isPrimary]
 */

/**
 * @typedef {Object} NotificationPreferences
 * @property {boolean} email
 * @property {boolean} sms
 * @property {boolean} inApp
 * @property {boolean} weeklySummary
 * @property {boolean} caregiverAlerts
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} fullName
 * @property {string} age
 * @property {string} gender
 * @property {string} email
 * @property {string} [phone]
 * @property {string} [primaryCondition]
 * @property {string} timezone
 * @property {string} preferredLanguage
 * @property {NotificationPreferences} notificationPreferences
 * @property {'Patient' | 'Caregiver'} viewMode
 * @property {string} [avatarInitials]
 */
