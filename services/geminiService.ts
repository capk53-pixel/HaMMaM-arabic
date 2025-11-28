import { GoogleGenAI } from "@google/genai";
import { UserData, WorkoutPlan, NutritionPlan, ExerciseDatabaseCategory, FoodAnalysisResult, CardioExercise, FoodCategory, FoodItem } from '../types';
import { 
    getWorkoutPlanPrompt, getWorkoutPlanSchema,
    getNutritionPlanPrompt, getNutritionPlanSchema,
    getExerciseDatabasePrompt, getExerciseDatabaseSchema,
    getFoodAnalysisPrompt, getFoodAnalysisSchema,
    getCardioLibraryPrompt, getCardioLibrarySchema,
    getEgyptianFoodLibraryPrompt, getEgyptianFoodLibrarySchema,
    getFoodSearchPrompt, getFoodSearchSchema
} from './prompts';

// A new client will be created for each API call to ensure the most up-to-date API key is used.
const getAiClient = (): GoogleGenAI => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // This error will be caught by the async function's catch block, preventing an app crash.
        throw new Error("API_KEY environment variable not set or unavailable.");
    }
    return new GoogleGenAI({ apiKey });
};


export const generateWorkoutPlan = async (userData: UserData): Promise<WorkoutPlan> => {
  const prompt = getWorkoutPlanPrompt(userData);
  const schema = getWorkoutPlanSchema();
  
  try {
    const aiClient = getAiClient();
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const plan = JSON.parse(jsonString);

    if (!plan.planName || !plan.weeklySplit) {
      throw new Error("Invalid plan structure received from API");
    }

    return plan as WorkoutPlan;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan from Gemini API.");
  }
};

export const generateNutritionPlan = async (userData: UserData, workoutPlan: WorkoutPlan): Promise<NutritionPlan> => {
  const prompt = getNutritionPlanPrompt(userData, workoutPlan);
  const schema = getNutritionPlanSchema();

  try {
    const aiClient = getAiClient();
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const plan = JSON.parse(jsonString);

    if (!plan.planTitle || !plan.dailyCalories || !plan.dailyMacros || !plan.sampleDay || !plan.recommendations) {
        throw new Error("Invalid nutrition plan structure received from API");
    }

    return plan as NutritionPlan;
  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    throw new Error("Failed to generate nutrition plan from Gemini API.");
  }
};

export const fetchExerciseDatabase = async (): Promise<ExerciseDatabaseCategory[]> => {
    const prompt = getExerciseDatabasePrompt();
    const schema = getExerciseDatabaseSchema();

    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (!result.database || !Array.isArray(result.database)) {
            throw new Error("Invalid database structure received from API");
        }

        return result.database as ExerciseDatabaseCategory[];
    } catch (error) {
        console.error("Error fetching exercise database:", error);
        throw new Error("Failed to fetch exercise database from Gemini API.");
    }
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysisResult> => {
    const prompt = getFoodAnalysisPrompt();
    const schema = getFoodAnalysisSchema();

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = { text: prompt };

    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (!result.totalCalories || !result.items) {
             throw new Error("Invalid analysis structure received from API");
        }

        return result as FoodAnalysisResult;
    } catch (error) {
        console.error("Error analyzing food image:", error);
        throw new Error("Failed to analyze food image from Gemini API.");
    }
};

export const fetchCardioLibrary = async (): Promise<CardioExercise[]> => {
    const prompt = getCardioLibraryPrompt();
    const schema = getCardioLibrarySchema();

    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (!result.library || !Array.isArray(result.library)) {
            throw new Error("Invalid cardio library structure received from API");
        }

        return result.library as CardioExercise[];
    } catch (error) {
        console.error("Error fetching cardio library:", error);
        throw new Error("Failed to fetch cardio library from Gemini API.");
    }
};

export const fetchEgyptianFoodLibrary = async (): Promise<FoodCategory[]> => {
    const prompt = getEgyptianFoodLibraryPrompt();
    const schema = getEgyptianFoodLibrarySchema();

    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (!result.library || !Array.isArray(result.library)) {
            throw new Error("Invalid food library structure received from API");
        }

        return result.library as FoodCategory[];
    } catch (error) {
        console.error("Error fetching Egyptian food library:", error);
        throw new Error("Failed to fetch Egyptian food library from Gemini API.");
    }
};

export interface SearchFoodResult {
    categoryName: string;
    item: FoodItem;
}

export const searchFoodDatabase = async (query: string): Promise<SearchFoodResult[]> => {
    const prompt = getFoodSearchPrompt(query);
    const schema = getFoodSearchSchema();

    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        return result.results as SearchFoodResult[];
    } catch (error) {
        console.error("Error searching food database:", error);
        throw new Error("Failed to search food database via Gemini.");
    }
};