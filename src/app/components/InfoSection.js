import React from 'react';
import '../styles/InfoSection.css'; // Adjust path if needed

const InfoSection = () => {
  return (
    <div className="info-section">
      {/* About Section */}
      <div className="info-container dark-bg" id="about">
        <div className="info-wrapper">
          <div className="info-row">
            <div className="column text-column">
              <div className="text-wrapper">
                <p className="top-line">EstimateUp - Software Estimation Experts</p>
                <h1 className="heading light-text">Save Time and Budget with Accurate Estimates</h1>
                <p className="subtitle">
                  EstimateUp provides expert solutions in software cost estimation. We empower startups 
                  and enterprises to reduce risk, save development time, and optimize budgets.
                </p>
              </div>
            </div>
            <div className="column image-column">
              <div className="img-wrap">
                <img src="/images/svg10.png" alt="Software Estimation Dashboard" className="img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <div className="info-container light-bg" id="discover">
        <div className="info-wrapper">
          <div className="info-row reverse">
            <div className="column text-column">
              <div className="text-wrapper">
                <p className="top-line">Explore Proven Estimation Techniques</p>
                <h1 className="heading">Reliable Cost Estimates for Every Project</h1>
                <p className="subtitle dark-text">
                  Discover estimation models like Delphi, Three-Point, and SLOC tailored 
                  for your software project.
                </p>
              </div>
            </div>
            <div className="column image-column">
              <div className="img-wrap">
                <img src="/images/svg50.png" alt="Estimation Techniques Overview" className="img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Section */}
      <div className="info-container light-bg" id="signup">
        <div className="info-wrapper">
          <div className="info-row">
            <div className="column text-column">
              <div className="text-wrapper">
                <p className="top-line">Get Started with EstimateUp</p>
                <h1 className="heading">Create Your Free Account in Minutes</h1>
                <p className="subtitle dark-text">
                  Sign up now to access a complete suite of software estimation tools.
                </p>
              </div>
            </div>
            <div className="column image-column">
              <div className="img-wrap">
                <img src="/images/svg30.png" alt="Sign Up Illustration" className="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;