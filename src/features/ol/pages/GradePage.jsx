import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../../../context/DataContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getResourceTypeName } from '../../../utils/resourceTranslations';
import AdSenseComponent from '../../../components/common/AdSenseComponent';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { ChevronRight, ArrowRight, BookOpen, FileText, FileSignature, MonitorPlay, Mails, Archive } from 'lucide-react';
import { Container, Section, Grid } from '../../../components/ui/Layout';
import { Card, CardContent } from '../../../components/ui/Card';
import SplashScreen from '../../../components/common/SplashScreen';

const GradePage = () => {
  const { gradeId, streamId } = useParams();
  const { grades, gradesLoading } = useData();
  const { selectedLanguage } = useLanguage();

  const dynamicResourceTypes = [
    { id: 'textbooks', name: 'Textbooks', icon: 'book' },
    { id: 'papers', name: 'Past Papers', icon: 'archive' },
    { id: 'notes', name: 'Short Notes', icon: 'sticky-note' },
    { id: 'videos', name: 'Videos', icon: 'play-circle' }
  ];

  const targetGradeId = streamId || gradeId;
  const grade = grades[targetGradeId];
  const parentGrade = streamId ? grades[gradeId] : null;

  const gradeName = grade?.display || 'Grade';
  useDocumentTitle(gradeName);

  if (gradesLoading) {
    return <SplashScreen />;
  }

  if (!grade) {
    return (
      <Container className="py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Grade Not Found</h2>
        <p className="text-text-muted mb-8">The requested grade does not exist.</p>
        <Link to="/" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium transition-colors bg-primary text-white hover:bg-primary-dark">
          Go Home
        </Link>
      </Container>
    );
  }

  // Get the default 4 types, but allow dynamic ones as well
  const getIconForType = (type, fallbackIcon) => {
    switch (type) {
      case 'textbooks': return <BookOpen className="w-12 h-12 text-primary" />;
      case 'papers': return <FileSignature className="w-12 h-12 text-info" />;
      case 'notes': return <FileText className="w-12 h-12 text-warning" />;
      case 'videos': return <MonitorPlay className="w-12 h-12 text-danger" />;
      default: return <Archive className="w-12 h-12 text-success" />;
    }
  };

  const getDescForType = (type) => {
    switch (type) {
      case 'textbooks': return 'Downloadable PDF textbooks';
      case 'papers': return 'Term & chapter papers';
      case 'notes': return 'Chapter-wise summaries';
      case 'videos': return 'Educational videos';
      default: return 'Explore other resources';
    }
  };

  const availableResourceTypes = grade.visibleResourceTypes && grade.visibleResourceTypes.length > 0 
    ? dynamicResourceTypes.filter(rt => grade.visibleResourceTypes.includes(rt.id))
    : dynamicResourceTypes;

  const resourceCards = availableResourceTypes.map(rt => ({
    type: rt.id,
    icon: getIconForType(rt.id, rt.icon),
    title: typeof rt.name === 'object' ? (rt.name[selectedLanguage] || rt.name.english) : (getResourceTypeName(rt.id, selectedLanguage) || rt.name),
    desc: typeof rt.description === 'object' ? (rt.description[selectedLanguage] || rt.description.english) : (getDescForType(rt.id))
  }));

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border py-16">
        <Container className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4">
              {grade.display} Resources
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Quick access to {resourceCards.slice(0, 3).map(r => r.title.toLowerCase()).join(', ')} and more.
            </p>
          </motion.div>
        </Container>
      </header>

      {/* Breadcrumb */}
      <div className="bg-bg-secondary/50 border-b border-border">
        <Container className="py-3">
          <nav className="flex items-center text-sm font-medium text-text-muted whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-primary transition-colors flex items-center">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
            {parentGrade && (
              <>
                <Link to={`/grade/${gradeId}`} className="hover:text-primary transition-colors">{parentGrade.display}</Link>
                <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
              </>
            )}
            <span className="text-text-primary font-semibold">{grade.display}</span>
          </nav>
        </Container>
      </div>

      <Container className="mt-6">
        <AdSenseComponent slot="GRADE_HEADER_AD_SLOT" />
      </Container>

      {/* Content */}
      <Section className="flex-1 py-12">
        <Grid cols={4} gap={6}>
          {resourceCards.map((rt, index) => {
            const path = streamId ? `/grade/${gradeId}/${streamId}/${rt.type}` : `/grade/${gradeId}/${rt.type}`;
            return (
              <motion.div 
                key={rt.type} 
                className="col-span-1 sm:col-span-2 lg:col-span-1 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={path} className="block h-full group outline-none">
                  <Card className="h-full border-border hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md bg-card overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full relative z-10">
                      <div className="w-20 h-20 rounded-2xl bg-bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border">
                        {rt.icon}
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">{rt.title}</h3>
                      <p className="text-sm text-text-muted">{rt.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </Grid>
      </Section>

      {/* Call to Action */}
      <div className="bg-bg-secondary border-t border-border py-12">
        <Container className="text-center">
          <h4 className="text-2xl font-bold text-text-primary mb-3">Need More Resources?</h4>
          <p className="text-text-muted mb-6 max-w-xl mx-auto">
            Can't find what you're looking for? Contact our admin team to request additional materials.
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-all bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md group">
            <Mails className="w-5 h-5 mr-2" /> Contact Us <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </Container>
      </div>
    </div>
  );
};

export default GradePage;