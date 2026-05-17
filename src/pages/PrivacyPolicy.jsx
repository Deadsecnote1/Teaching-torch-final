import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Shield, ChevronRight } from 'lucide-react';
import { Container, Section } from '../components/ui/Layout';
import { Card, CardContent } from '../components/ui/Card';

const PrivacyPolicy = () => {
  useDocumentTitle('Privacy Policy');

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Page Header */}
      <header className="bg-slate-900 text-center py-16 text-white border-b border-slate-800">
        <Container>
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-lg mt-3 text-slate-300 max-w-2xl mx-auto">How we protect and handle your information</p>
        </Container>
      </header>

      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b border-border py-3">
        <Container>
          <nav className="flex items-center text-sm font-medium text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
            <span className="text-primary">Privacy Policy</span>
          </nav>
        </Container>
      </div>

      <Section className="py-16">
        <Container className="max-w-4xl mx-auto">
          <Card className="border-border shadow-sm">
            <CardContent className="p-8 md:p-12 prose prose-invert max-w-none prose-p:text-text-muted prose-headings:text-text-primary">
              <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
              <p className="mb-6">
                Welcome to Teaching Torch. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                and tell you about your privacy rights.
              </p>

              <h2 className="text-2xl font-bold mb-6 mt-10">2. The Data We Collect</h2>
              <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-text-muted">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 mt-10">3. How We Use Your Data</h2>
              <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-text-muted">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 mt-10">4. Data Security</h2>
              <p className="mb-6">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
                used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data 
                to those employees, agents, contractors and other third parties who have a business need to know.
              </p>

              <h2 className="text-2xl font-bold mb-6 mt-10">5. Data Retention</h2>
              <p className="mb-6">
                We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, 
                including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>

              <h2 className="text-2xl font-bold mb-6 mt-10">6. Your Legal Rights</h2>
              <p className="mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
              <ul className="list-disc pl-6 mb-8 space-y-2 text-text-muted">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>

              <div className="bg-bg-secondary p-6 rounded-xl border border-border mt-10">
                <h3 className="text-xl font-bold mb-3">Contact Us</h3>
                <p className="mb-0 text-text-muted">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at: <br/>
                  <strong>Email:</strong> privacy@teachingtorch.lk
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </div>
  );
};

export default PrivacyPolicy;
