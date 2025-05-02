"use client"
import { useState } from 'react';
import InfoSection from '../components/InfoSection';
import Sidebar from '../components/Sidebar';

const About = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <InfoSection />
    </>
  );
};

export default About;