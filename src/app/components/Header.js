"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/Delphi.css'; 

const Header = ({ step }) => {
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("modules");
        if (stored) {
             try { // Added try-catch for safer JSON parsing
                setTaskList(JSON.parse(stored));
            } catch(e) {
                 console.error("Failed to parse tasks from localStorage in Header", e);
            }
        }
    }, []);

    const getBackLink = () => {
        switch (step) {
            case 5: return '/round3';
            case 4: return '/round2';
            case 3: return '/round1';
            case 2: return '/ques';
            case 1: return '/delphi';
            default: return null;
        }
    };

    const getNextLink = () => {
        switch (step) {
            case 1: return '/round1';
            case 2: return '/round2';
            case 3: return '/round3';
            case 4: return '/result';
            case 5: return null; // Assuming step 5 is the last
            default: return '/ques'; // Default link if step is not defined
        }
    };

    return (
        <div className='delphi-container'>
            <div className="header text-center">
                {/* Use dh2 class for title */}
                <h2 className='dh2'>Delphi Estimation</h2>
                {/* Use d-flex, justify-content-center, gap-2 classes */}
                <div className='d-flex justify-content-center gap-2'>
                    {getBackLink() && (
                        <Link href={getBackLink()}>
                            {/* Apply pixel-button class */}
                            {/* Use outline style for "Back" button */}
                            <button className="pixel-button outline">
                                 {/* Add span for button content */}
                                 <span className="button-content">Back</span>
                                 {/* Optional: Add ripple span */}
                                 {/* <span className="button-ripple"></span> */}
                            </button>
                        </Link>
                    )}
                    {getNextLink() && (
                        <Link href={getNextLink()}>
                            {/* Apply pixel-button primary class */}
                            {/* Use primary style for "Next" button */}
                            <button className="pixel-button primary">
                                 {/* Add span for button content */}
                                 <span className="button-content">Next</span>
                                  {/* Optional: Add ripple span */}
                                 {/* <span className="button-ripple"></span> */}
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;