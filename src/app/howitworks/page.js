"use client"
import React from 'react';
import '../styles/Howitworks.css'; 

const HowItWorksPage = () => {
  return (
    <div className="how-it-works-container">
      <h2>How It Works</h2>
      <div className="how-it-works-steps">
        <div className="how-it-works-step">
          <div className="how-it-works-step-number">1</div>
          <div className="how-it-works-step-description">
            <h3>Submit Project Details</h3>
            <p>
              Provide the necessary details about your software project, such as the project scope, objectives, requirements, and other relevant information. You can use our project estimation techniques, such as Three Point, Functional Point, COCOMO 1, COCOMO 2, and Delphi, to make realistic estimations.
            </p>
          </div>
        </div>
        <div className="how-it-works-step">
          <div className="how-it-works-step-number">2</div>
          <div className="how-it-works-step-description">
            <h3>Receive Cost Estimate</h3>
            <p>
              Based on the information you provide, we will generate a cost estimate for your software project. Our estimation process uses advanced algorithms and industry-standard methods to ensure accuracy and reliability.
            </p>
          </div>
        </div>
        <div className="how-it-works-step">
          <div className="how-it-works-step-number">3</div>
          <div className="how-it-works-step-description">
            <h3>Review and Adjust Estimate</h3>
            <p>
              Review the cost estimate we provide and adjust it as needed. You can change project details, adjust the scope or requirements, or add new information to refine the estimate. Our app will automatically recalculate the estimate based on the changes you make.
            </p>
          </div>
        </div>
        <div className="how-it-works-step">
          <div className="how-it-works-step-number">4</div>
          <div className="how-it-works-step-description">
            <h3>Submit Payment and Start Project</h3>
            <p>
              Once you are satisfied with the estimate, you can submit payment and start your software project. Our app provides a secure payment gateway to ensure your payment information is safe and protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default HowItWorksPage