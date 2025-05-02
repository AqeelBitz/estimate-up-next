'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Delphi.css'; 


const InputRound2 = () => {
  const [taskList, setTaskList] = useState([]);
  const [estimator, setEstimator] = useState('');
  const [estimations, setEstimations] = useState([]);
  const [availableEstimators, setAvailableEstimators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousEstimations, setPreviousEstimations] = useState([]); // Will hold Round 1 estimates

  // Effect 1: Load initial data (tasks and available estimators who completed Round 1)
  useEffect(() => {
    const loadData = () => {
      const storedModules = localStorage.getItem('modules');
      if (storedModules) {
        setTaskList(JSON.parse(storedModules));
      } else {
         setTaskList([]); // Ensure taskList is always an array
      }

      const estimationData = JSON.parse(localStorage.getItem('estimationData')) || [];
      // Only get estimators who have completed Round 1
      const round1Estimators = estimationData.filter(item => item.r1_estimation?.length > 0);
      setAvailableEstimators(round1Estimators.map(item => item.estimator_name));
      setIsLoading(false);
    };

    loadData();
  }, []); // Empty dependency array: runs once on mount

  // Effect 2: Load previous estimations (Round 1) and initialize current estimations (Round 2)
  // Added isLoading to dependencies and an early return to help with dev mode strictness.
  useEffect(() => {
     // Only proceed if data is loaded and an estimator is selected
    if (isLoading || !estimator.trim()) {
        // Clear state if estimator is cleared or data is still loading
        if (!estimator.trim()) {
             setPreviousEstimations([]);
             setEstimations([]);
        }
        return;
    }

    const estimationData = JSON.parse(localStorage.getItem('estimationData')) || [];
    const estimatorData = estimationData.find(
      item => item.estimator_name.toLowerCase() === estimator.trim().toLowerCase()
    );

    // Always initialize estimations based on current taskList size
    // Ensure it's an array of the correct size, filled with empty strings for inputs
    const initialEstimates = Array(taskList.length).fill('');
    const previousEstimatesArray = estimatorData?.r1_estimation || []; // Get Round 1 estimates

    if (previousEstimatesArray.length > 0) {
      setPreviousEstimations(previousEstimatesArray);
      // Pre-fill the initialEstimates array with previous round's estimates,
      // ensuring size matches taskList and converting numbers to strings for input value.
       previousEstimatesArray.forEach((est, index) => {
           if (index < taskList.length) {
              initialEstimates[index] = String(est); // Convert to string for input value
           }
       });
       setEstimations(initialEstimates); // Initialize current estimates (R2 input)

    } else {
      // If no Round 1 data or empty array, set previous to empty and estimations to empty array of taskList size
      setPreviousEstimations([]);
      setEstimations(initialEstimates); // Use the initialized array of taskList size
       // Optional: show a warning or message if R1 data is missing for the selected name
       if (estimatorData && !estimatorData.r1_estimation?.length) {
            console.warn(`No Round 1 data found for ${estimator.trim()}`);
       }
    }

  }, [estimator, taskList.length, isLoading]); // Added isLoading to dependencies

  const handleInputChange = (index, value) => {
    const updatedEstimations = [...estimations];
    // Ensure estimations array is initialized with empty strings if needed
    // This handles cases where taskList might load after estimator is selected
    while(updatedEstimations.length < taskList.length) {
        updatedEstimations.push('');
    }
    updatedEstimations[index] = value;
    setEstimations(updatedEstimations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!estimator.trim()) {
      alert('Please select your name from the list.');
      return;
    }

    if (!availableEstimators.some(name =>
      name.toLowerCase() === estimator.trim().toLowerCase()
    )) {
      alert('Please complete Round 1 first or check your name spelling.');
      return;
    }

     // Check if all estimations are filled and valid (should match the number of tasks)
     const hasEmpty = estimations.length !== taskList.length ||
                       estimations.some(val => !val || isNaN(val) || Number(val) <= 0);


    if (hasEmpty) {
      alert('Please enter valid positive numbers for all estimations.');
      return;
    }

    updateEstimationData(estimator.trim(), estimations.map(Number));
  };

  const updateEstimationData = (estimatorName, round2Estimations) => {
    const estimationData = JSON.parse(localStorage.getItem('estimationData')) || [];

    const index = estimationData.findIndex(
      item => item.estimator_name.toLowerCase() === estimatorName.toLowerCase()
    );

    if (index !== -1) {
      const updatedData = [...estimationData];
      updatedData[index] = {
        ...updatedData[index],
        r2_estimation: round2Estimations // Save as Round 2 estimation
      };

      localStorage.setItem('estimationData', JSON.stringify(updatedData));
      alert('Round 2 estimations saved successfully!');

      // Reset state after successful submission
      setEstimations([]);
      setEstimator('');
      setPreviousEstimations([]); // Clear Round 1 display

      // Optionally reload available estimators if needed (e.g., if submitting unlocks R3)
      // const updatedEstimationData = JSON.parse(localStorage.getItem('estimationData')) || [];
      // const round1Estimators = updatedEstimationData.filter(item => item.r1_estimation?.length > 0);
      // setAvailableEstimators(round1Estimators.map(item => item.estimator_name));

    } else {
      // This should ideally not happen if selected from the list
      alert("Estimator not found. Please complete Round 1 first.");
    }
  };

  if (isLoading) {
    // Use a themed loading indicator if you have one, or keep simple text
    return <div className="loading">Loading data...</div>;
  }

  // Render null or a message if taskList is empty after loading
  if (!taskList || taskList.length === 0) {
      return (
         <div className="pixel-container"> {/* Use pixel-container */}
           <div className="card elevation-2"> {/* Wrap in a card */}
              <h3 className="card-title">No Modules Found</h3> {/* Use card-title */}
              <p>Please add modules in the main section first.</p>
           </div>
         </div>
      );
  }


  return (
    <ProtectedRoute>
    <div className="pixel-container">
       {/* Wrap Title in a Card */}
      <div className="card elevation-2">
        <h3 className="card-title">Round 2 Estimations</h3> {/* Use card-title */}
      </div>

       {/* Wrap Estimator Input in a Card */}
      <div className="card elevation-2">
         <div className="estimator-input-container form-group"> {/* Keep inner container and form-group */}
           <label htmlFor="estimator-name-r2" className="label">Select Your Name</label> {/* Added label */}
           <input
             id="estimator-name-r2" // Added ID for label
             type="text"
             className="pixel-input" // Use pixel-input class
             placeholder="Select your name from the list" // Changed placeholder text
             value={estimator}
             onChange={(e) => setEstimator(e.target.value)}
             list="estimatorList" // Keep datalist
             required
           />
           <datalist id="estimatorList">
             {availableEstimators.map((name, index) => (
               <option key={index} value={name} />
             ))}
           </datalist>
           {availableEstimators.length > 0 && (
             // Use small tag and potentially a class for hint text
             <small className="estimator-hint">
               Available estimators (completed R1): {availableEstimators.join(', ')}
             </small>
           )}
         </div>
      </div>

       {/* Wrap Table and Form in a Card */}
      <div className="card elevation-2">
         <form onSubmit={handleSubmit}> {/* Form remains */}
           <div className="table-container"> 
             <table className="estimation-table">
               <thead>
                 <tr>
                   <th>Module</th>
                   <th>Description</th>
                   <th>Round 1</th>
                   <th>Round 2 (hours)</th>
                 </tr>
               </thead>
               <tbody>
                 {taskList.map((obj, i) => (
                   <tr key={i}>
                     <td className="module-name">{obj.Name}</td>
                     <td className="module-desc">{obj.Description}</td>
                      {/* Display previous estimation (Round 1) */}
                     <td className="previous-estimate pending-text"> {/* Added pending-text for styling */}
                       {previousEstimations[i] !== undefined && previousEstimations[i] !== '' ? previousEstimations[i] : '-'}
                     </td>
                     <td className="module-estimation">
                       {/* Use pixel-like input class */}
                       <input
                         type="number"
                         className="pixel-input" // Use pixel-input class
                         min="0.5"
                         step="0.5"
                         // Use previous estimation as placeholder if available
                         placeholder={previousEstimations[i] !== undefined && previousEstimations[i] !== '' ? previousEstimations[i] : '0.5'}
                         value={estimations[i] !== undefined ? estimations[i] : ''} // Use estimations state directly and handle undefined
                         onChange={(e) => handleInputChange(i, e.target.value)}
                         required
                       />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
            </div> {/* Close table-container */}

             {/* Container for the submit button */}
             {/* Using send-btn styling from Round1 */}
            <div className="submit-button-container" style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
              <button
                 type="submit"
                 className="send-btn elevation-1" // Use send-btn and elevation-1
                 disabled={false} // Disable if submitting? Your original had isSending
              >
               Save Round 2 {/* Button text */}
              </button>
            </div>
         </form> {/* Close form */}
      </div> {/* Close card */}
    </div> 
    </ProtectedRoute>
  );
};

export default InputRound2;