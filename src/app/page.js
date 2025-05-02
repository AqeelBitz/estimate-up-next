'use client';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import CoverSection from './components/CoverSection';
import Footer from './components/Footer';
import InfoSection from './components/InfoSection';
import Services from './components/Services';
import Sidebar from './components/Sidebar';
import MessageCard from './components/MessageCard';
import './styles/Pages.css';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // if (!isAuthenticated) {
  //   return (
  //     <MessageCard
  //       type="error"
  //       message="Unauthorized Access"
  //       subMessage="Please log in to view this page."
  //     />
  //   );
  // }

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} logout={logout} />
      <CoverSection />
      <InfoSection />
      <Services />
      <Footer />
    </>
  );
}
