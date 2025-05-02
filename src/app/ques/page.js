'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import emailjs from '@emailjs/browser';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Delphi.css';
import { useAuth } from '../context/AuthContext';

// EmailJS configuration (Keep these)
const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const Questionnaire = () => {
  const { user } = useAuth();
  const [estimatorEmail, setEstimatorEmail] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [message, setMessage] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    // Check if running in the browser environment
    if (typeof window !== 'undefined') {
      emailjs.init(publicKey);
      const modules = localStorage.getItem('modules');
      const project = localStorage.getItem('projectName');

      if (modules) {
        try {
           setTaskList(JSON.parse(modules));
        } catch (e) {
           console.error("Failed to parse modules from localStorage:", e);
           localStorage.removeItem('modules');
           setTaskList([]);
        }
      }
      if (project) setProjectName(project);
    }
  }, []); // Add dependencies if user state affects this effect initialization (e.g., user load)

  const setProjectNameInLocalStorage = (name) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectName', name);
    } else {
      console.warn("window is not available to set project name in localStorage.");
    }
  }
  
  const showToast = (message, type) => {
    if (typeof window === 'undefined') return; 
     console.log(`TOAST: ${type.toUpperCase()} - ${message}`); 
     const toast = document.createElement('div');
     toast.className = `toast ${type}`;
     toast.textContent = message;
     document.body.appendChild(toast);

     setTimeout(() => toast.classList.add('show'), 10);
     setTimeout(() => {
       toast.classList.remove('show');
       setTimeout(() => {
         try {
           document.body.removeChild(toast);
         } catch (e) {
           console.warn("Toast element already removed:", e);
         }
       }, 300);
     }, 3000);
  };


  const sendEstimationRequest = async (e) => {
    e.preventDefault();

    if (!estimatorEmail) {
      showToast('Please enter the estimator\'s email.', 'warning');
      return;
    }
    if (!projectName) {
      showToast('Please enter the project name.', 'warning');
      return;
    }

    setIsSending(true);

    try {
      const senderEmail = user ? user.email : (typeof window !== 'undefined' ? localStorage.getItem('loggedin_user') : null);
      if (!senderEmail) {
        throw new Error("Logged-in user email not found. Please log in again.");
      }
      let round1ResultsLink = '';

      if (typeof window !== 'undefined') {
        const origin = window.location.origin; 
        round1ResultsLink = `${origin}/input_r1`;
      } else {
        console.warn("window is not available to construct the Round 1 link during server render.");
        round1ResultsLink = 'Link not available'; 
      }

      const templateParams = {
        to_email: estimatorEmail,
        from_name: user ? `${user.fname} ${user.lname}` : 'EstimateUp User', 
        reply_to: senderEmail,
        project_name: projectName,
        time: new Date().toLocaleString(),
        message: customMessage,
        link: round1ResultsLink,
        sender_email: senderEmail,
      };

      await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );

      showToast('Estimation request sent successfully!', 'success');
      setEstimatorEmail('');
      setCustomMessage(''); // Clear custom message field too
    } catch (error) {
      console.error('Email sending failed:', error);
      const errorMessage = error.text || error.message || 'Please check your connection or EmailJS configuration.';
      showToast(`Failed to send email: ${errorMessage}`, 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Ensure user data is loaded if using AuthContext before rendering the form
  // This check might need refinement depending on how useAuth handles loading/initial state
  // If ProtectedRoute handles this, this check might be redundant or need adjustment
  // if (!user && typeof window !== 'undefined' && !localStorage.getItem('loggedin_user')) {
  //   // You might want to show a loading state or redirect if not logged in
  //   // This component is inside ProtectedRoute, so this might not be necessary
  //   return <div>Loading user data...</div>; // Or handle redirect via ProtectedRoute/useEffect
  // }
  // If user is null initially but AuthContext is loading, you might render a loader here
  // If ProtectedRoute guarantees 'user' is available or redirects, this check can be simpler or removed.


  return (
    <ProtectedRoute>
      <div className="pixel-container">
        <Header step={1} />

        <div className="card elevation-2">
          <h3 className="card-title">Modules for Estimation - {projectName}</h3>
          <div className="table-container">
            <table className="estimation-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Module Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {taskList.length > 0 ? (
                   taskList.map((module, index) => (
                     <tr key={index}>
                       <td>{index + 1}</td>
                       <td>{module.Name}</td>
                       <td>{module.Description}</td>
                     </tr>
                   ))
                ) : (
                   <tr>
                       <td colSpan="3" style={{ textAlign: 'center' }}>No modules loaded or defined.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card elevation-2">
          <h5 className="card-subtitle">Send Estimation Request</h5>

          <form onSubmit={sendEstimationRequest} className="email-form">
            {/* ... form fields (Estimator's Email, Project Name, Custom Message) ... */}
            <div className="input-container">
              <input type="email"
                className='email-input'
                required
                value={estimatorEmail}
                onChange={(e) => setEstimatorEmail(e.target.value)}
                placeholder="Estimator's Email"
              />
              <div className="underline"></div>
            </div>

            <div className="input-container">
              <input
                type="text"
                className='email-input'
                required
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setProjectNameInLocalStorage(e.target.value); // save to localStorage on change
                }}
                placeholder="Input Project Name"
              />
            </div>

            <div className="input-container">
              <textarea
                value={customMessage}
                className='message-input'
                required
                onChange={(e) => setCustomMessage(e.target.value)}
                rows="3"
                placeholder="Add a personalized message for the estimator"
              />
            </div>
            {/* ... rest of form and button ... */}
            <button
              type="submit"
              className="send-btn elevation-1"
              disabled={isSending || !estimatorEmail || !projectName || taskList.length === 0} // Disable if no tasks
            >
              {isSending ? (
                <>
                  <span className="button-spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Estimation Request'
              )}
            </button>

          </form>
        </div>
      </div>
      {/* Render MessageCard and loader - Ensure MessageCard also handles potential SSR */}
      {/* Assuming MessageCard is a client component or handles SSR safely */}
      {/* {message && (
        <MessageCard
          type={message.type}
          message={message.message}
          subMessage={message.subMessage}
          onClose={() => setMessage(null)}
        />
      )} */}

      {isSending && (
        // Ensure loader-overlay and loader styles/elements are safe for SSR or only appear client-side
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default Questionnaire;