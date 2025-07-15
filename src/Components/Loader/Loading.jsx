import React from 'react';
import './loading.css';

const Loading = ({ fullscreen = false, text = '' }) => {
  return (
    <div
      style={{
        position: fullscreen ? 'fixed' : 'relative',
        top: fullscreen ? 0 : 'auto',
        left: fullscreen ? 0 : 'auto',
        width: fullscreen ? '100vw' : 'auto',
        height: fullscreen ? '100vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: fullscreen ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
        zIndex: fullscreen ? 9999 : 'auto',
      }}
    >
      <div className="loader"></div>
      {text && (
        <div style={{ marginTop: 12, color: '#ccc', fontSize: 16, fontWeight: 'bold' }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Loading;
