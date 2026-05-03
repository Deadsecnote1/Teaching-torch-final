import React from 'react';

const SplashScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FFB133',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <img 
        src="/logo512.png" 
        alt="Teaching Torch Logo" 
        style={{ 
          width: '150px', 
          height: '150px', 
          objectFit: 'contain' 
        }} 
      />
    </div>
  );
};

export default SplashScreen;
