import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const RecentResources = ({ limit = 6, gradeId = null, className = '' }) => {
    const { allResources } = useData();

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
            case 'textbook': return 'bi-book text-primary';
            case 'papers': return 'bi-file-text text-info';
            case 'notes': return 'bi-sticky text-warning';
            case 'videos': return 'bi-play-circle text-danger';
            default: return 'bi-file-earmark text-secondary';
        }
    };

    const getResourceLink = (resource) => {
        const grade = resource.grade || 'grade6'; // fallback
        const subjectParam = resource.subject ? `?subject=${resource.subject}` : '';
        switch (resource.resourceType) {
            case 'textbook': return `/grade/${grade}/textbooks${subjectParam}`;
            case 'papers': return `/grade/${grade}/papers${subjectParam}`;
            case 'notes': return `/grade/${grade}/notes${subjectParam}`;
            case 'videos': return `/grade/${grade}/videos${subjectParam}`;
            default: return `/grade/${grade}`;
        }
    };

    return (
        <div className={`recent-resources-section ${className}`}>
            <h3 className="mb-4 text-center">
                <i className="bi bi-clock-history me-2"></i>
                Recently Added Resources
            </h3>
            <div className="row g-4">
                {recentResources.map((resource) => (
                    <div key={resource.id} className="col-lg-4 col-md-6">
                        <Link to={getResourceLink(resource)} className="recent-resource-card text-decoration-none text-dark">
                            <div className="card h-100 border hover-shadow transition-all">
                                <div className="card-body">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="resource-icon me-3">
                                            <i className={`bi ${getResourceIcon(resource.resourceType)}`} style={{ fontSize: '2rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                            <span className="badge bg-light text-secondary mb-2 border">
                                                {resource.grade.replace('grade', 'Grade ').replace('al', 'A/L')}
                                            </span>
                                            <h6 className="card-title mb-1 text-truncate" title={resource.title || resource.name}>
                                                {resource.title || resource.name || 'Untitled'}
                                            </h6>
                                            <small className="text-muted d-block text-capitalize">
                                                {resource.subject} • {resource.resourceType}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <small className="text-muted">
                                            {/* Date removed as per request */}
                                        </small>
                                        <small className="text-primary fw-bold">
                                            View <i className="bi bi-arrow-right"></i>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <style>{`
        .hover-shadow:hover {
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          transform: translateY(-3px);
          border-color: var(--primary) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
        </div>
    );
};

export default RecentResources;
