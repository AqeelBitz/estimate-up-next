'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import emailjs from '@emailjs/browser';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Delphi.css';
import { useAuth } from '../context/AuthContext'; 

const R3_REQUEST_SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID;
const R3_REQUEST_TEMPLATE_ID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
const R3_REQUEST_PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY;
console.log("serviceID: ", R3_REQUEST_SERVICE_ID, "templateID: ", R3_REQUEST_TEMPLATE_ID, "publicKey: ", R3_REQUEST_PUBLIC_KEY); // Debugging

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

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            emailjs.init(R3_REQUEST_PUBLIC_KEY);
        }
    }, []); 

    useEffect(() => {
        if (!isClient) return;

        const fetchEstimationData = () => {
            console.log("Fetching data from localStorage...");
            const arr = localStorage.getItem("modules");
            const storedEstimationData = JSON.parse(localStorage.getItem("estimationData") || "[]");
            const project = localStorage.getItem('projectName');

            if (project) setProjectName(project);

            if (storedEstimationData) {
                const estimatorNames = storedEstimationData.map(data => data.estimator_name);
                setE_name(estimatorNames);

                const round1Estimations = storedEstimationData.map(data => data.r1_estimation);
                setRound1(round1Estimations);

                const round2Estimations = storedEstimationData.map(data => data.r2_estimation);
                setRound2(round2Estimations);

                // Calculations (ensure robustness against missing/null data)
                const calcTotal = (estimations) => estimations.map(est => est ? est.reduce((acc, curr) => acc + Number(curr || 0), 0) : 0);
                const totals1 = calcTotal(round1Estimations);
                const totals2 = calcTotal(round2Estimations);
                setTotal_effort(totals1);
                setTotal_effort2(totals2);

                const validEstimatorsCount = estimatorNames.filter(Boolean).length;
                const calcAvg = (totals) => validEstimatorsCount > 0 ? totals.reduce((acc, curr) => acc + curr, 0) / validEstimatorsCount : 0;
                setTotal_avg1(calcAvg(totals1));
                setTotal_avg2(calcAvg(totals2));
            }

            if (arr) {
                try {
                    const obj = JSON.parse(arr);
                    // Assuming taskList expects objects with Name property based on table rendering
                    setTaskList(Array.isArray(obj) ? obj : []);
                } catch (e) {
                    console.error("Failed to parse modules:", e);
                    setTaskList([]);
                }
            } else {
                setTaskList([]);
            }
        };

        fetchEstimationData();

    }, [isClient]); 

    useEffect(() => {
        const heading = headingRef.current;
        if (!heading) return;

        const headingText = 'Round 2 Estimation Sheet';
        let index = 0;
        let typingInterval;

        const startTypingAnimation = () => {
            heading.innerHTML = ''; 
            clearInterval(typingInterval); 
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
        return () => clearInterval(typingInterval); // Cleanup on unmount
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
        if (!projectName) {
            showToast('Project name is missing. Cannot send request.', 'error');
            return;
        }

        setIsSending(true);

        try {
            const senderEmail = user ? user.email : (typeof window !== 'undefined' ? localStorage.getItem('loggedin_user') : null);
            const senderName = user ? `${user.fname} ${user.lname}` : 'EstimateUp Project Manager';

            if (!senderEmail) {
                throw new Error("Logged-in user email not found. Please log in.");
            }
            let round1ResultsLink = '';

            if (typeof window !== 'undefined') {
              const origin = window.location.origin; 
              round1ResultsLink = `${origin}/input_r3`;
            } else {
              console.warn("window is not available to construct the Round 1 link during server render.");
              round1ResultsLink = 'Link not available'; 
            }
            const templateParams = {
                to_email: recipientEmail,      // The estimator being invited
                from_name: senderName,         // Name of the person sending the invite (logged-in user)
                reply_to: senderEmail,         // Email of the person sending the invite
                project_name: projectName,     // Context for the estimator
                link: ROUND3_INPUT_LINK,       // Link to the Round 3 input form
                message: customMessage,        // Personalized message from sender
                time: new Date().toLocaleString(), // Timestamp
                link: round1ResultsLink,
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
                            {e_name.map((expertName, index) => (
                                <span key={`name-${index}`} className="estimator-name">
                                    {expertName || 'Estimator ' + (index + 1)}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="unit-display">Unit: Days</div>
                     <div className="date-display">Date: {isClient ? new Date().toLocaleDateString() : '...'}</div>
                </div>
            </div>

            {/* Card for Round 1/2 Estimation Table */}
            <div className="card elevation-2">
                <div className="table-container">
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
                            {/* Make sure taskList contains objects with 'Name' property */}
                            {(taskList && taskList.length > 0) ? taskList.map((task, i) => (
                                <tr key={`row-${i}`}>
                                    {/* Use task.Name assuming task is an object */}
                                    <th scope="row">{task?.Name || `Task ${i + 1}`}</th>
                                    {e_name.map((_, j) => (
                                        <td key={`cell-${i}-${j}`}>
                                            <div className="estimation-pair">
                                                <span className={round1[j]?.[i] ? '' : 'pending-text'}>
                                                    {round1[j]?.[i] ?? 'N/A'} {/* Use ?? for cleaner fallback */}
                                                </span>
                                                <span className="separator">/</span>
                                                <span className={round2[j]?.[i] ? '' : 'pending-text'}>
                                                    {round2[j]?.[i] ?? 'N/A'} {/* Use ?? for cleaner fallback */}
                                                </span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                             )) : (
                                <tr>
                                    <td colSpan={e_name.length + 1} style={{ textAlign: 'center' }}>No tasks loaded.</td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary and Stats Tables (Keep as is, ensure calculations are safe) */}
            <div className="card elevation-2">
                <h5 className="card-subtitle">Summary Statistics</h5>
                <div className="table-container multi-table"> {/* Optional: Wrapper for multiple tables */}
                    <table className="summary-table">
                        <thead><tr><th>Estimators</th><th>Total (R1+R2)</th><th>Highest</th><th>Lowest</th></tr></thead>
                        <tbody>
                            {e_name.map((expertName, index) => {
                                const r1Estimates = (round1[index] || []).map(Number).filter(n => !isNaN(n));
                                const r2Estimates = (round2[index] || []).map(Number).filter(n => !isNaN(n));
                                const allEstimates = [...r1Estimates, ...r2Estimates];
                                const totalEffortR1 = total_effort[index] || 0;
                                const totalEffortR2 = total_effort2[index] || 0;

                                return (
                                <tr key={`summary-${index}`}>
                                    <th scope="row">{expertName || 'Estimator ' + (index + 1)}</th>
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
                                {/* Simple combined average */}
                                <td>{typeof total_avg1 === 'number' && typeof total_avg2 === 'number' ? ((total_avg1 + total_avg2) / 2).toFixed(2) : 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            {/* --- Updated Card for Sending Round 3 Request --- */}
            <div className="card elevation-2">
                <h5 className="card-subtitle">
                    Send Request for Round 3 Estimation
                </h5>

                {/* Removed ref={form}, removed hidden inputs */}
                <form onSubmit={sendEmail} className="email-form">

                    {/* Estimator Email Input */}
                    <div className="input-container">
                        <input
                            type="email"
                            name="recipient_email" // Optional now
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder=" " // For floating label
                            required
                            className="email-input"
                        />
                        <label className="input-label">Estimator's Email</label>
                        <div className="underline"></div>
                    </div>

                    {/* Custom Message Textarea */}
                    <div className="input-container">
                        <textarea
                            name="custom_message" // Optional now
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
                        disabled={isSending || !recipientEmail || !projectName }
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