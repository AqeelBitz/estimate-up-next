import React from 'react';
import Link from 'next/link';
import '../styles/Services.css'; // Adjust path if needed
import Image from 'next/image';

import Icon1 from '../../../public/images/threepoint.png';
import Icon2 from '../../../public/images/functionpoint.png';
import Icon3 from '../../../public/images/cocomo.png';
import Icon4 from '../../../public/images/cocomo2.png';
import Icon5 from '../../../public/images/delphi.png';

const Services = () => {
  return (
    <div className="services-container" id='services'>
      <h1 className="services-title">Software Cost Estimation Techniques</h1>
      <div className="services-wrapper">
        <Link href="/tp" className="service-link">
          <div className="services-card">
            <div className="services-card-inner">
              <Image src={Icon1.src} alt="Three-Point Estimation icon" className="services-icon" />
              <h2 className="services-card-title">Three-Point Estimation</h2>
              <p className="services-card-text">
                Improve accuracy by using optimistic, pessimistic, and most likely estimates to minimize risk and resource waste.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/fp" className="service-link">
          <div className="services-card">
            <div className="services-card-inner">
              <Image src={Icon2.src} alt="Function Point Analysis icon" className="services-icon" />
              <h2 className="services-card-title">Function Point Analysis</h2>
              <p className="services-card-text">
                Estimate software size by analyzing business functionalities and user interactions to improve planning and budgeting.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/cocomo" className="service-link">
          <div className="services-card">
            <div className="services-card-inner">
              <Image src={Icon3.src} alt="COCOMO Model icon" className="services-icon" />
              <h2 className="services-card-title">COCOMO Model (Basic)</h2>
              <p className="services-card-text">
                Calculate effort, cost, and project duration based on software size using the original COCOMO algorithm.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/cocomo2" className="service-link">
          <div className="services-card">
            <div className="services-card-inner">
              <Image src={Icon4.src} alt="COCOMO II Model icon" className="services-icon" />
              <h2 className="services-card-title">COCOMO II Model</h2>
              <p className="services-card-text">
                Advanced model for estimating modern software projects with greater flexibility, accuracy, and scalability.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/delphi" className="service-link">
          <div className="services-card">
            <div className="services-card-inner">
              <Image src={Icon5.src} alt="Delphi Estimation icon" className="services-icon" />
              <h2 className="services-card-title">Delphi Estimation</h2>
              <p className="services-card-text">
                Gather expert consensus to estimate software cost and effort through multiple anonymous feedback rounds.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Services;