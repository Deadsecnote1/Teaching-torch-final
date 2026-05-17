import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../features/ol';
import { Mail, MessageCircle, MapPin, CheckCircle, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';
import { Container, Section, Grid } from '../components/ui/Layout';
import { Card, CardContent } from '../components/ui/Card';

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
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Page Header */}
      <header className="bg-slate-900 text-center py-16 text-white border-b border-slate-800">
        <Container>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-lg mt-3 text-slate-300 max-w-2xl mx-auto">Have questions? We're here to help you.</p>
        </Container>
      </header>

      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b border-border py-3">
        <Container>
          <nav className="flex items-center text-sm font-medium text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
            <span className="text-primary">Contact Us</span>
          </nav>
        </Container>
      </div>

      {/* Contact Content */}
      <Section className="py-16">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-1/3">
              <h3 className="text-2xl font-extrabold text-text-primary mb-4">Get in Touch</h3>
              <p className="text-text-muted mb-8">
                Use the information below to reach out to us directly or fill out the contact form.
              </p>

              <div className="space-y-6">
                <div className="flex items-start p-4 bg-bg-secondary rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mr-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-text-primary">Email Us</h5>
                    <p className="text-primary text-sm font-medium">{settings?.email || 'teachingtorchlk@gmail.com'}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-bg-secondary rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 mr-4">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-text-primary">WhatsApp</h5>
                    <p className="text-success text-sm font-medium">{settings?.whatsapp || '+94 7X XXX XXXX'}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-bg-secondary rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center flex-shrink-0 mr-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-text-primary">Location</h5>
                    <p className="text-warning text-sm font-medium">Sri Lanka (Online Support)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <Card className="border-border shadow-lg h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-extrabold text-text-primary mb-6">Send us a Message</h3>

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg mb-6 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="font-medium text-sm">Thank you for your message! We'll get back to you as soon as possible.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg mb-6 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="font-medium text-sm">Something went wrong. Please try again or contact us via email.</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-text-primary mb-1.5">Subject *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-1.5">Your Message *</label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all shadow-md flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Sending...</>
                        ) : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="py-16 bg-bg-secondary border-t border-border mt-auto">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-text-primary">Frequently Asked Questions</h2>
            </div>

            <Grid cols={2} gap={8}>
              <div className="col-span-1 sm:col-span-2 md:col-span-1 bg-bg-primary p-6 rounded-xl border border-border">
                <h6 className="font-bold text-text-primary mb-3 flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  How do I download resources?
                </h6>
                <p className="text-text-muted text-sm ml-7">Simply click on the "Download" button on any resource card. It will open the file in a new tab where you can save it.</p>
              </div>
              <div className="col-span-1 sm:col-span-2 md:col-span-1 bg-bg-primary p-6 rounded-xl border border-border">
                <h6 className="font-bold text-text-primary mb-3 flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  Are all resources really free?
                </h6>
                <p className="text-text-muted text-sm ml-7">Yes, Teaching Torch is dedicated to providing free education. All materials are available at no cost.</p>
              </div>
              <div className="col-span-1 sm:col-span-2 md:col-span-1 bg-bg-primary p-6 rounded-xl border border-border">
                <h6 className="font-bold text-text-primary mb-3 flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  Can I contribute resources?
                </h6>
                <p className="text-text-muted text-sm ml-7">Currently, only administrators can upload files. However, you can contact us if you have high-quality materials to share.</p>
              </div>
              <div className="col-span-1 sm:col-span-2 md:col-span-1 bg-bg-primary p-6 rounded-xl border border-border">
                <h6 className="font-bold text-text-primary mb-3 flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  Is there a mobile app?
                </h6>
                <p className="text-text-muted text-sm ml-7">Our website is fully optimized for mobile devices. You can add it to your home screen for easy access.</p>
              </div>
            </Grid>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Contact;