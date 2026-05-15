import React from 'react';
import { 
  Book, 
  FileText, 
  StickyNote, 
  PlayCircle, 
  Folder, 
  Calculator, 
  Beaker, 
  Briefcase, 
  Code, 
  Globe, 
  Library, 
  Layers,
  BookOpen,
  Atom,
  Database,
  Search,
  Dna,
  Binary,
  Cpu,
  Monitor,
  Terminal,
  Gavel,
  Scale,
  Palette,
  Music,
  HeartPulse,
  Stethoscope,
  Microscope,
  Pi,
  Hash,
  Lightbulb,
  Map,
  Compass,
  Archive
} from 'lucide-react';

/**
 * Maps Lucide icon strings or descriptive names to Lucide components.
 * @param {string} iconName - The name of the icon (e.g. 'book', 'calculator')
 * @param {string} className - Tailwind classes to apply to the icon
 * @returns {JSX.Element} - The Lucide icon component
 */
export const getLucideIcon = (iconName, className = "w-5 h-5") => {
  if (!iconName) return <Book className={className} />;
  
  const name = iconName.toLowerCase();
  
  // Math & Science
  if (name.includes('calculator') || name.includes('math')) return <Calculator className={className} />;
  if (name.includes('flask') || name.includes('beaker') || name.includes('science') || name.includes('chemistry')) return <Beaker className={className} />;
  if (name.includes('atom') || name.includes('physics')) return <Atom className={className} />;
  if (name.includes('dna') || name.includes('biology')) return <Dna className={className} />;
  if (name.includes('microscope')) return <Microscope className={className} />;
  if (name.includes('pi') || name.includes('hash')) return <Pi className={className} />;
  
  // Tech & ICT
  if (name.includes('code') || name.includes('laptop') || name.includes('terminal') || name.includes('ict') || name.includes('computer')) return <Code className={className} />;
  if (name.includes('database')) return <Database className={className} />;
  if (name.includes('binary')) return <Binary className={className} />;
  if (name.includes('cpu') || name.includes('hardware')) return <Cpu className={className} />;
  if (name.includes('monitor')) return <Monitor className={className} />;
  
  // Business & Arts
  if (name.includes('briefcase') || name.includes('business') || name.includes('commerce') || name.includes('accounting')) return <Briefcase className={className} />;
  if (name.includes('palette') || name.includes('art')) return <Palette className={className} />;
  if (name.includes('music')) return <Music className={className} />;
  if (name.includes('gavel') || name.includes('scale') || name.includes('law')) return <Gavel className={className} />;
  
  // Health
  if (name.includes('heart') || name.includes('pulse') || name.includes('health') || name.includes('medicine')) return <HeartPulse className={className} />;
  if (name.includes('stethoscope')) return <Stethoscope className={className} />;
  
  // General & Educational
  if (name.includes('globe') || name.includes('geography')) return <Globe className={className} />;
  if (name.includes('map') || name.includes('compass') || name.includes('history')) return <Map className={className} />;
  if (name.includes('library') || name.includes('archive')) return <Library className={className} />;
  if (name.includes('book') || name.includes('text')) return <Book className={className} />;
  if (name.includes('file') || name.includes('paper') || name.includes('sticky')) return <FileText className={className} />;
  if (name.includes('play') || name.includes('video')) return <PlayCircle className={className} />;
  if (name.includes('layers') || name.includes('stream')) return <Layers className={className} />;
  if (name.includes('lightbulb') || name.includes('idea')) return <Lightbulb className={className} />;
  
  // Default fallback
  return <Book className={className} />;
};
