'use client';
import React, { useEffect } from 'react';
import '../styles/Auth.css'; // Make sure this path is correct

const MessageCard = ({ type, message, subMessage, onClose, autoCloseDuration = 5000 }) => {
  const iconConfig = {
    success: {
      icon: '✔',
      color: '#4CAF50',
      waveColor: 'rgba(76, 175, 80, 0.1)'
    },
    error: {
      icon: '✖',
      color: '#F44336',
      waveColor: 'rgba(244, 67, 54, 0.1)'
    },
    warning: {
      icon: '⚠',
      color: '#FFC107',
      waveColor: 'rgba(255, 193, 7, 0.1)'
    }
  };

  useEffect(() => {
    if (autoCloseDuration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoCloseDuration, onClose]);

  if (!type) return null;

  const config = iconConfig[type] || iconConfig.success;

  return (
    <div className="message-card-overlay">
      <div className={`message-card ${type}`}>
        <svg 
          className="wave" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L0,320Z"
            fill={config.waveColor}
          />
        </svg>

        <div className="message-card-content">
          <div className="message-icon-container">
            <span 
              className="message-icon" 
              style={{ backgroundColor: config.color }}
              aria-hidden="true"
            >
              {config.icon}
            </span>
          </div>

          <div className="message-text">
            <p className="message-title">{message}</p>
            {subMessage && <p className="message-subtext">{subMessage}</p>}
          </div>

          {onClose && (
            <button 
              className="message-close-btn" 
              onClick={onClose}
              aria-label="Close message"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;