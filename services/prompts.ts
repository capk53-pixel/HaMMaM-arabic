import { Type } from "@google/genai";
import { UserData, WorkoutPlan } from '../types';

const translateUserData = (userData: UserData) => {
    // This function now just maps the keys to more readable English values for the prompt
    const translations = {
        gender: { male: 'Male', female: 'Female' },
        experience: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
        goal: { muscle_gain: 'Muscle Gain', fat_loss: 'Fat Loss', strength_gain: 'Strength Gain', general_fitness: 'General Fitness', body_recomposition: 'Body Recomposition (Build muscle and lose fat)' },
        secondaryGoals: { endurance: 'Improve Endurance', flexibility: 'Increase Flexibility', posture: 'Improve Posture' },
        bodyType: { ectomorph: 'Ectomorph (lean, struggles to gain weight)', mesomorph: 'Mesomorph (naturally muscular build)', endomorph: 'Endomorph (larger build, gains fat easily)' },
        problemAreas: { belly: 'Belly and waist', thighs: 'Thighs and glutes', arms: 'Arms', chest: 'Chest' },
        injuries: { lower_back: 'Lower Back', knees: 'Knees', shoulders: 'Shoulders', wrists: 'Wrists' },
        activityLevel: { sedentary: 'Sedentary (desk job)', lightly_active: 'Lightly Active (some walking/movement)', active: 'Active (manual labor)' },
        equipment: { full_gym: 'Full Gym', home_gym: 'Home Gym (dumbbells & bands)', bodyweight: 'Bodyweight Only' },
    };
    return {
        ...userData,
        gender: translations.gender[userData.gender],
        experience: translations.experience[userData.experience],
        goal: translations.goal[userData.goal],
        secondaryGoals: userData.secondaryGoals?.map(g => translations.secondaryGoals[g]) || [],
        bodyType: userData.bodyType ? translations.bodyType[userData.bodyType] : 'Not specified',
        problemAreas: userData.problemAreas?.map(p => translations.problemAreas[p as keyof typeof translations.problemAreas]) || [],
        injuries: userData.injuries?.map(i => translations.injuries[i as keyof typeof translations.injuries]) || [],
        activityLevel: userData.activityLevel ? translations.activityLevel[userData.activityLevel] : 'Not specified',
        equipment: userData.equipment ? translations.equipment[userData.equipment] : 'Not specified',
    };
}


export const getWorkoutPlanSchema = () => ({
  type: Type.OBJECT,
  properties: {
    planName: {
      type: Type.STRING,
      description: "An inspiring and catchy name for the workout plan in Arabic. Example: 'خطة بناء القوة'",
    },
    weeklySplit: {
      type: Type.ARRAY,
      description: "An array of training days for the week.",
      items: {
        type: Type.OBJECT,
        required: ["day", "muscleGroups", "exercises"],
        properties: {
          day: {
            type: Type.STRING,
            description: "Title for the training day in Arabic. Example: 'اليوم الأول: دفع'",
          },
          muscleGroups: {
            type: Type.STRING,
            description: "The main muscle groups targeted on this day, in Arabic. Example: 'الصدر، الأكتاف، الترايسبس'",
          },
          exercises: {
            type: Type.ARRAY,
            description: "An array of exercises for this day.",
            items: {
              type: Type.OBJECT,
              required: ["name", "sets", "reps", "rest", "notes"],
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the exercise in English. Example: 'Barbell Bench Press'",
                },
                sets: {
                  type: Type.STRING,
                  description: "Number of sets. Example: '4'",
                },
                reps: {
                  type: Type.STRING,
                  description: "Target repetition range. Example: '8-12'",
                },
                rest: {
                  type: Type.STRING,
                  description: "Rest period between sets in seconds. Example: '60-90 seconds'",
                },
                notes: {
                  type: Type.STRING,
                  description: "Important notes about performing the exercise or a tip for maximum benefit, in Arabic. Example: 'ركز على النزول البطيء والمتحكم فيه.'",
                },
                imageUrl: {
                  type: Type.STRING,
                  description: "Important: A direct URL to a high-quality, clear animated GIF showing how to perform the exercise (e.g., https://example.com/image.gif). Search diligently to find the best possible image.",
                },
              },
            },
          },
        },
      },
    },
  },
  required: ["planName", "weeklySplit"],
});

