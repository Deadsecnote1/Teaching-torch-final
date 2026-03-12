import React, { useEffect } from 'react';

/**
 * A reusable component for Google AdSense ads.
 * 
 * @param {string} slot - The data-ad-slot ID from Google AdSense
 * @param {string} format - The format of the ad (default: 'auto')
 * @param {boolean} responsive - Whether the ad is responsive (default: true)
 * @param {object} style - Optional custom styles
 */
const AdSenseComponent = ({ slot, format = 'auto', responsive = true, style = {} }) => {
  useEffect(() => {
    try {
      // Initialize the ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense initialization error:', e);
    }
  }, []);

  // Use the Publisher ID from the global script or a constant
  // We use a placeholder here as well
  const publisherId = "ca-pub-PLACEHOLDER_ID";

  return (
    <div className="adsense-container my-4" style={{ textAlign: 'center', overflow: 'hidden' }}>
      <ins className="adsbygoogle"
           style={{ display: 'block', ...style }}
           data-ad-client={publisherId}
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive={responsive ? "true" : "false"}></ins>
    </div>
  );
};

export default AdSenseComponent;
