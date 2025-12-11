
import { GoogleGenAI } from "@google/genai";
import { analyzeVitalSign } from '../utils.js';

// Initialize Gemini Client
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

/**
 * Helper to clean JSON string if Gemini wraps it in markdown
 * @param {string} text
 * @returns {string}
 */
const cleanJson = (text) => {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return clean;
};

/**
 * Helper to assign color based on category
 * @param {string} category
 * @returns {string}
 */
const getCategoryColor = (category = '') => {
    const c = category.toLowerCase();
    if (c.includes('antibiotic') || c.includes('bacterial') || c.includes('infection')) return 'bg-cyan-500';
    if (c.includes('pain') || c.includes('inflammatory') || c.includes('nsaid') || c.includes('headache')) return 'bg-rose-500';
    if (c.includes('allergy') || c.includes('cold') || c.includes('histamine') || c.includes('cough')) return 'bg-purple-500';
    if (c.includes('cardio') || c.includes('heart') || c.includes('blood pressure') || c.includes('hypertension')) return 'bg-red-500';
    if (c.includes('diabetes') || c.includes('glucose') || c.includes('sugar') || c.includes('insulin')) return 'bg-emerald-500';
    if (c.includes('vitamin') || c.includes('supplement') || c.includes('mineral')) return 'bg-amber-500';
    if (c.includes('stomach') || c.includes('gastric') || c.includes('acid') || c.includes('digest')) return 'bg-orange-500';
    if (c.includes('asthma') || c.includes('respiratory') || c.includes('lung')) return 'bg-sky-500';
    if (c.includes('anxiety') || c.includes('sleep') || c.includes('depress') || c.includes('mental')) return 'bg-indigo-500';

    // Fallback default
    return 'bg-blue-500';
};

/**
 * Supercharged AI Function: Visual Prescription & Vitals Parser
 * Uses Gemini 2.0 Flash (Multimodal) to extract structured data from images.
 * @param {string} base64Image
 * @returns {Promise<import('../types').ExtractionResult>}
 */
export const parsePrescriptionImage = async (base64Image) => {
    const prompt = `
    You are an expert medical AI. Analyze this image of a prescription.
    
    1. Extract Medication Details:
    - Name, dosage, frequency, instructions, duration.
    - Infer 'times' array from frequency (e.g., "1-0-1" -> ["Morning", "Night"]).
    - Provide a 'generalUse' summary (simple layman terms, e.g. "Commonly used to lower cholesterol").
    - Provide 'category' (e.g. "Statin", "Antibiotic", "Pain reliever").
    
    2. Extract Vitals / Observations if present:
    - Look for text like "BP: 120/80", "Sugar: 110", "Pulse: 72", "Weight: 70kg".
    - Standardize types to: "Blood Pressure", "Blood Sugar", "Heart Rate", "Weight", "SpO2".
    - If no unit is found, infer it based on type (e.g. mmHg for BP).
    
    If the name is handwritten and unclear, give your best guess but mark it.
    
    Return JSON in this exact format:
    {
      "medications": [
        {
          "name": "string",
          "dosage": "string",
          "frequency": "string",
          "instructions": "string",
          "duration": "string",
          "times": ["Morning", "Afternoon", "Evening", "Night"],
          "generalUse": "string",
          "category": "string"
        }
      ],
      "vitals": [
        {
          "type": "string",
          "value": "string",
          "unit": "string"
        }
      ]
    }
  `;

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: "image/png",
                            data: base64Image
                        }
                    }
                ]
            },
            config: {
                responseMimeType: "application/json"
            }
        });

        if (response.text) {
            const rawData = JSON.parse(cleanJson(response.text));

            // Process Medications
            const meds = (rawData.medications || []).map((med, index) => {
                const category = med.category || "General Health";
                return {
                    ...med,
                    id: `med-${Date.now()}-${index}`,
                    // Assign color based on category
                    color: getCategoryColor(category),
                    generalUse: med.generalUse || "Consult your doctor for details.",
                    category: category
                };
            });

            // Process Vitals
            const vitals = (rawData.vitals || []).map((vital, index) => ({
                id: `vital-${Date.now()}-${index}`,
                type: vital.type,
                value: vital.value,
                unit: vital.unit || '',
                date: new Date().toISOString(),
                status: analyzeVitalSign(vital.type, vital.value),
                source: 'extracted'
            }));

            return { medications: meds, vitals: vitals };
        }
        return { medications: [], vitals: [] };
    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        throw new Error("Failed to analyze prescription. Make sure your API key is set correctly.");
    }
};

/**
 * Supercharged AI Function: Auto-Summary & Caregiver Report
 * @param {import('../types').Medication[]} medications
 * @param {import('../types').VitalRecord[]} vitals
 * @returns {Promise<import('../types').SummaryReport>}
 */
export const generateHealthReport = async (medications, vitals) => {
    const medListJson = JSON.stringify(medications);
    const vitalsJson = JSON.stringify(vitals);

    const prompt = `
    Analyze this health data:
    Meds: ${medListJson}
    Vitals: ${vitalsJson}
    
    1. Create a patient summary. If vitals are abnormal (e.g. high BP), mention it in simple terms.
    2. Identify riskFlags (e.g., "High BP detected - Check with doctor about salt intake").
    3. Write a caregiverNote.
    
    Return JSON in this format:
    {
      "summary": "string",
      "riskFlags": ["string"],
      "caregiverNote": "string"
    }
    
    Disclaimer: You are not a doctor.
  `;

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        return JSON.parse(cleanJson(response.text || '{}'));
    } catch (e) {
        console.error("Health report generation error:", e);
        return {
            summary: "Could not generate summary.",
            riskFlags: [],
            caregiverNote: "Please review the list manually."
        };
    }
};

/**
 * Context-Aware Chat
 * @param {string} message
 * @param {import('../types').Medication[]} medications
 * @param {import('../types').VitalRecord[]} vitals
 * @param {Array} chatHistory
 * @returns {Promise<string>}
 */
export const chatWithAssistant = async (
    message,
    medications,
    vitals,
    chatHistory
) => {
    const systemInstruction = `
    You are CareSync Assistant.
    User's Medications: ${JSON.stringify(medications)}
    User's Recent Vitals: ${JSON.stringify(vitals)}
    
    Rules:
    1. Answer questions about schedule and health stats.
    2. If vitals are high/low, be helpful but cautious. Suggest general wellness tips (e.g., hydration) but ALWAYS tell them to see a doctor for medical advice.
    3. Keep answers concise.
  `;

    try {
        const history = chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const response = await genAI.chats.create({
            model: "gemini-2.0-flash-exp",
            config: { systemInstruction },
            history: history
        }).sendMessage({ message });

        return response.text;
    } catch (error) {
        console.error("Chat error:", error);
        return "I'm having trouble responding right now. Please try again.";
    }
};
