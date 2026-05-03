import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Contact = () => {
  const { settings } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'student'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    try {
      // In a real app, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        userType: 'student'
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <p className="lead">Have questions? We're here to help you.</p>
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
                Contact Us
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Contact Information */}
            <div className="col-lg-4">
              <div className="contact-info-section">
                <h3 className="mb-4">Get in Touch</h3>
                <p className="text-muted mb-4">
                  Use the information below to reach out to us directly or fill out the contact form.
                </p>

                <div className="contact-methods">
                  <div className="contact-info mb-4">
                    <i className="bi bi-envelope-fill text-primary"></i>
                    <h5>Email Us</h5>
                    <p className="text-primary">{settings?.email || 'teachingtorchlk@gmail.com'}</p>
                  </div>

                  <div className="contact-info mb-4">
                    <i className="bi bi-whatsapp text-success"></i>
                    <h5>WhatsApp</h5>
                    <p className="text-success">{settings?.whatsapp || '+94 7X XXX XXXX'}</p>
                  </div>

                  <div className="contact-info mb-4">
                    <i className="bi bi-geo-alt-fill text-warning"></i>
                    <h5>Location</h5>
                    <p className="text-warning">Sri Lanka (Online Support)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="contact-form-section">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <h3 className="card-title mb-4">Send us a Message</h3>

                    {/* Success/Error Messages */}
                    {submitStatus === 'success' && (
                      <div className="alert alert-success" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Thank you for your message! We'll get back to you as soon as possible.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Something went wrong. Please try again or contact us via email.
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        {/* Name */}
                        <div className="col-md-12">
                          <label htmlFor="name" className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        {/* Email */}
                        <div className="col-md-12">
                          <label htmlFor="email" className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        {/* Subject */}
                        <div className="col-12">
                          <label htmlFor="subject" className="form-label">Subject *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        {/* Message */}
                        <div className="col-12">
                          <label htmlFor="message" className="form-label">Your Message *</label>
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows="6"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                          ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="faq-section">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="text-center mb-5">
                  <h2>Frequently Asked Questions</h2>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>How do I download resources?</h6>
                      <p>Simply click on the "Download" button on any resource card. It will open the file in a new tab where you can save it.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>Are all resources really free?</h6>
                      <p>Yes, Teaching Torch is dedicated to providing free education. All materials are available at no cost.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>Can I contribute resources?</h6>
                      <p>Currently, only administrators can upload files. However, you can contact us if you have high-quality materials to share.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>Is there a mobile app?</h6>
                      <p>Our website is fully optimized for mobile devices. You can add it to your home screen for easy access.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;