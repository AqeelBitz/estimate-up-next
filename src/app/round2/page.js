'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import emailjs from '@emailjs/browser';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Delphi.css';
import { useAuth } from '../context/AuthContext';

// Access environment variables
const R3_REQUEST_SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID;
const R3_REQUEST_TEMPLATE_ID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
const R3_REQUEST_PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY;
// Removed debugging console.log

// Consider making this dynamic or configurable if possible
const ROUND3_INPUT_LINK = 'https://estimate-up.onrender.com/input_r3';

const Round2 = () => {
    const { user } = useAuth();
    const headingRef = useRef(null);

    // State variables
    const [taskList, setTaskList] = useState([]);
    const [round1, setRound1] = useState([]);
    const [round2, setRound2] = useState([]);
    const [e_name, setE_name] = useState([]);
    const [total_effort, setTotal_effort] = useState([]);
    const [total_effort2, setTotal_effort2] = useState([]);
    const [total_avg1, setTotal_avg1] = useState(0);
    const [total_avg2, setTotal_avg2] = useState(0);

    const [isClient, setIsClient] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    // Effect to determine if running on the client and initialize EmailJS
    useEffect(() => {
        setIsClient(true);
        // Initialize EmailJS only on the client and if the public key is available
        if (typeof window !== 'undefined' && R3_REQUEST_PUBLIC_KEY) {
             try {
                emailjs.init(R3_REQUEST_PUBLIC_KEY);
                console.log("EmailJS initialized successfully.");
            } catch (error) {
                 console.error("Failed to initialize EmailJS:", error);
                 // Optionally show a user-friendly error message
            }
        } else if (typeof window !== 'undefined' && !R3_REQUEST_PUBLIC_KEY) {
            console.error("EmailJS Public Key is not defined. Email sending will not work.");
             // Optionally show a user-friendly error message
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Effect to fetch data from localStorage after client mount
    useEffect(() => {
        if (!isClient) return;

        console.log("Attempting to fetch data from localStorage...");
        const project = localStorage.getItem('projectName');

        if (project) {
             setProjectName(project);
        } else {
            setProjectName('');
            console.warn("Project name not found in localStorage.");
        }

        const arr = localStorage.getItem("modules");
        if (arr) {
            try {
                const parsedTasks = JSON.parse(arr);
                // Ensure taskList state is always an array
                setTaskList(Array.isArray(parsedTasks) ? parsedTasks : []);
            } catch (e) {
                console.error("Failed to parse modules from localStorage:", e);
                setTaskList([]); // Set to empty array on parse error
            }
        } else {
             setTaskList([]);
             console.warn("Modules data not found in localStorage.");
        }

        let storedEstimationData = [];
        const estimationDataString = localStorage.getItem("estimationData");
        if (estimationDataString) {
            try {
                storedEstimationData = JSON.parse(estimationDataString);
                 // Ensure storedEstimationData is always an array
                if (!Array.isArray(storedEstimationData)) {
                     console.warn("Estimation data in localStorage is not an array. Resetting.");
                     storedEstimationData = [];
                 }
            } catch (e) {
                console.error("Failed to parse estimationData from localStorage:", e);
                storedEstimationData = []; // Reset to empty array on parse error
            }
        } else {
            console.warn("Estimation data not found in localStorage.");
        }

        const estimatorNames = storedEstimationData.map(data => data?.estimator_name).filter(name => name != null && name !== ''); // Filter out null/undefined and empty names
        setE_name(estimatorNames);

        const round1Estimations = storedEstimationData.map(data => Array.isArray(data?.r1_estimation) ? data.r1_estimation : null); // Ensure r1_estimation is an array
        setRound1(round1Estimations);

        const round2Estimations = storedEstimationData.map(data => Array.isArray(data?.r2_estimation) ? data.r2_estimation : null); // Ensure r2_estimation is an array
        setRound2(round2Estimations);

    }, [isClient, setTaskList, setE_name, setRound1, setRound2, setProjectName]); // Added all state setters to dependencies

    // Effect for calculating totals and averages
    useEffect(() => {
        if (!isClient) return;

        const calcTotal = (estimations) =>
            Array.isArray(estimations) ?
            estimations.map(est => Array.isArray(est) ? est.reduce((acc, curr) => acc + Number(curr || 0), 0) : 0)
            : [];

        const totals1 = calcTotal(round1);
        const totals2 = calcTotal(round2);

        setTotal_effort(totals1);
        setTotal_effort2(totals2);

        const validEstimatorsCount = Array.isArray(e_name) ? e_name.filter(Boolean).length : 0;
        const calcAvg = (totals) => {
            const sum = Array.isArray(totals) ? totals.reduce((acc, curr) => acc + curr, 0) : 0;
            return validEstimatorsCount > 0 ? sum / validEstimatorsCount : 0;
        };

        setTotal_avg1(calcAvg(totals1));
        setTotal_avg2(calcAvg(totals2));

    }, [round1, round2, e_name, isClient, setTotal_effort, setTotal_effort2, setTotal_avg1, setTotal_avg2]); // Added all relevant states and setters to dependencies

    // Effect for heading animation
    useEffect(() => {
        const heading = headingRef.current;
        if (!heading) return;

        const headingText = 'Round 2 Estimation Sheet';
        let index = 0;
        let typingInterval; // Declare interval variable locally

        const startTypingAnimation = () => {
            heading.innerHTML = '';
            clearInterval(typingInterval); // Clear any existing interval
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
        return () => clearInterval(typingInterval); // Cleanup using the local variable
    }, []); // Runs once on mount

    // Toast function (remains the same, added client check)
    const showToast = (message, type) => {
        if (typeof window === 'undefined') return; // Safety check

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                try {
                   if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                   }
                } catch (e) {
                    console.warn("Toast removal issue:", e);
                }
            }, 300);
        }, 3000);
    };

    // --- Updated sendEmail function for Round 3 Request ---
    const sendEmail = async (e) => {
        e.preventDefault();

        if (!recipientEmail) {
            showToast('Please enter the estimator\'s email.', 'warning');
            return;
        }

        // Check if EmailJS is properly configured
        if (!R3_REQUEST_SERVICE_ID || !R3_REQUEST_TEMPLATE_ID || !R3_REQUEST_PUBLIC_KEY) {
             console.error("EmailJS environment variables are not fully configured.");
             showToast('Email service configuration is incomplete.', 'error');
             return; // Stop execution if not configured
         }

        // Check if EmailJS is initialized (optional but good practice after init check)
         if (typeof window !== 'undefined' && !emailjs.isInitialized()) {
             console.error("EmailJS is not initialized. Check your public key and network.");
             showToast('Email service initialization failed. Cannot send email.', 'error');
             return;
         }


        if (!projectName) {
            showToast('Project name is missing. Cannot send request.', 'error');
            return;
        }

        setIsSending(true);

        try {
            const senderEmail = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('loggedin_user') : null);
            const senderName = (user?.fname && user?.lname) ? `${user.fname} ${user.lname}` : 'EstimateUp Project Manager'; // Safer access

            if (!senderEmail) {
                throw new Error("Logged-in user email not found. Please log in.");
            }

            // Decide which link to send. Assuming ROUND3_INPUT_LINK is the intended one.
            // Removed the redundant window.location.origin construction if not needed.
            const invitationLink = ROUND3_INPUT_LINK;


            const templateParams = {
                to_email: recipientEmail,      // The estimator being invited
                from_name: senderName,         // Name of the person sending the invite (logged-in user)
                reply_to: senderEmail,         // Email of the person sending the invite
                project_name: projectName,     // Context for the estimator
                link: invitationLink,          // Link to the Round 3 input form
                message: customMessage,        // Personalized message from sender
                time: new Date().toLocaleString(), // Timestamp
                // Removed duplicate 'link' key
            };

            await emailjs.send(
                R3_REQUEST_SERVICE_ID,
                R3_REQUEST_TEMPLATE_ID,
                templateParams
                // Public key is set via init, no need to pass again unless preferred
            );

            showToast('Round 3 estimation request sent successfully!', 'success');
            setRecipientEmail(''); // Clear recipient field
            setCustomMessage(''); // Clear message field

        } catch (error) {
            console.error('Email sending failed:', error);
            const errorMessage = error.text || (error instanceof Error ? error.message : 'Unknown error occurred.');
            showToast(`Failed to send request: ${errorMessage}`, 'error');
        } finally {
            setIsSending(false);
        }
    };
    // --- End Updated sendEmail function ---

    return (
        <ProtectedRoute>
        <div className="pixel-container">
            <Header step={3} />

            {/* Card for Heading and Info */}
            <div className="card elevation-2">
                <h3 className="card-title" id="round_heading" ref={headingRef}></h3>
                <div className="estimator-info">
                     <div className="estimator-tag">
                         <span>Project:</span>
                         <span className="project-name-display">{projectName || 'Loading...'}</span> {/* Display project name */}
                     </div>
                     <div className="estimator-tag">
                         <span>Estimators:</span>
                         <div className="estimator-names">
                             {/* Ensure e_name is an array before mapping */}
                             {Array.isArray(e_name) && e_name.map((expertName, index) => (
                                 <span key={`name-${index}`} className="estimator-name">
                                     {expertName || `Estimator ${index + 1}`} {/* Fallback text */}
                                 </span>
                             ))}
                              {/* Message if no estimators loaded */}
                             {(!Array.isArray(e_name) || e_name.length === 0) && isClient && <span>No estimators found.</span>}
                         </div>
                     </div>
                     <div className="unit-display">Unit: Days</div> {/* Assuming unit is always Days here */}
                     {/* Conditional rendering for Date only on client side */}
                     {isClient && <div className="date-display">Date: {new Date().toLocaleDateString()}</div>}
                </div>
            </div>

            {/* Card for Round 1/2 Estimation Table */}
            <div className="card elevation-2">
                <div className="table-container">
                     {/* Check if data is available before rendering table */}
                    {(Array.isArray(taskList) && taskList.length > 0 && Array.isArray(e_name) && e_name.length > 0) ? (
                        <table className="estimation-table">
                            <thead>
                                <tr>
                                    <th>Modules</th>
                                    {e_name.map((_, index) => (
                                        <th key={`header-${index}`}>Estimator {index + 1} (R1 / R2)</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {taskList.map((task, i) => (
                                    <tr key={`row-${i}`}>
                                        {/* Use task.Name assuming task is an object, with fallback */}
                                        <th scope="row">{task?.Name || `Task ${i + 1}`}</th>
                                        {e_name.map((_, j) => (
                                            <td key={`cell-${i}-${j}`}>
                                                <div className="estimation-pair">
                                                    {/* Safely access round1 and round2 estimates */}
                                                    <span className={round1?.[j]?.[i] != null ? '' : 'pending-text'}>
                                                         {round1?.[j]?.[i] ?? 'N/A'} {/* Use optional chaining and nullish coalescing */}
                                                    </span>
                                                    <span className="separator">/</span>
                                                    <span className={round2?.[j]?.[i] != null ? '' : 'pending-text'}>
                                                         {round2?.[j]?.[i] ?? 'N/A'} {/* Use optional chaining and nullish coalescing */}
                                                    </span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            {isClient ? 'No estimation data loaded for Round 1/2.' : 'Loading data...'}
                        </div>
                     )}
                </div>
            </div>

            {/* Summary and Stats Tables */}
            <div className="card elevation-2">
                <h5 className="card-subtitle">Summary Statistics</h5>
                 {/* Check if data is available before rendering summary tables */}
                 {(Array.isArray(total_effort) && total_effort.length > 0 && Array.isArray(total_effort2) && total_effort2.length > 0 && Array.isArray(e_name) && e_name.length > 0) ? (
                    <div className="table-container multi-table">
                        <table className="summary-table">
                            <thead><tr><th>Estimators</th><th>Total (R1+R2)</th><th>Highest</th><th>Lowest</th></tr></thead>
                            <tbody>
                                {e_name.map((expertName, index) => {
                                    // Ensure indices are valid and values are numbers
                                    const r1Estimates = (Array.isArray(round1?.[index]) ? round1[index] : []).map(Number).filter(n => !isNaN(n));
                                    const r2Estimates = (Array.isArray(round2?.[index]) ? round2[index] : []).map(Number).filter(n => !isNaN(n));
                                    const allEstimates = [...r1Estimates, ...r2Estimates];

                                    // Safely access total_effort values
                                    const totalEffortR1 = typeof total_effort[index] === 'number' ? total_effort[index] : 0;
                                    const totalEffortR2 = typeof total_effort2[index] === 'number' ? total_effort2[index] : 0;

                                    return (
                                    <tr key={`summary-${index}`}>
                                        <th scope="row">{expertName || `Estimator ${index + 1}`}</th>
                                        <td>{totalEffortR1 + totalEffortR2}</td>
                                        <td>{allEstimates.length > 0 ? Math.max(...allEstimates) : 'N/A'}</td>
                                        <td>{allEstimates.length > 0 ? Math.min(...allEstimates) : 'N/A'}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <table className="stats-table">
                            <thead><tr><th>Overall Avg (R1)</th><th>Overall Avg (R2)</th><th>Combined Avg</th></tr></thead>
                            <tbody>
                                <tr>
                                    <td>{typeof total_avg1 === 'number' ? total_avg1.toFixed(2) : 'N/A'}</td>
                                    <td>{typeof total_avg2 === 'number' ? total_avg2.toFixed(2) : 'N/A'}</td>
                                    {/* Calculate combined average safely */}
                                    <td>{typeof total_avg1 === 'number' && typeof total_avg2 === 'number' && (total_avg1 + total_avg2) > 0 ? ((total_avg1 + total_avg2) / 2).toFixed(2) : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                 ) : (
                     <div style={{ textAlign: 'center', padding: '20px' }}>
                        {isClient ? 'No summary data available.' : 'Loading data...'}
                    </div>
                 )}
            </div>


            {/* --- Updated Card for Sending Round 3 Request --- */}
             {/* Only render the form client-side and if there's data */}
            {(isClient && Array.isArray(e_name) && e_name.length > 0) && (
                <div className="card elevation-2">
                    <h5 className="card-subtitle">
                        Send Request for Round 3 Estimation
                    </h5>

                    <form onSubmit={sendEmail} className="email-form">

                        {/* Estimator Email Input */}
                        <div className="input-container">
                            <input
                                type="email"
                                name="recipient_email"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                placeholder=" "
                                required
                                className="email-input"
                            />
                            <label className="input-label">Estimator's Email</label>
                            <div className="underline"></div>
                        </div>

                        {/* Custom Message Textarea */}
                        <div className="input-container">
                            <textarea
                                name="custom_message"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                rows="3"
                                placeholder="Add an optional message for the estimator (e.g., deadline, focus areas)"
                                className="message-input"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="send-btn elevation-1"
                            // Disable if sending, recipient email is empty, project name is empty, or no estimators/tasks loaded
                            disabled={isSending || !recipientEmail || !projectName || !Array.isArray(e_name) || e_name.length === 0 || !Array.isArray(taskList) || taskList.length === 0}
                        >
                            {isSending ? (
                                <>
                                    <span className="button-spinner"></span> Sending Request...
                                </>
                            ) : (
                                'Send Round 3 Request'
                            )}
                        </button>
                    </form>
                </div>
            )}
            {/* --- End Updated Email Form Card --- */}

            {/* Loader Overlay */}
            {isSending && (
               <div className="loader-overlay">
                 <div className="loader"></div>
               </div>
             )}

        </div>
        </ProtectedRoute>
    );
};

export default Round2;