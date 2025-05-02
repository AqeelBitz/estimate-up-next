'use client';
import { useEffect } from 'react';
import '../styles/ErrorModal.css';

export const ErrorModal = ({ isOpen, onClose, title, messages }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        };
    
        if (isOpen) {
          document.addEventListener('keydown', handleKeyDown);
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = '';
        };
      }, [isOpen, onClose]);
    
      if (!isOpen) return null;

      return (
        <div className="pixel-modal-overlay" onClick={onClose}>
          <div className="pixel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pixel-modal-header">
              <h3 className="pixel-modal-title">{title}</h3>
              <button 
                className="pixel-icon-button" 
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="pixel-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
              </button>
            </div>
            <div className="pixel-modal-content">
              <ul className="pixel-error-list">
                {messages.map((message, index) => (
                  <li key={index} className="pixel-error-item">
                    {message}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pixel-modal-footer">
              <button 
                className="pixel-button-contained"
                onClick={onClose}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      );
  };