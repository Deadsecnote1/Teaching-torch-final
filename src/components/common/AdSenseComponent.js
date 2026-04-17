import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';

/**
 * A reusable component for Google AdSense ads.
 * 
 * @param {string} slot - The data-ad-slot ID OR a symbolic name (e.g. 'HOME_HERO')
 * @param {string} format - The format of the ad (default: 'auto')
 * @param {boolean} responsive - Whether the ad is responsive (default: true)
 * @param {object} style - Optional custom styles
 * @param {string} minHeight - Minimum height to reserve (default: '250px')
 */
const AdSenseComponent = ({ slot, format = 'auto', responsive = true, style = {}, minHeight = '250px' }) => {
  const { settings } = useData();

  useEffect(() => {
    try {
      // Initialize the ad if the ins element is present and has a client
      const ads = document.getElementsByClassName('adsbygoogle');
      if (ads.length > 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense initialization error:', e);
    }
  }, [slot]); // Re-run if slot changes

  // Map symbolic names to actual slot IDs from settings
  const slotMap = {
    'HOME_HERO_AD_SLOT': settings.slotHomeHero,
    'HOME_FOOTER_AD_SLOT': settings.slotHomeFooter,
    'GRADE_HEADER_AD_SLOT': settings.slotGradeHeader,
    'TEXTBOOKS_HEADER_AD_SLOT': settings.slotTextbooksHeader,
    'PAPERS_HEADER_AD_SLOT': settings.slotPapersHeader,
    'NOTES_HEADER_AD_SLOT': settings.slotNotesHeader
  };

  const actualSlot = slotMap[slot] || slot;
  const publisherId = settings.adsenseClientId || "ca-pub-PLACEHOLDER_ID";

  // If we don't have a valid slot ID after mapping, render nothing (display: none)
  if (!actualSlot || actualSlot === 'PLACEHOLDER_SLOT') {
    return null;
  }

  return (
    <div 
      className="adsense-container my-4" 
      style={{ 
        textAlign: 'center', 
        overflow: 'hidden',
        minHeight: minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: '8px'
      }}
    >
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', minHeight: minHeight, ...style }}
           data-ad-client={publisherId}
           data-ad-slot={actualSlot}
           data-ad-format={format}
           data-full-width-responsive={responsive ? "true" : "false"}></ins>
    </div>
  );
};

export default AdSenseComponent;
