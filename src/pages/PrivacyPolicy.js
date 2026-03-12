import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Privacy Policy</h1>
          <p className="lead">How we handle and protect your information</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Privacy Policy
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  <p className="text-muted mb-4">Last Updated: March 12, 2026</p>

                  <h2 className="h4 mb-3">1. Introduction</h2>
                  <p className="mb-4">
                    Welcome to Teaching Torch. We value your privacy and are committed to protecting your personal data. 
                    This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                  </p>

                  <h2 className="h4 mb-3">2. Information Collection</h2>
                  <p className="mb-4">
                    We may collect information that your browser sends whenever you visit our website. 
                    This data may include information such as your computer's Internet Protocol ("IP") address, 
                    browser type, browser version, the pages of our website that you visit, the time and date of your visit, 
                    and other statistics.
                  </p>

                  <h2 className="h4 mb-3">3. Google AdSense & Cookies</h2>
                  <div className="alert alert-info mb-4">
                    <strong>Important Disclosure for Advertising:</strong>
                    <p className="mt-2 mb-0">
                      We use Google AdSense to serve ads on our website. As a third-party vendor, Google uses cookies 
                      to serve ads on your site based on your prior visits to our website or other websites. 
                      Google's use of advertising cookies enables it and its partners to serve ads to our users 
                      based on their visit to our sites and/or other sites on the Internet.
                    </p>
                  </div>
                  <p className="mb-4">
                    Users may opt out of personalized advertising by visiting 
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="ms-1">Google Ad Settings</a>. 
                    Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting 
                    <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="ms-1">www.aboutads.info</a>.
                  </p>

                  <h2 className="h4 mb-3">4. How We Use Information</h2>
                  <p className="mb-4">
                    The information we collect is used to:
                  </p>
                  <ul className="mb-4">
                    <li>Provide, maintain, and improve our website services.</li>
                    <li>Analyze how our website is used to enhance user experience.</li>
                    <li>Communicate with you if you contact us through our form.</li>
                    <li>Show relevant advertisements through our partners.</li>
                  </ul>

                  <h2 className="h4 mb-3">5. Data Security</h2>
                  <p className="mb-4">
                    The security of your data is important to us, but remember that no method of transmission over 
                    the Internet or method of electronic storage is 100% secure. While we strive to use 
                    commercially acceptable means to protect your information, we cannot guarantee its absolute security.
                  </p>

                  <h2 className="h4 mb-3">6. Links to Other Sites</h2>
                  <p className="mb-4">
                    Our website contains links to other sites (like Google Drive for resource downloads). 
                    If you click on a third-party link, you will be directed to that site. We strongly advise 
                    you to review the Privacy Policy of every site you visit.
                  </p>

                  <h2 className="h4 mb-3">7. Contact Us</h2>
                  <p className="mb-0">
                    If you have any questions about this Privacy Policy, please contact us through our 
                    <Link to="/contact" className="ms-1">Contact Page</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
