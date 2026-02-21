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
          <p className="lead">We'd love to hear from you. Get in touch with our team.</p>
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
                Contact
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
                  Have questions, suggestions, or need help? We're here to assist you with
                  all your educational resource needs.
                </p>

                <div className="contact-methods">
                  <div className="contact-info mb-4">
                    <i className="bi bi-envelope-fill text-primary"></i>
                    <h5>Email Us</h5>
                    <p className="text-primary">{settings?.email || 'Not configured'}</p>
                    <p className="small text-muted">We typically respond within 24 hours</p>
                  </div>

                  <div className="contact-info mb-4">
                    <i className="bi bi-telephone-fill text-success"></i>
                    <h5>Call Us</h5>
                    <p className="text-success">{settings?.phone || 'Not configured'}</p>
                    <p className="small text-muted">Monday - Friday, 9:00 AM - 5:00 PM</p>
                  </div>

                  <div className="contact-info mb-4">
                    <i className="bi bi-geo-alt-fill text-warning"></i>
                    <h5>Visit Us</h5>
                    <p className="text-warning">Colombo, Sri Lanka</p>
                    <p className="small text-muted">By appointment only</p>
                  </div>

                  <div className="contact-info">
                    <i className="bi bi-chat-dots-fill text-info"></i>
                    <h5>Social Media</h5>
                    <div className="social-links mt-2">
                      {settings?.facebook && (
                        <a href={settings.facebook} className="text-primary me-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i>
                        </a>
                      )}
                      {settings?.whatsapp && (
                        <a href={`https://wa.me/${settings.whatsapp}`} className="text-success" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                          <i className="bi bi-whatsapp" style={{ fontSize: '1.5rem' }}></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="contact-form-section">
                <div className="card">
                  <div className="card-body p-4">
                    <h3 className="card-title mb-4">Send us a Message</h3>

                    {/* Success/Error Messages */}
                    {submitStatus === 'success' && (
                      <div className="alert alert-success" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Thank you for your message! We'll get back to you soon.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        There was an error sending your message. Please try again.
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        {/* User Type */}
                        <div className="col-12">
                          <label htmlFor="userType" className="form-label">I am a</label>
                          <select
                            className="form-select"
                            id="userType"
                            name="userType"
                            value={formData.userType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="student">Student</option>
                            <option value="parent">Parent</option>
                            <option value="teacher">Teacher</option>
                            <option value="school">School Representative</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Name */}
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email address"
                          />
                        </div>

                        {/* Subject */}
                        <div className="col-12">
                          <label htmlFor="subject" className="form-label">Subject *</label>
                          <select
                            className="form-select"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="content">Content Request</option>
                            <option value="feedback">Feedback</option>
                            <option value="partnership">Partnership</option>
                            <option value="bug">Report a Bug</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Message */}
                        <div className="col-12">
                          <label htmlFor="message" className="form-label">Message *</label>
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows="6"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            placeholder="Please describe your inquiry in detail..."
                          ></textarea>
                          <div className="form-text">
                            Please provide as much detail as possible to help us assist you better.
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-send me-2"></i>
                                Send Message
                              </>
                            )}
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
                  <p className="text-muted">Quick answers to common questions</p>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>Are all resources really free?</h6>
                      <p>Yes! All our educational resources are completely free to download and use. We believe in accessible education for everyone.</p>
                    </div>

                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>How often do you add new content?</h6>
                      <p>We regularly update our content and add new resources. Follow us on social media for the latest updates and announcements.</p>
                    </div>

                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>Can I contribute resources?</h6>
                      <p>We welcome contributions from educators and experts. Please contact us to discuss how you can help expand our resource library.</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>Do you cover all subjects?</h6>
                      <p>We're continuously expanding our subject coverage. Currently, we focus on core subjects with plans to add more specialized subjects.</p>
                    </div>

                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>How can I report an issue?</h6>
                      <p>You can report any technical issues or content problems using our contact form above, selecting "Report a Bug" as the subject.</p>
                    </div>

                    <div className="faq-item">
                      <h6><i className="bi bi-question-circle text-primary me-2"></i>Is the website mobile-friendly?</h6>
                      <p>Absolutely! Our website is fully responsive and works seamlessly on all devices - phones, tablets, and computers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-4">
        <div className="container">
          <div className="text-center">
            <p className="mb-3">Looking for something specific?</p>
            <div className="quick-links">
              <Link to="/" className="btn btn-outline-primary me-2 mb-2">
                <i className="bi bi-house me-1"></i>Home
              </Link>
              <Link to="/about" className="btn btn-outline-primary me-2 mb-2">
                <i className="bi bi-info-circle me-1"></i>About Us
              </Link>
              <Link to="/grade/grade6" className="btn btn-outline-primary me-2 mb-2">
                <i className="bi bi-book me-1"></i>Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;