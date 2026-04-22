/**
 * Dictionary mapping for primary resource categories.
 * Keys match the `type` string stored in Firestore.
 */

export const resourceTranslations = {
    textbooks: {
        english: "Textbooks",
        sinhala: "පෙළපොත්",
        tamil: "பாடப்புத்தகங்கள்"
    },
    notes: {
        english: "Short Notes",
        sinhala: "කෙටි සටහන්",
        tamil: "சிறு குறிப்புகள்"
    },
    papers: {
        english: "Past Papers",
        sinhala: "පසුගිය ප්‍රශ්න පත්‍ර",
        tamil: "பழைய வினாத்தாள்கள்"
    },
    videos: {
        english: "Videos",
        sinhala: "වීඩියෝ",
        tamil: "காணொளிகள்"
    },
};

/**
 * Helper to extract the correct string based on the active UI language.
 * Fallbacks to english if mapping is missing, or null if completely unknown.
 */
export const getResourceTypeName = (type, currentLanguage) => {
    if (!resourceTranslations[type]) {
        // Return null instead of a formatted ID, so components can fall back to db names
        return null;
    }
    return resourceTranslations[type][currentLanguage] || resourceTranslations[type].english;
};
