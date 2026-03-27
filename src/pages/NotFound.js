import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container text-center py-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="error-page">
          <h1 className="display-1 text-primary">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="mb-4">The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default NotFound;