export const getWorkoutPlanPrompt = (userData: UserData): string => {
    const translatedData = translateUserData(userData);

    const secondaryGoalsPrompt = translatedData.secondaryGoals.length > 0 ? `- Secondary Goals: ${translatedData.secondaryGoals.join(', ')}` : '';
    const problemAreasPrompt = translatedData.problemAreas.length > 0 ? `- Target Fat Accumulation Areas: ${translatedData.problemAreas.join(', ')}` : '';
    const injuriesPrompt = translatedData.injuries.length > 0 ? `- Previous Injuries or Limitations: ${translatedData.injuries.join(', ')}` : '';
    const injuryDetailsPrompt = translatedData.injuryDetails ? `- Injury Details: ${translatedData.injuryDetails}` : '';

    return `
    You are an expert fitness coach, specializing in creating scientific, personalized training plans in the style of "Built with Science".
    Your task is to create a complete and highly customized weekly training plan based on the following comprehensive user data.
    
    User Data:
    - Gender: ${translatedData.gender}
    - Age: ${translatedData.age} years
    - Weight: ${translatedData.weight} kg
    - Height: ${translatedData.height} cm
    - Experience Level: ${translatedData.experience}
    - Primary Goal: ${translatedData.goal}
    - Available Training Days Per Week: ${translatedData.daysPerWeek}
    ${secondaryGoalsPrompt}

    Advanced Personalization Data:
    - Body Type: ${translatedData.bodyType}
    - Daily Activity Level: ${translatedData.activityLevel}
    - Available Equipment: ${translatedData.equipment}
    ${problemAreasPrompt}
    ${injuriesPrompt}
    ${injuryDetailsPrompt}

    Instructions:
    1.  Design the plan based on the available days.
    2.  All textual outputs (notes, day names, plan name, muscle groups, etc.) must be in clear Arabic.
    3.  **Very Important**: The **exercise names (exercise.name) must be in English**.
    4.  **For each exercise, find a high-quality animated GIF URL and add it to the imageUrl field**.
    5.  **Injuries:** If the user mentions an injury (e.g., 'Knee'), avoid exercises that put direct stress on that area and provide safe alternatives.
    6.  Your entire response must be a valid JSON object that strictly conforms to the provided Schema.
    `;
};


export const getNutritionPlanSchema = () => ({
    type: Type.OBJECT,
    properties: {
      planTitle: { type: Type.STRING, description: "A catchy title for the nutrition plan in Arabic." },
      dailyCalories: { type: Type.STRING, description: "Recommended daily calorie range." },
      dailyMacros: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.STRING, description: "Daily protein amount in grams." },
          carbs: { type: Type.STRING, description: "Daily carbohydrates amount in grams." },
          fats: { type: Type.STRING, description: "Daily fats amount in grams." },
        },
        required: ["protein", "carbs", "fats"],
      },
      sampleDay: {
        type: Type.ARRAY,
        description: "An array of meals for a sample day.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Meal name in Arabic (e.g., 'وجبة الإفطار')." },
            description: { type: Type.STRING, description: "Description and ingredients of the meal in Arabic." },
            calories: { type: Type.STRING, description: "Approximate calories for the meal." },
          },
          required: ["name", "description", "calories"],
        },
      },
      recommendations: {
        type: Type.ARRAY,
        description: "An array of general nutrition tips in Arabic.",
        items: { type: Type.STRING },
      },
    },
    required: ["planTitle", "dailyCalories", "dailyMacros", "sampleDay", "recommendations"],
});

export const getNutritionPlanPrompt = (userData: UserData, workoutPlan: WorkoutPlan): string => {
    const translatedData = translateUserData(userData);
    
    return `
    You are a world-class sports nutritionist. Your task is to create a detailed one-day nutrition plan in Arabic.

    User Data:
    - Gender: ${translatedData.gender}
    - Age: ${translatedData.age}
    - Weight: ${translatedData.weight}
    - Height: ${translatedData.height}
    - Experience Level: ${translatedData.experience}
    - Primary Goal: ${translatedData.goal}
    - Training Days/Week: ${translatedData.daysPerWeek}
    - Body Type: ${translatedData.bodyType}
    - Daily Activity Level: ${translatedData.activityLevel}

    User's Weekly Workout Plan:
    - Plan Name: ${workoutPlan.planName}
    - Day Details: ${workoutPlan.weeklySplit.map(day => `${day.day} (${day.muscleGroups})`).join(', ')}

    Instructions:
    1.  Calculate the estimated daily calories and macros needed to achieve the user's goal.
    2.  Create a sample full day of meals (breakfast, lunch, dinner, snacks).
    3.  Provide 3-5 important general recommendations.
    4.  All outputs must be in clear Arabic.
    5.  Your entire response must be a valid JSON object that conforms to the schema.
  `;
};

