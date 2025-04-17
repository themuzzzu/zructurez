
import { pipeline } from "@huggingface/transformers";
import { translations } from "@/translations";

// Supported language pairs for translation
const SUPPORTED_LANGUAGE_MODELS: Record<string, string> = {
  "english-hindi": "Helsinki-NLP/opus-mt-en-hi",
  "english-tamil": "Helsinki-NLP/opus-mt-en-ta", 
  "english-telugu": "Helsinki-NLP/opus-mt-en-te",
  "english-kannada": "Helsinki-NLP/opus-mt-en-kn",
  "english-malayalam": "Helsinki-NLP/opus-mt-en-ml",
  "english-urdu": "Helsinki-NLP/opus-mt-en-ur"
};

// Cache for translated strings to avoid redundant API calls
const translationCache: Record<string, Record<string, string>> = {};

// Initialize models on demand to save resources
let translationModels: Record<string, any> = {};

export type Language = "english" | "hindi" | "telugu" | "tamil" | "kannada" | "malayalam" | "urdu";

/**
 * Gets translation for a key, either from cache, static translations, or using ML model
 */
export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  // Return original text if target language is English
  if (targetLanguage === "english") {
    return text;
  }
  
  // Check if we already have a static translation
  if (translations[targetLanguage] && translations[targetLanguage][text]) {
    return translations[targetLanguage][text];
  }
  
  // Check cache first to avoid redundant translations
  if (translationCache[targetLanguage] && translationCache[targetLanguage][text]) {
    return translationCache[targetLanguage][text];
  }
  
  // For short phrases (< 4 words), we can try to find similar translations
  if (text.split(' ').length < 4) {
    // Look for partial matches in existing translations
    const staticTranslations = translations[targetLanguage];
    for (const key in staticTranslations) {
      if (key.toLowerCase().includes(text.toLowerCase()) || 
          text.toLowerCase().includes(key.toLowerCase())) {
        // Initialize cache for this language if it doesn't exist
        if (!translationCache[targetLanguage]) {
          translationCache[targetLanguage] = {};
        }
        // Cache this translation
        translationCache[targetLanguage][text] = staticTranslations[key];
        return staticTranslations[key];
      }
    }
  }
  
  // Fall back to ML translation for dynamic content
  try {
    const modelKey = `english-${targetLanguage}`;
    const modelName = SUPPORTED_LANGUAGE_MODELS[modelKey];
    
    if (!modelName) {
      console.warn(`No translation model available for ${modelKey}`);
      return text;
    }
    
    // Initialize model if not already loaded
    if (!translationModels[modelKey]) {
      try {
        console.log(`Loading translation model for ${targetLanguage}...`);
        translationModels[modelKey] = await pipeline('translation', modelName, { 
          revision: 'main',
          quantized: true // Use quantized model for better performance
        });
        console.log(`Translation model for ${targetLanguage} loaded successfully`);
      } catch (error) {
        console.error(`Failed to load translation model for ${targetLanguage}:`, error);
        return text;
      }
    }
    
    // Translate the text
    const result = await translationModels[modelKey](text, {
      max_length: 100
    });
    
    const translatedText = result[0].translation_text;
    
    // Cache the translation
    if (!translationCache[targetLanguage]) {
      translationCache[targetLanguage] = {};
    }
    translationCache[targetLanguage][text] = translatedText;
    
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fall back to original text if translation fails
  }
}

/**
 * Preloads common UI terms for smoother experience
 */
export async function preloadCommonTranslations(targetLanguage: Language): Promise<void> {
  if (targetLanguage === "english") return;
  
  const commonTerms = [
    "Home", "Search", "Settings", "Profile", "Back", "Next",
    "Cancel", "Save", "Delete", "Edit", "Menu", "Close"
  ];
  
  try {
    // Translate common terms in batch to improve efficiency
    await Promise.all(commonTerms.map(term => translateText(term, targetLanguage)));
    console.log(`Preloaded ${commonTerms.length} common terms for ${targetLanguage}`);
  } catch (error) {
    console.error("Error preloading translations:", error);
  }
}

/**
 * Utility function to detect if text is already in the target language
 */
export function isAlreadyInTargetLanguage(text: string, targetLanguage: Language): boolean {
  // Basic heuristic - check if the text exists in the translations object
  for (const key in translations[targetLanguage]) {
    if (translations[targetLanguage][key] === text) {
      return true;
    }
  }
  return false;
}

/**
 * Cleanup function to free memory when language is changed
 */
export function cleanupUnusedModels(currentLanguage: Language): void {
  const neededModel = `english-${currentLanguage}`;
  
  // Clean up models that aren't the current language to save memory
  Object.keys(translationModels).forEach(modelKey => {
    if (modelKey !== neededModel && modelKey !== "english-english") {
      console.log(`Cleaning up unused translation model: ${modelKey}`);
      translationModels[modelKey] = null;
      delete translationModels[modelKey];
    }
  });
}
