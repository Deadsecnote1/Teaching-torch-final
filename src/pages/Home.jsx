import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Languages, Smartphone, Edit, Trash2, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import AdSenseComponent from '../components/common/AdSenseComponent';
import MetadataEditorModal from '../components/admin/MetadataEditorModal';
import SplashScreen from '../components/common/SplashScreen';
import toast from 'react-hot-toast';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Container, Section, Grid } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const Home = () => {
  useDocumentTitle('Home');
  const { grades, gradesLoading, updateGrade, deleteGrade } = useData();
  const { isManageMode } = useAuth();
  
  const [metadataModal, setMetadataModal] = useState({
    isOpen: false,
    initialData: null,
    type: 'grade',
    key: null
  });

  if (gradesLoading) return <SplashScreen />;

  const features = [
    {
      icon: Download,
      title: "Free Downloads",
      description: "All resources are completely free to download and use for educational purposes."
    },
    {
      icon: Languages,
      title: "Multi-Language",
      description: "Resources available in Sinhala, Tamil, and English to serve all Sri Lankan students."
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access your study materials anytime, anywhere on any device."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 border-b border-border">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/95 to-primary-dark/95 mix-blend-multiply z-10" />
          <img 
            src="/bg1-medium.webp" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-success/10 blur-[100px]" />
        </div>

        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Welcome to <span className="text-white bg-clip-text">Teaching Torch</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/80 mb-10">
              Your ultimate hub for free educational resources for Sri Lankan students. 
              Find textbooks, past papers, notes, and video tutorials all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#grades" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all duration-300 bg-primary text-white hover:bg-primary-dark hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore Grades <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Hero Ad Unit */}
      <div className="container-modern mt-8">
        <AdSenseComponent slot="HOME_HERO_AD_SLOT" />
      </div>

      {/* Grades Section */}
      <Section id="grades" title="Choose Your Grade" description="Select your grade level to browse available resources.">
        <Grid cols={3} gap={6}>
          {Object.entries(grades).sort((a, b) => {
            const orderA = a[1].order !== undefined && a[1].order !== '' ? parseInt(a[1].order, 10) : 999;
            const orderB = b[1].order !== undefined && b[1].order !== '' ? parseInt(b[1].order, 10) : 999;
            if (orderA !== orderB) return orderA - orderB;
            const numA = parseInt(a[0].replace('grade', '')) || 999;
            const numB = parseInt(b[0].replace('grade', '')) || 999;
            return numA - numB;
          }).map(([key, gradeData], index) => {
            
            let iconText = gradeData.display;
            if (key.startsWith('grade')) iconText = key.replace('grade', '');
            else if (key === 'al') iconText = 'A/L';
            else {
              const words = gradeData.display.split(' ');
              if (words.length > 1) iconText = words[0][0].toUpperCase() + words[1][0].toUpperCase();
              else iconText = words[0].substring(0, 2).toUpperCase();
            }

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative h-full"
              >
                {isManageMode && (
                  <div className="absolute top-3 right-3 z-20 flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow-sm hover:text-info"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMetadataModal({ isOpen: true, initialData: gradeData, type: 'grade', key: key });
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="danger"
                      className="h-8 w-8 rounded-full shadow-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${gradeData.display}" and ALL its resources? This cannot be undone.`)) {
                            deleteGrade(key)
                              .then(() => toast.success('Deleted Grade'))
                              .catch(() => toast.error('Failed to delete grade'));
                          }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <Link to={key === 'al' ? '/al' : `/grade/${key}`} className="block h-full group">
                  <Card className="h-full flex flex-col items-center justify-center p-8 text-center border-border hover:border-primary transition-all duration-300 group-hover:shadow-xl relative overflow-hidden group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div 
                      className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300"
                      style={gradeData.color ? { backgroundColor: `var(--${gradeData.color})`, color: '#fff' } : {}}
                    >
                      <span className="text-3xl font-extrabold">{iconText}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-text-primary mb-3 relative z-10">{gradeData.display}</h3>
                    
                    <span className="inline-flex items-center text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition-all">
                      View Resources <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
          
          {/* Static A/L Card - Only render if not already in grades */}
          {!grades['al'] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative h-full"
            >
              <Link to="/al" className="block h-full group">
                <Card className="h-full flex flex-col items-center justify-center p-8 text-center border-border hover:border-primary transition-all duration-300 group-hover:shadow-xl relative overflow-hidden group-hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-extrabold">A/L</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3 relative z-10">Advanced Level</h3>
                  <span className="inline-flex items-center text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition-all">
                    View Resources <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            </motion.div>
          )}

        </Grid>
      </Section>

      {/* Features Section */}
      <section className="bg-bg-secondary py-16 sm:py-24 border-y border-border">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">Why Choose Teaching Torch?</h2>
          </div>
          
          <Grid cols={3} gap={8}>
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-8 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Footer Ad Unit */}
      <div className="container-modern my-12">
        <AdSenseComponent slot="HOME_FOOTER_AD_SLOT" />
      </div>

      {/* Metadata Editor Modal */}
      <MetadataEditorModal
        isOpen={metadataModal.isOpen}
        onClose={() => setMetadataModal({ ...metadataModal, isOpen: false })}
        onSave={async (updatedData) => {
          try {
            await updateGrade(metadataModal.key, updatedData);
            toast.success('Grade Updated');
          } catch {
            toast.error('Failed to update grade');
          }
        }}
        title="Edit Grade"
        initialData={metadataModal.initialData}
        type="grade"
      />
    </div>
  );
};

export default Home;