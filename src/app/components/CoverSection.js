import React from 'react';
import '../styles/Cover.css';

const CoverSection = () => {
  return (
    <div className="coverContainer">
      <div className="coverBg">
        <video autoPlay loop muted className="videoBg">
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="coverContent">
        <h1 className="coverH1">EstimateUp - Smart Software Cost Estimation</h1>
        <p className="coverP">
          Easily estimate software development costs using trusted techniques like Function Point Analysis, COCOMO, Delphi, and Three-Point Estimation.
          Save time, reduce project risk, and plan with confidence using EstimateUp.
        </p>
      </div>
    </div>
  );
};

export default CoverSection;