import React from "react";
import { FaInfoCircle, FaUserShield, FaLock, FaSync, FaEnvelope } from "react-icons/fa";
import  "../styles/Terms.css";

const TermsAndConditions = () => {
  return (
    <div className="termsContainer">
      <div className="termsCard">
        <h1 className="termsTitle">Terms and Conditions</h1>
        <p className="termsDate">Last updated: March 21, 2025</p>
        
        <div className="termsContent">
          <h3><FaInfoCircle /> 1. Introduction</h3>
          <p>Welcome to EstimatUp! These Terms and Conditions govern your use of our application.</p>

          <h3><FaUserShield /> 2. User Responsibilities</h3>
          <p>You agree to use our services responsibly and comply with all applicable laws.</p>

          <h3><FaLock /> 3. Data Privacy</h3>
          <p>Your privacy is important to us. We handle your data with care and transparency.</p>

          <h3><FaSync /> 4. Changes to Terms</h3>
          <p>We may update these terms periodically. Continued use of our service constitutes acceptance of the revised terms.</p>

          <h3><FaEnvelope /> 5. Contact Us</h3>
          <p>If you have any questions, feel free to contact us at support@estimatup.com.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
