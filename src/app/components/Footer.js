"use client";
import React from 'react';
import { animateScroll as scroll } from 'react-scroll';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin, FaArrowUp } from 'react-icons/fa';
import '../styles/Footer.css'; 

const Footer = () => {
  const toggleHome = () => {
    scroll.scrollToTop();
  };

  return (
    <footer className="footerContainer">
      <div className="footerWrapper">
        <div className="footerContent">
          <div className="footerLinksContainer">
            <div className="footerLinksWrapper">
              <div className="footerLinkItems">
                <h3 className="footerLinkTitle">Estimation Methods</h3>
                <Link href="/tp" className="footerLink">Three Point</Link>
                <Link href="/fp" className="footerLink">Function Point</Link>
                <Link href="/cocomo" className="footerLink">COCOMO</Link>
                <Link href="/cocomo2" className="footerLink">COCOMO II</Link>
                <Link href="/delphi" className="footerLink">Delphi</Link>
              </div>

              <div className="footerLinkItems">
                <h3 className="footerLinkTitle">Company</h3>
                <Link href="/howitworks" className="footerLink">How it Works</Link>
                <Link href="/terms" className="footerLink">Terms of Service</Link>
                <Link href="/about" className="footerLink">About Us</Link>
              </div>

              <div className="footerLinkItems">
                <h3 className="footerLinkTitle">Resources</h3>
                <Link href="/blog" className="footerLink">Blog</Link>
                <Link href="/tutorials" className="footerLink">Tutorials</Link>
                <Link href="/documentation" className="footerLink">Documentation</Link>
                <Link href="/faq" className="footerLink">FAQ</Link>
              </div>
            </div>
          </div>

          <div className="footerDivider" />

          <p className="footerDescription">
            EstimateUp is a modern estimation platform designed to streamline software project planning using techniques like COCOMO, Function Point Analysis, and Delphi. Trusted by developers and managers alike.
          </p>

          <section className="socialMedia">
            <div className="socialMediaWrapper">
              <small className="websiteRights">
                © {new Date().getFullYear()} EstimateUp. All rights reserved.
              </small>
              <div className="socialIcons">
                <a href="/" target="_blank" aria-label="Facebook" className="socialIconLink">
                  <FaFacebook />
                </a>
                <a href="/" target="_blank" aria-label="Instagram" className="socialIconLink">
                  <FaInstagram />
                </a>
                <a href="/" target="_blank" aria-label="Youtube" className="socialIconLink">
                  <FaYoutube />
                </a>
                <a href="/" target="_blank" aria-label="Twitter" className="socialIconLink">
                  <FaTwitter />
                </a>
                <a href="/" target="_blank" aria-label="LinkedIn" className="socialIconLink">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </section>
        </div>

        <button onClick={toggleHome} aria-label="Back to top" className="backToTop">
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
