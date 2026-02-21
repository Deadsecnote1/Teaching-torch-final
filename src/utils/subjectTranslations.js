export const subjectTranslations = {
    // Common subjects
    mathematics: {
        english: 'Mathematics',
        sinhala: 'ගණිතය',
        tamil: 'கணிதம்'
    },
    science: {
        english: 'Science',
        sinhala: 'විද්‍යාව',
        tamil: 'விஞ்ஞானம்'
    },
    history: {
        english: 'History',
        sinhala: 'ඉතිහාසය',
        tamil: 'வரலாறு'
    },
    geography: {
        english: 'Geography',
        sinhala: 'භූගෝල විද්‍යාව',
        tamil: 'புவியியல்'
    },
    english: {
        english: 'English Language',
        sinhala: 'ඉංග්‍රීසි භාෂාව',
        tamil: 'ஆங்கில மொழி'
    },
    sinhala: {
        english: 'Sinhala Language',
        sinhala: 'සිංහල භාෂාව',
        tamil: 'சிங்கள மொழி'
    },
    tamil: {
        english: 'Tamil Language',
        sinhala: 'දෙමළ භාෂාව',
        tamil: 'தமிழ் மொழி'
    },
    ict: {
        english: 'Information and Communication Technology (ICT)',
        sinhala: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය',
        tamil: 'தகவல் மற்றும் தகவல் தொடர்பு தொழில்நுட்பம்'
    },
    religion: {
        english: 'Religion',
        sinhala: 'ආගම',
        tamil: 'சமயம்'
    },
    civics: {
        english: 'Civic Education',
        sinhala: 'පුරවැසි අධ්‍යාපනය',
        tamil: 'குடியியல் கல்வி'
    },

    // A/L Streams
    biology: {
        english: 'Biology',
        sinhala: 'ජීව විද්‍යාව',
        tamil: 'உயிரியல்'
    },
    chemistry: {
        english: 'Chemistry',
        sinhala: 'රසායන විද්‍යාව',
        tamil: 'இரசாயனவியல்'
    },
    physics: {
        english: 'Physics',
        sinhala: 'භෞතික විද්‍යාව',
        tamil: 'பெளதிகவியல்'
    },
    combined_maths: {
        english: 'Combined Mathematics',
        sinhala: 'සංයුක්ත ගණිතය',
        tamil: 'இணைந்த கணிதம்'
    },
    accounting: {
        english: 'Accounting',
        sinhala: 'ගිණුම්කරණය',
        tamil: 'கணக்கீடு'
    },
    business_studies: {
        english: 'Business Studies',
        sinhala: 'ව්‍යාපාර අධ්‍යයනය',
        tamil: 'வர்த்தக கல்வி'
    },
    economics: {
        english: 'Economics',
        sinhala: 'ආර්ථික විද්‍යාව',
        tamil: 'பொருளியல்'
    },

    // Fallback function for prioritizing database names or unknown subjects
    getTranslatedName: (subjectId, subjectObj, language) => {
        // 1. Check if the database has a custom translation provided by the Admin
        if (language === 'sinhala' && subjectObj.nameSinhala) return subjectObj.nameSinhala;
        if (language === 'tamil' && subjectObj.nameTamil) return subjectObj.nameTamil;

        // 2. Fall back to the hardcoded dictionary
        if (subjectTranslations[subjectId]) {
            return subjectTranslations[subjectId][language] || subjectObj.name;
        }

        // 3. Fall back to default database name
        return subjectObj.name;
    }
};
