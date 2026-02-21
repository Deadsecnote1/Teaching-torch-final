import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
    const sizeClasses = {
        small: 'spinner-border-sm',
        medium: '',
        large: 'spinner-border-lg' // Bootstrap doesn't have lg by default but we can add or use style
    };

    const pixelSize = {
        small: '1rem',
        medium: '2rem',
        large: '3rem'
    };

    return (
        <div className="d-flex justify-content-center align-items-center p-3">
            <div
                className={`spinner-border text-${color} ${sizeClasses[size]}`}
                role="status"
                style={{ width: pixelSize[size], height: pixelSize[size] }}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
