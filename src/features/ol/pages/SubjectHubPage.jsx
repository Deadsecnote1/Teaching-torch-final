import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import { useLanguage } from '../../../context/LanguageContext';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import AdSenseComponent from '../../../components/common/AdSenseComponent';
import { Book, FileText, StickyNote, PlayCircle, Folder, ChevronRight } from 'lucide-react';
import { Container, Section, Grid } from '../../../components/ui/Layout';

const SubjectHubPage = () => {
  const { gradeId, streamId, subjectId } = useParams();
  const { selectedLanguage: language } = useLanguage();
  const { grades, subjects, resourceTypes = [] } = useData();

  const grade = grades[gradeId];
  const stream = grades[streamId];
  const subject = subjects[subjectId];

  const pageTitle = subject ? `${subject.display} - ${stream?.display || ''}` : 'Subject Hub';
  useDocumentTitle(pageTitle);

  if (!subject || !grade || !stream) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Content Not Found</h2>
        <p className="text-text-muted mb-8">We couldn't find the requested subject information.</p>
        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors">Go Home</Link>
      </Container>
    );
  }

  // Determine resource type order for this subject
  // Default order if not specified
  const defaultOrder = ['textbooks', 'papers', 'notes', 'videos'];
  const subjectOrder = subject.resourceTypeOrder || defaultOrder;

  // Filter and sort resource types based on subject-specific priority
  const visibleTypes = resourceTypes
    .filter(rt => rt.active !== false)
    .filter(rt => subjectOrder.includes(rt.id))
    .sort((a, b) => {
      const indexA = subjectOrder.indexOf(a.id);
      const indexB = subjectOrder.indexOf(b.id);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

  const getIconForType = (id, colorClass) => {
    const defaultColorClass = colorClass || 'text-primary';
    switch (id) {
      case 'textbooks': return <Book className={`w-12 h-12 ${defaultColorClass}`} />;
      case 'papers': return <FileText className={`w-12 h-12 ${defaultColorClass}`} />;
      case 'notes': return <StickyNote className={`w-12 h-12 ${defaultColorClass}`} />;
      case 'videos': return <PlayCircle className={`w-12 h-12 ${defaultColorClass}`} />;
      default: return <Folder className={`w-12 h-12 ${defaultColorClass}`} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Subject Header */}
      <header className="py-16 text-center text-white relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img src="/bg3.jpg" alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
        </div>
        <Container className="relative z-10">
          <span className="inline-block bg-primary text-white text-sm font-bold mb-4 px-4 py-1.5 rounded-full shadow-sm">{stream.display}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{subject.display}</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">All specialized resources for {subject.display} in one place.</p>
        </Container>
      </header>

      {/* Ad Unit */}
      <AdSenseComponent slot="SUBJECT_HUB_HEADER_AD" />

      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b border-border py-3">
        <Container>
          <nav className="flex items-center text-sm font-medium text-text-muted overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
            <Link to={`/grade/${gradeId}`} className="hover:text-primary transition-colors">{grade.display}</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
            <Link to={`/grade/${gradeId}/${streamId}`} className="hover:text-primary transition-colors">{stream.display}</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
            <span className="text-primary">{subject.display}</span>
          </nav>
        </Container>
      </div>

      {/* Hub Grid */}
      <Section className="py-16 flex-1">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-text-primary mb-4">Explore Resources</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Select a category below to view specific materials</p>
          </div>

          <Grid cols={3} gap={6} className="max-w-5xl mx-auto">
            {visibleTypes.map((rt) => (
              <div key={rt.id} className="col-span-1 sm:col-span-2 md:col-span-1">
                <Link 
                  to={`/grade/${gradeId}/${streamId}/${subjectId}/${rt.id}`} 
                  className="block h-full group"
                >
                  <div className="h-full bg-bg-secondary rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 text-center flex flex-col items-center p-8">
                    <div className="w-24 h-24 rounded-full bg-bg-primary border border-border shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary/5 group-hover:scale-110 transition-all duration-300">
                      {getIconForType(rt.id, rt.color)}
                    </div>
                    <h4 className="text-xl font-bold text-text-primary mb-3">
                      {rt.name?.[language] || rt.name?.english || rt.id}
                    </h4>
                    <p className="text-sm text-text-muted mb-6 flex-grow">
                      {rt.description?.[language] || rt.description?.english || ''}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center px-6 py-2 rounded-full border border-primary text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                        Browse
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border w-full">
                       <small className="text-xs font-bold text-primary tracking-wider uppercase">Free Access</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
};

export default SubjectHubPage;
