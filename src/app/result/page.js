'use client';

import { useEffect, useState, useRef } from 'react';
import Header from '../components/Header'; 
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Delphi.css';

const Result = () => {
  const [standardError, setStandardError] = useState('');
  const [upperBound, setUpperBound] = useState('');
  const [lowerBound, setLowerBound] = useState('');
  const [effort, setEffort] = useState('');
  const headingRef = useRef(null);

  useEffect(() => {
    const SE = localStorage.getItem('SE');
    const upperBoundVal = localStorage.getItem('upperBound');
    const lowerBoundVal = localStorage.getItem('lowerBound');
    const effortVal = localStorage.getItem('Effort');

    setStandardError(SE);
    setUpperBound(upperBoundVal);
    setLowerBound(lowerBoundVal);
    setEffort(effortVal);

    const heading = headingRef.current;
    const headingText = 'Final Estimated Cost of the Project is';
    let index = 0;
    let typingInterval;

    const startTypingAnimation = () => {
      if (!heading) return;
      heading.innerHTML = '';
      clearInterval(typingInterval);

      typingInterval = setInterval(() => {
        if (index < headingText.length) {
          heading.innerHTML += headingText.charAt(index);
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 40);
    };

    startTypingAnimation();

    return () => {
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <ProtectedRoute>
    <div>
      <Header step={5} />
      <div className="result-container">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="bg1 p-4 my-3 shadow">
                <h3
                  className="dh3"
                  id="round_heading"
                  ref={headingRef}
                  aria-live="polite"
                >
                  Final Estimated Cost of the Project is
                </h3>

                <h1 className="text-center display-4 text-primary mb-5 dh1">
                  {effort} days
                </h1>

                <h3 className="text-center mb-2 dh3">Confidence Interval:</h3>
                <h3 className="text-center mb-2 dh3">
                  <span className="text-primary font-weight-bold">{lowerBound}</span>{' '}
                  -{' '}
                  <span className="text-primary font-weight-bold">{upperBound}</span>{' '}
                  days
                </h3>

                <h3 className="text-center mb-2 dh3">Standard Error:</h3>
                <h3 className="text-center mb-2 dh3">
                  <span className="text-primary font-weight-bold">{standardError}</span>{' '}
                  days
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Result;
