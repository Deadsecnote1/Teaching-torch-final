import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { getResourceTypeName } from '../../utils/resourceTranslations';
import { History, Book, FileText, StickyNote, PlayCircle, File, ArrowRight } from 'lucide-react';

const RecentResources = ({ limit = 6, gradeId = null, className = '' }) => {
    const { allResources, grades, subjects, resourceTypes } = useData();
    const { selectedLanguage } = useLanguage();

    const translations = {
        english: { title: 'Recently Added Resources', view: 'View' },
        sinhala: { title: 'මෑතකදී එක් කරන ලද සම්පත්', view: 'බලන්න' },
        tamil: { title: 'சமீபத்தில் சேர்க்கப்பட்ட வளங்கள்', view: 'பார்க்க' }
    };
    const t = translations[selectedLanguage] || translations.english;

    const recentResources = useMemo(() => {
        if (!allResources) return [];

        let filtered = [...allResources];

        // Filter by grade if provided
        if (gradeId) {
            filtered = filtered.filter(r => r.grade === gradeId);
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => {
            const dateA = new Date(a.uploadDate || 0);
            const dateB = new Date(b.uploadDate || 0);
            return dateB - dateA;
        }).slice(0, limit);
    }, [allResources, gradeId, limit]);

    if (recentResources.length === 0) {
        return null; // Don't show anything if no resources
    }

    const getResourceIcon = (type) => {
        switch (type) {
            case 'textbooks': return <Book className="w-8 h-8 text-primary" />;
            case 'papers': return <FileText className="w-8 h-8 text-info" />;
            case 'notes': return <StickyNote className="w-8 h-8 text-warning" />;
            case 'videos': return <PlayCircle className="w-8 h-8 text-danger" />;
            default: return <File className="w-8 h-8 text-text-muted" />;
        }
    };

    const getResourceLink = (resource) => {
        const grade = resource.grade || 'grade6'; // fallback
        const subjectParam = resource.subject ? `?subject=${resource.subject}` : '';
        switch (resource.resourceType) {
            case 'textbooks': return `/grade/${grade}/textbooks${subjectParam}`;
            case 'papers': return `/grade/${grade}/papers${subjectParam}`;
            case 'notes': return `/grade/${grade}/notes${subjectParam}`;
            case 'videos': return `/grade/${grade}/videos${subjectParam}`;
            default: return `/grade/${grade}`;
        }
    };

    return (
        <div className={`py-8 ${className}`}>
            <h3 className="mb-6 text-center text-2xl font-bold text-text-primary flex items-center justify-center">
                <History className="w-6 h-6 mr-2 text-primary" />
                {t.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentResources.map((resource) => (
                    <Link key={resource.id} to={getResourceLink(resource)} className="block group">
                        <div className="h-full bg-bg-secondary border border-border rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 flex flex-col">
                            <div className="flex items-start mb-4">
                                <div className="mr-4 flex-shrink-0">
                                    {getResourceIcon(resource.resourceType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-tertiary border border-border rounded mb-2">
                                        {grades[resource.grade]?.display || resource.grade}
                                    </span>
                                    <h6 className="font-bold text-text-primary mb-1 truncate" title={resource.title || resource.name}>
                                        {resource.title || resource.name || 'Untitled'}
                                    </h6>
                                    <p className="text-xs text-text-muted capitalize truncate">
                                        {(() => {
                                            const rt = resourceTypes?.find(t => t.id === resource.resourceType);
                                            const typeName = rt?.name?.[selectedLanguage] || getResourceTypeName(resource.resourceType, selectedLanguage) || rt?.name?.english || resource.resourceType;
                                            return `${subjects[resource.subject]?.display || resource.subject} • ${typeName}`;
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border flex justify-end items-center">
                                <span className="text-sm font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                                    {t.view} <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentResources;
