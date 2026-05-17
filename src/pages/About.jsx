import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Languages, Laptop, CheckCircle2, GraduationCap, ShieldCheck, Clock, Users, Unlock, Star, Globe, Lightbulb, Book, Mail, ChevronRight } from 'lucide-react';
import { Container, Section, Grid } from '../components/ui/Layout';
import { Card, CardContent } from '../components/ui/Card';

const About = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Page Header */}
      <header className="bg-slate-900 text-center py-16 text-white border-b border-slate-800">
        <Container>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Teaching Torch</h1>
          <p className="text-lg mt-3 text-slate-300 max-w-2xl mx-auto">Empowering Sri Lankan students with free educational resources</p>
        </Container>
      </header>

      {/* Breadcrumb */}
      <div className="bg-bg-secondary/50 border-b border-border">
        <Container className="py-3">
          <nav className="flex items-center text-sm font-medium text-text-muted whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-primary transition-colors flex items-center">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
            <span className="text-text-primary font-semibold">About Us</span>
          </nav>
        </Container>
      </div>

      {/* Mission Section */}
      <Section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary mb-4">Our Mission</h2>
            <p className="text-lg text-text-muted">
              To provide free, accessible, and comprehensive educational resources for all Sri Lankan students, breaking down barriers to quality education and fostering academic excellence across the nation.
            </p>
          </div>

          <Grid cols={3} gap={8}>
            <div className="col-span-1 sm:col-span-3 md:col-span-1">
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mb-6 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]">
                    <Heart className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3">Free Education</h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    We believe education should be accessible to everyone. All our resources are completely free to download and use, ensuring no student is left behind due to financial constraints.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 sm:col-span-3 md:col-span-1">
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]">
                    <Languages className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3">Multi-Medium Support</h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Recognizing Sri Lanka's linguistic diversity, we provide resources in Sinhala, Tamil, and English, ensuring every student can learn in their preferred language.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1 sm:col-span-3 md:col-span-1">
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-success/10 text-success rounded-2xl flex items-center justify-center mb-6 shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]">
                    <Laptop className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3">Digital Innovation</h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Leveraging modern technology to create an intuitive, mobile-friendly platform that makes learning resources available 24/7 to students across the island.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Vision Section */}
      <Section className="py-16 bg-bg-secondary border-y border-border">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-extrabold text-text-primary mb-6">Our Vision</h2>
              <div className="space-y-4 text-text-muted mb-8">
                <p>To become the leading digital educational platform in Sri Lanka, serving as the primary resource hub for students from Grade 6 to Advanced Level.</p>
                <p>We envision a future where every student has equal access to quality educational materials, regardless of their location or background.</p>
                <p>Through technology and community collaboration, we aim to bridge the educational gap and create equal opportunities for all students across the country.</p>
              </div>
              
              <h3 className="text-lg font-bold text-text-primary mb-4">What We Offer:</h3>
              <ul className="space-y-3">
                {[
                  "Complete textbook collections in all three languages",
                  "Past examination papers for practice",
                  "Concise chapter-wise study notes",
                  "Educational video lessons and tutorials",
                  "Mobile-friendly access anytime, anywhere"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-text-muted">
                    <CheckCircle2 className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2 flex justify-center mt-12 lg:mt-0">
              <div className="relative text-center">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0"></div>
                <div className="relative z-10">
                  <GraduationCap className="w-48 h-48 text-primary mx-auto opacity-90" />
                  <div className="mt-6">
                    <h4 className="text-2xl font-bold text-primary mb-2">Education for All</h4>
                    <p className="text-text-muted font-medium">Building a brighter future for Sri Lankan students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Commitment Section */}
      <Section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary mb-4">Our Commitment</h2>
            <p className="text-lg text-text-muted">Dedicated to excellence in educational support</p>
          </div>

          <Grid cols={3} gap={8}>
            <div className="col-span-1 sm:col-span-3 md:col-span-1">
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center bg-transparent">
                <CardContent className="p-8">
                  <ShieldCheck className="w-16 h-16 text-success mx-auto mb-6" />
                  <h5 className="text-xl font-bold text-text-primary mb-3">Quality Assurance</h5>
                  <p className="text-text-muted text-sm">All resources are carefully reviewed and aligned with the Sri Lankan curriculum to ensure accuracy and relevance.</p>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1 sm:col-span-3 md:col-span-1">
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center bg-transparent">
                <CardContent className="p-8">
                  <Clock className="w-16 h-16 text-info mx-auto mb-6" />
                  <h5 className="text-xl font-bold text-text-primary mb-3">Regular Updates</h5>
                  <p className="text-text-muted text-sm">We continuously add new resources and update existing content to keep pace with curriculum changes and student needs.</p>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1 sm:col-span-3 md:col-span-1">
              <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center bg-transparent">
                <CardContent className="p-8">
                  <Users className="w-16 h-16 text-warning mx-auto mb-6" />
                  <h5 className="text-xl font-bold text-text-primary mb-3">Community Driven</h5>
                  <p className="text-text-muted text-sm">Built by educators and students for the educational community, fostering collaboration and shared learning experiences.</p>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Values Section */}
      <Section className="py-16 bg-bg-secondary border-t border-border">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary mb-4">Our Values</h2>
            <p className="text-lg text-text-muted">The principles that guide everything we do</p>
          </div>

          <Grid cols={4} gap={6}>
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="text-center h-full p-6 bg-bg-primary rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-sm">
                <Unlock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h5 className="font-bold text-text-primary mb-2">Accessibility</h5>
                <p className="text-text-muted text-sm">Making quality education accessible to every student, regardless of economic background.</p>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="text-center h-full p-6 bg-bg-primary rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-sm">
                <Star className="w-12 h-12 text-warning mx-auto mb-4" />
                <h5 className="font-bold text-text-primary mb-2">Excellence</h5>
                <p className="text-text-muted text-sm">Striving for the highest quality in all our educational resources and services.</p>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="text-center h-full p-6 bg-bg-primary rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-sm">
                <Globe className="w-12 h-12 text-info mx-auto mb-4" />
                <h5 className="font-bold text-text-primary mb-2">Inclusivity</h5>
                <p className="text-text-muted text-sm">Embracing linguistic and cultural diversity to serve all Sri Lankan students.</p>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="text-center h-full p-6 bg-bg-primary rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-sm">
                <Lightbulb className="w-12 h-12 text-success mx-auto mb-4" />
                <h5 className="font-bold text-text-primary mb-2">Innovation</h5>
                <p className="text-text-muted text-sm">Leveraging technology to create better learning experiences for modern students.</p>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="py-16">
        <Container>
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white">Join Our Educational Journey</h2>
              <p className="text-lg md:text-xl mb-10 text-white/90">
                Whether you're a student seeking quality resources or an educator looking to support your students, Teaching Torch is here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-primary rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <Book className="w-5 h-5 mr-2" /> Explore Resources
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5 mr-2" /> Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default About;