export const getExerciseDatabaseSchema = () => ({
    type: Type.OBJECT,
    properties: {
        database: {
            type: Type.ARRAY,
            description: "A comprehensive list of muscle group categories.",
            items: {
                type: Type.OBJECT,
                properties: {
                    muscleGroup: { type: Type.STRING, description: "Name of the muscle group in Arabic." },
                    imageUrl: { type: Type.STRING, description: "URL for an image illustrating the muscle group (optional)." },
                    exercises: {
                        type: Type.ARRAY,
                        description: "List of exercises for this muscle group.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Name of the exercise in English." },
                                imageUrl: { type: Type.STRING, description: "URL for a high-quality animated GIF of the exercise." },
                                youtubeUrl: { type: Type.STRING, description: "URL for a high-quality YouTube tutorial video." },
                            },
                            required: ["name"],
                        },
                    },
                },
                required: ["muscleGroup", "exercises"],
            },
        }
    },
    required: ["database"],
});
export const getExerciseDatabasePrompt = () => `
    You are a world-class strength and conditioning coach and fitness librarian. Your task is to generate a comprehensive and meticulously organized exercise database.

    **Core Instructions:**

    1.  **Comprehensive Coverage:** The database must be extensive. For each muscle group, include a wide variety of exercises using different equipment:
        *   Barbells
        *   Dumbbells
        *   Kettlebells
        *   Cables
        *   Machines
        *   Bodyweight
        *   Resistance Bands

    2.  **Muscle Groups:** Organize exercises under the following specific muscle groups (in Arabic):
        *   الصدر
        *   الظهر (يشمل اللاتس، الترابيس، أسفل الظهر)
        *   الأكتاف (يشمل الرؤوس الثلاثة للدالية)
        *   البايسبس
        *   الترايسبس
        *   الساعد
        *   عضلات الفخذ الأمامية (الكواد)
        *   عضلات الفخذ الخلفية (الهامسترينج)
        *   الأرداف (الجلوتس)
        *   السمانة (الكالفز)
        *   البطن والكور (يشمل تمارين للبطن المستقيمة، المائلة، والعميقة)
        *   تمارين لكامل الجسم

    3.  **Data Quality (VERY IMPORTANT):**
        *   **Muscle Group Names:** All muscle group names MUST be in Arabic as specified above.
        *   **Exercise Names:** All exercise names must be in clear, standard English.
        *   **GIF URL ('imageUrl'):** For EACH exercise, you MUST find a high-quality, smoothly looping animated GIF that clearly demonstrates the correct form. The URL must be direct and functional.
        *   **YouTube URL ('youtubeUrl'):** For EACH exercise, you MUST find a high-quality, instructional YouTube video link from a reputable fitness channel (e.g., Scott Herman Fitness, Jeff Nippard, Athlean-X, Built with Science, etc.). The video should be a tutorial, not just a demonstration.

    4.  **Output Format:** The entire response must be a single, valid JSON object that strictly conforms to the provided schema, with the root key being "database". Do not include any text or explanations outside of the JSON structure.
`;

export const getFoodAnalysisSchema = () => ({
    type: Type.OBJECT,
    properties: {
        totalCalories: { type: Type.NUMBER },
        totalMacros: {
            type: Type.OBJECT,
            properties: { protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } },
        },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the food item in Arabic." },
                    calories: { type: Type.NUMBER },
                    weightGrams: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fats: { type: Type.NUMBER },
                },
            }
        },
        summary: { type: Type.STRING, description: "A brief analytical summary of the meal in Arabic." }
    },
    required: ["totalCalories", "totalMacros", "items", "summary"]
});
export const getFoodAnalysisPrompt = () => `
    You are a precise nutrition expert. Analyze this meal image.
    1. Identify every ingredient and name it in Arabic.
    2. Estimate the weight of each ingredient in grams.
    3. Calculate calories and macros for each ingredient and the total.
    4. Provide a brief summary in Arabic.
    5. Your response must be a valid JSON object.`;


export const getCardioLibrarySchema = () => ({
    type: Type.OBJECT,
    properties: {
        library: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the cardio exercise in Arabic." },
                    description: { type: Type.STRING, description: "A brief description and benefits of the exercise in Arabic." },
                    imageUrl: { type: Type.STRING },
                    primaryMetrics: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
            },
        }
    },
    required: ["library"],
});
export const getCardioLibraryPrompt = () => `
    You are a cardio expert. Create a library of common cardio exercises in Arabic.
    1. List exercises like 'الجري على جهاز المشي', 'الدراجة الثابتة', etc.
    2. For each, provide a name (in Arabic), description (in Arabic), image URL, and primary metrics ('duration', 'distance', 'calories').
    3. The response must be a JSON object with a "library" key.`;

