
import { GoogleGenAI, Type } from "@google/genai";
import { Medication, SummaryReport, TimeOfDay, ExtractionResult, VitalRecord } from '../types';
import { analyzeVitalSign } from '../utils';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON string if Gemini wraps it in markdown
const cleanJson = (text: string) => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
};

// Helper to assign color based on category
const getCategoryColor = (category: string = ''): string => {
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
 * Uses Gemini 2.5 Flash (Multimodal) to extract structured data from images.
 */
export const parsePrescriptionImage = async (base64Image: string): Promise<ExtractionResult> => {
  const modelId = "gemini-2.5-flash"; 
  
  const prompt = `
    You are an expert medical AI. Analyze this image of a prescription.
    
    1. Extract Medication Details:
    - Name, dosage, frequency, instructions, duration.
    - Infer 'times' array from frequency (e.g., "1-0-1" -> ["Morning", "Night"]).
    - **New**: Provide a 'generalUse' summary (simple layman terms, e.g. "Commonly used to lower cholesterol").
    - **New**: Provide 'category' (e.g. "Statin", "Antibiotic", "Pain reliever").
    
    2. Extract Vitals / Observations if present:
    - Look for text like "BP: 120/80", "Sugar: 110", "Pulse: 72", "Weight: 70kg".
    - Standardize types to: "Blood Pressure", "Blood Sugar", "Heart Rate", "Weight", "SpO2".
    - If no unit is found, infer it based on type (e.g. mmHg for BP).
    
    If the name is handwritten and unclear, give your best guess but mark it.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png", 
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  times: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }
                  },
                  generalUse: { type: Type.STRING, description: "Simple explanation of what this drug treats" },
                  category: { type: Type.STRING, description: "Drug class or category" }
                },
                required: ["name", "dosage", "times"]
              }
            },
            vitals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Blood Pressure, Blood Sugar, Heart Rate, Weight, etc." },
                  value: { type: Type.STRING, description: "The numeric value or string like 120/80" },
                  unit: { type: Type.STRING, description: "The unit of measurement" }
                },
                required: ["type", "value"]
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const rawData = JSON.parse(cleanJson(response.text));
      
      // Process Medications
      const meds = (rawData.medications || []).map((med: any, index: number) => {
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
      const vitals = (rawData.vitals || []).map((vital: any, index: number) => ({
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
    throw new Error("Failed to analyze prescription.");
  }
};

/**
 * Supercharged AI Function: Auto-Summary & Caregiver Report
 */
export const generateHealthReport = async (medications: Medication[], vitals: VitalRecord[]): Promise<SummaryReport> => {
  const modelId = "gemini-2.5-flash";
  const medListJson = JSON.stringify(medications);
  const vitalsJson = JSON.stringify(vitals);

  const prompt = `
    Analyze this health data:
    Meds: ${medListJson}
    Vitals: ${vitalsJson}
    
    1. Create a patient summary. If vitals are abnormal (e.g. high BP), mention it in simple terms.
    2. Identify riskFlags (e.g., "High BP detected - Check with doctor about salt intake").
    3. Write a caregiverNote.
    
    Disclaimer: You are not a doctor.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            riskFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            caregiverNote: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(cleanJson(response.text || '{}'));
  } catch (e) {
    return {
      summary: "Could not generate summary.",
      riskFlags: [],
      caregiverNote: "Please review the list manually."
    };
  }
};

/**
 * Context-Aware Chat
 */
export const chatWithAssistant = async (
  message: string, 
  medications: Medication[], 
  vitals: VitalRecord[],
  chatHistory: any[]
) => {
  const modelId = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are CareSync Assistant.
    User's Medications: ${JSON.stringify(medications)}
    User's Recent Vitals: ${JSON.stringify(vitals)}
    
    Rules:
    1. Answer questions about schedule and health stats.
    2. If vitals are high/low, be helpful but cautious. Suggest general wellness tips (e.g., hydration) but ALWAYS tell them to see a doctor for medical advice.
    3. Keep answers concise.
  `;

  const chat = ai.chats.create({
    model: modelId,
    config: { systemInstruction },
    history: chatHistory
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};