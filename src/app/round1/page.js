'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import emailjs from '@emailjs/browser';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Delphi.css';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const ROUND1_SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID;
const ROUND1_TEMPLATE_ID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
const ROUND1_PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const Round1 = () => {
  // Removed form ref as we'll use emailjs.send directly
  const headingRef = useRef(null);
  const { user } = useAuth(); // <-- Get user from AuthContext

  const [taskList, setTaskList] = useState([]);
  const [round1, setRound1] = useState([]);
  const [e_name, setE_name] = useState([]);
  const [total_effort, setTotal_effort] = useState([]);
  const [total_avg, setTotal_avg] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [projectName, setProjectName] = useState(''); // <-- State for project name
  const [recipientEmail, setRecipientEmail] = useState(''); // <-- State for recipient email
  const [customMessage, setCustomMessage] = useState(''); // <-- State for custom message

  useEffect(() => {
    // This ensures the component has mounted on the client
    setIsClient(true);

    // --- Initialize EmailJS on client mount ---
    // Check if running in the browser environment
    if (typeof window !== 'undefined' && ROUND1_PUBLIC_KEY) {
      // Initialize EmailJS - Only needs to run on the client
      emailjs.init(ROUND1_PUBLIC_KEY);
    } else if (typeof window !== 'undefined' && !ROUND1_PUBLIC_KEY) {
      console.error("EmailJS Public Key is not defined. Cannot initialize EmailJS.");
      // Optionally show a toast or error message to the user
    }
    // --- End EmailJS Initialization ---

  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (!isClient) return; // Only run client-side logic

    // Load data from localStorage
    const arr = localStorage.getItem("modules");
    const project = localStorage.getItem('projectName'); // <-- Load project name

    if (project) {
      setProjectName(project); // <-- Set project name state
    } else {
        // Handle case where project name is missing, maybe clear related states
        setProjectName('');
        console.warn("Project name not found in localStorage.");
    }


    if (arr) {
      try {
        const parsedTasks = JSON.parse(arr);
        // Ensure task names are extracted correctly if modules are objects
        const taskNames = parsedTasks.map(task => (typeof task === 'object' && task.Name) ? task.Name : task);
        setTaskList(taskNames);
      } catch (e) {
          console.error("Failed to parse modules from localStorage:", e);
          setTaskList([]);
      }
    } else {
        // Handle case where modules are missing
        setTaskList([]);
        console.warn("Modules data not found in localStorage.");
    }

    let storedEstimationData = [];
    const estimationDataString = localStorage.getItem("estimationData");
    if (estimationDataString) {
        try {
            storedEstimationData = JSON.parse(estimationDataString);
        } catch (e) {
            console.error("Failed to parse estimationData from localStorage:", e);
            storedEstimationData = []; // Reset to empty array on parse error
        }
    } else {
        console.warn("Estimation data not found in localStorage.");
    }


    const estimatorNames = storedEstimationData.map(data => data.estimator_name).filter(name => name != null); // Filter out null/undefined names
    const round1Estimations = storedEstimationData.map(data => data.r1_estimation);

    setE_name(estimatorNames);
    setRound1(round1Estimations);

  }, [isClient, setTaskList, setE_name, setRound1, setProjectName]); // Added state setters to dependencies

  // Effect for calculating totals
  useEffect(() => {
    if (!isClient) return;
    if (round1.length === 0 || e_name.length === 0) {
      setTotal_effort([]);
      setTotal_avg(0);
      return;
    }

    // Ensure each estimation array is valid before reducing
    const efforts = round1.map(est => Array.isArray(est) ? est.reduce((acc, val) => acc + Number(val || 0), 0) : 0);
    setTotal_effort(efforts);

    const validEstimators = e_name.filter(Boolean).length; // Count non-empty estimator names
    const sum = efforts.reduce((acc, val) => acc + val, 0);
    const avg = validEstimators > 0 ? sum / validEstimators : 0;

    setTotal_avg(avg);
  }, [round1, e_name, isClient, setTotal_effort, setTotal_avg]); // Added state setters to dependencies

  // Effect for heading animation (remains the same)
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const headingText = 'Round 1 Estimation Sheet';
    let index = 0;
    // Clear previous content to prevent accumulation on re-renders if effect runs again
    heading.innerHTML = ''; 
    let typingInterval = setInterval(() => {
      if (index < headingText.length) {
        heading.innerHTML += headingText.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);
    return () => clearInterval(typingInterval); // Cleanup on unmount or re-run
  }, []); // Run animation once on mount

  // Toast function (remains the same, but ensure it only runs client-side)
  const showToast = (message, type) => {
    if (typeof window === 'undefined') return; // Prevent execution on server

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        try {
          if (document.body.contains(toast)) { // Check if toast is still in DOM
             document.body.removeChild(toast);
          }
        } catch (e) {
            console.warn("Toast element removal issue:", e);
        }
      }, 300);
    }, 3000);
  };

  // --- Updated sendEmail function ---
  const sendEmail = async (e) => {
    e.preventDefault();

    if (!recipientEmail) {
        showToast('Please enter the recipient\'s email.', 'warning');
        return;
    }
     if (!ROUND1_SERVICE_ID || !ROUND1_TEMPLATE_ID || !ROUND1_PUBLIC_KEY) {
        console.error("EmailJS environment variables are not set.");
        showToast('Email service is not configured properly.', 'error');
        setIsSending(false); // Ensure sending state is reset
        return;
    }


    if (!projectName) {
        showToast('Project name is missing. Cannot send email.', 'error');
        // Optionally reload from localStorage or prompt user
        return;
    }

    setIsSending(true);

    try {
        // Get the logged-in user's details safely
        const senderEmail = user ? user.email : (typeof window !== 'undefined' ? localStorage.getItem('loggedin_user') : null);
        const senderName = user ? `${user.fname} ${user.lname}` : 'EstimateUp User';

        if (!senderEmail) {
            throw new Error("Logged-in user email not found. Please ensure you are logged in.");
        }

        // --- Prepare data for the email template ---
        // You might want to format the summary data into a more readable string
        const roundSummary = `
Estimators: ${e_name.join(', ') || 'N/A'}
Individual Total Efforts: ${total_effort.join(', ') || 'N/A'}
Overall Average Effort: ${typeof total_avg === 'number' ? total_avg.toFixed(2) : 'N/A'}

Detailed Estimations:
${taskList.map((task, i) =>
    `${task}: ${round1.map(est => (Array.isArray(est) && est[i] != null) ? est[i] : 'N/A').join(', ')}`
).join('\n')}
        `;
        // You might want to format this more nicely or pass structured data if your template handles it
        let round1ResultsLink = '';

        if (typeof window !== 'undefined') {
          const origin = window.location.origin;
          round1ResultsLink = `${origin}/input_r2`; // Assuming /input_r2 is the correct next step URL
        } else {
          console.warn("window is not available to construct the Round 1 link during server render.");
          round1ResultsLink = 'Link not available (generated server-side)';
        }

        const templateParams = {
            to_email: recipientEmail,
            from_name: senderName,
            reply_to: senderEmail,
            project_name: projectName,
            round_summary: roundSummary, // Pass the summary data
            time: new Date().toLocaleString(),
            link: round1ResultsLink,
            message: customMessage,
        };
        // --- End Prepare data ---

        // Check if EmailJS is initialized (public key is available)
        if (!emailjs.is){ // Check if init was successful
             console.error("EmailJS is not initialized. Check your public key and network.");
             showToast('Email service initialization failed. Cannot send email.', 'error');
             setIsSending(false);
             return;
        }


        await emailjs.send(
            ROUND1_SERVICE_ID,
            ROUND1_TEMPLATE_ID,
            templateParams,
            // ROUND1_PUBLIC_KEY // Public Key is typically passed in init, not send
        );

        showToast('Round 1 summary sent successfully!', 'success');
        setRecipientEmail(''); // Clear recipient email field
        setCustomMessage(''); // Clear custom message field
        // Optionally: e.target.reset(); // Resets the entire form

    } catch (error) {
        console.error('Email sending failed:', error);
        // Attempt to get a meaningful error message
        const errorMessage = error.text || (error instanceof Error ? error.message : 'Unknown error occurred.');
        showToast(`Failed to send email: ${errorMessage}`, 'error');
    } finally {
        setIsSending(false);
    }
  };
  // --- End Updated sendEmail function ---


  // --- JSX Rendering ---
  return (
    <ProtectedRoute>
      <div className="pixel-container">
        <Header step={2} />

        {/* Card for Heading and Estimator Info (remains mostly the same) */}
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
                {Array.isArray(e_name) && e_name.map((name, index) => (
                  <span key={index} className="estimator-name">{name || 'Pending'}</span>
                ))}
              </div>
            </div>
            {/* Conditional rendering for Date only on client side */}
            {isClient && <div className="date-display">Date: {new Date().toLocaleDateString()}</div>}
          </div>
        </div>

        {/* Card for Estimation Table */}
        <div className="card elevation-2">
          <div className="table-container">
            <table className="estimation-table">
              <thead>
                <tr>
                  <th>Modules</th>
                  {/* Ensure e_name is an array before mapping */}
                  {Array.isArray(e_name) && e_name.map((_, idx) => (
                    <th key={idx}>Estimator {idx + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Ensure taskList is an array before mapping */}
                {Array.isArray(taskList) && taskList.map((task, i) => (
                  <tr key={i}>
                    <td>{task}</td>
                    {/* Ensure round1 is an array before mapping */}
                    {Array.isArray(round1) && round1.map((est, j) => (
                      // Ensure est is an array before accessing index
                      <td key={j}>{(Array.isArray(est) && est[i] != null) ? est[i] : <span className="pending-text">Pending</span>}</td>
                    ))}
                  </tr>
                ))}
                {/* Ensure total_effort is an array and e_name is an array before rendering total/average rows */}
                {Array.isArray(total_effort) && Array.isArray(e_name) && e_name.length > 0 && (
                <>
                    <tr className="total-row">
                        <td>Total Effort</td>
                        {total_effort.map((val, idx) => (
                            <td key={idx}>{val != null ? val : 'N/A'}</td> 
                        ))}
                    </tr>
                    <tr className="average-row">
                        <td>Average</td>
                        {/* Ensure total_avg is a number before calling toFixed */}
                        <td colSpan={e_name.length}>{typeof total_avg === 'number' ? total_avg.toFixed(2) : 'N/A'}</td>
                    </tr>
                </>
                )}
                 {/* Optionally display a message if no data */}
                 {(taskList.length === 0 || e_name.length === 0) && (
                    <tr>
                        <td colSpan={(e_name.length > 0 ? e_name.length : 1) + 1} style={{ textAlign: 'center' }}>No estimation data available.</td>
                    </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Updated Card for Email Form --- */}
        {/* Only render the form client-side after data loads */}
        {isClient && (
           <div className="card elevation-2">
               <h5 className="card-subtitle">Send Round 1 Summary</h5>
               <form onSubmit={sendEmail} className="email-form">

                   {/* Recipient Email Input */}
                   <div className="input-container">
                       <input
                           type="email"
                           name="recipient_email" // Name attribute is optional if not using sendForm
                           value={recipientEmail}
                           onChange={(e) => setRecipientEmail(e.target.value)}
                           placeholder=" " // For floating label effect
                           required
                           className="email-input" // Reuse existing class or create new one
                       />
                       <label className="input-label">Recipient's Email</label>
                       <div className="underline"></div>
                   </div>

                   {/* Custom Message Textarea */}
                   <div className="input-container">
                       <textarea
                           name="custom_message" // Optional
                           value={customMessage}
                           onChange={(e) => setCustomMessage(e.target.value)}
                           rows="3"
                           placeholder="Add an optional message for the recipient"
                           className="message-input" // Reuse existing class or create new one
                       />
                       {/* No floating label needed for textarea typically, but add if desired */}
                   </div>

                   {/* Submit Button */}
                   <button
                       type="submit"
                       className="send-btn elevation-1"
                       // Disable if sending, or if required fields are empty or no project name/data
                       disabled={isSending || !recipientEmail || !projectName || taskList.length === 0 || e_name.length === 0}
                   >
                       {isSending ? (
                           <>
                               <span className="button-spinner"></span> {/* Use the same spinner class as Questionnaire */}
                               Sending...
                           </>
                       ) : (
                           'Send Summary Email'
                       )}
                   </button>
               </form>
           </div>
        )}
        {/* --- End Updated Email Form Card --- */}

        {/* Optional: Loader Overlay like in Questionnaire */}
        {isSending && (
           <div className="loader-overlay">
            <div className="loader"></div>
           </div>
        )}

      </div>
    </ProtectedRoute>
  );
};

export default Round1;