export const getEgyptianFoodLibrarySchema = () => ({
    type: Type.OBJECT,
    properties: {
        library: {
            type: Type.ARRAY,
            description: "A comprehensive list of Egyptian food categories.",
            items: {
                type: Type.OBJECT,
                properties: {
                    categoryName: { type: Type.STRING, description: "Name of the food category in Arabic." },
                    items: {
                        type: Type.ARRAY,
                        description: "List of food items in this category.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Name of the food item in Arabic." },
                                servingSize: { type: Type.STRING, description: "Typical serving size in Arabic (e.g., '1 طبق متوسط', '1 قطعة')." },
                                calories: { type: Type.STRING, description: "Estimated calories per serving (e.g., '~350 سعرة')." },
                                protein: { type: Type.STRING, description: "Estimated protein in grams (e.g., '~25 جم')." },
                                carbs: { type: Type.STRING, description: "Estimated carbohydrates in grams (e.g., '~40 جم')." },
                                fats: { type: Type.STRING, description: "Estimated fats in grams (e.g., '~15 جم')." },
                                imageUrl: { type: Type.STRING, description: "A direct URL to a high-quality image of the food item." },
                            },
                            required: ["name", "servingSize", "calories", "imageUrl"],
                        },
                    },
                },
                required: ["categoryName", "items"],
            },
        }
    },
    required: ["library"],
});

export const getEgyptianFoodLibraryPrompt = () => `
    You are an expert on Egyptian cuisine and nutrition. Your task is to generate a truly comprehensive encyclopedia of Egyptian food culture.
    
    **VERY IMPORTANT INSTRUCTIONS:**
    1.  **Language:** ALL text output (category names, item names, serving sizes, etc.) MUST be in **Arabic**.
    2.  **Categories:** Organize the food items into diverse categories in Arabic. DO NOT just list main dishes. Include:
        *   'أطباق رئيسية' (Main Dishes)
        *   'أكلات شعبية' (Street Food like Koshary, Hawawshi, Liver sandwiches)
        *   'مشويات' (Grills)
        *   'إفطار' (Breakfast - Foul, Taameya, Cheese with tomato)
        *   'مقبلات وسلطات' (Appetizers & Salads like Baba Ghannoug)
        *   'حلويات شرقية' (Eastern Desserts like Kunafa, Basbousa)
        *   'مشروبات' (Drinks like Sugarcane juice, Sobia, Sahlab)
        *   'مخبوزات' (Baked Goods like Feteer Meshaltet)
    3.  **Food Items:** Provide at least 5-6 popular items per category.
    4.  **Details:** For each item provide:
        *   'name': The name of the dish in Arabic.
        *   'servingSize': A typical serving size in Arabic.
        *   'calories': An estimated calorie count.
        *   'protein', 'carbs', 'fats': Estimated macronutrients.
        *   'imageUrl': You MUST find a high-quality, appetizing, and direct URL to an image for EACH food item.
    5.  **Output Format:** The entire response must be a single, valid JSON object that strictly conforms to the provided schema, with the root key being "library".
`;

// NEW: Schema for searching a specific food item via AI
export const getFoodSearchSchema = () => ({
    type: Type.OBJECT,
    properties: {
        results: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    categoryName: { type: Type.STRING, description: "The likely category for this food." },
                    item: {
                         type: Type.OBJECT,
                         properties: {
                            name: { type: Type.STRING, description: "Name of the food item in Arabic." },
                            servingSize: { type: Type.STRING, description: "Typical serving size in Arabic." },
                            calories: { type: Type.STRING, description: "Estimated calories per serving." },
                            protein: { type: Type.STRING, description: "Estimated protein in grams." },
                            carbs: { type: Type.STRING, description: "Estimated carbohydrates in grams." },
                            fats: { type: Type.STRING, description: "Estimated fats in grams." },
                            imageUrl: { type: Type.STRING, description: "A direct URL to a high-quality image of the food item." },
                        },
                        required: ["name", "servingSize", "calories", "imageUrl"]
                    }
                },
                required: ["categoryName", "item"]
            }
        }
    },
    required: ["results"]
});

// NEW: Prompt for searching a specific food item via AI
export const getFoodSearchPrompt = (query: string) => `
    You are an expert on Egyptian and general nutrition. The user is searching for: "${query}".
    
    1.  Identify if this is a valid food item (Egyptian or international).
    2.  If valid, generate a detailed nutrition entry for it.
    3.  If the query implies multiple items (e.g. "fruit"), list a few popular ones.
    4.  Provide accurate calories, macros, and a serving size in Arabic.
    5.  Find a high-quality image URL for it.
    6.  Return the data as a valid JSON object strictly conforming to the schema. 
    7.  If the food is not recognized, return an empty array for results.
`;