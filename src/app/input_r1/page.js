'use client';

import { useState, useEffect } from 'react';
import '../styles/Delphi.css'; // Ensure your combined styles are here
import ProtectedRoute from '../components/ProtectedRoute';

const InputRound1 = () => {
  const [taskList, setTaskList] = useState([]);
  const [estimator, setEstimator] = useState('');
  const [estimations, setEstimations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [existingEstimators, setExistingEstimators] = useState([]);

  // Effect 1: Load initial data (tasks and existing estimators)
  useEffect(() => {
    const loadData = () => {
      const storedModules = localStorage.getItem('modules');
      if (storedModules) {
        setTaskList(JSON.parse(storedModules));
      } else {
         setTaskList([]); // Ensure taskList is always an array
      }

      const estimationData = JSON.parse(localStorage.getItem('estimationData')) || [];
      setExistingEstimators(estimationData.map(item => item.estimator_name));
      setIsLoading(false);
    };

    loadData();
  }, []); // Empty dependency array: runs once on mount

  const handleInputChange = (index, value) => {
    const updatedEstimations = [...estimations];
     // Ensure estimations array is initialized with empty strings if needed
     while(updatedEstimations.length < taskList.length) {
        updatedEstimations.push('');
    }
    updatedEstimations[index] = value;
    setEstimations(updatedEstimations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!estimator.trim()) {
      alert('Please enter your name as estimator.');
      return;
    }

     // Check if estimations array matches taskList size and all estimations are filled and valid
     const hasEmpty = estimations.length !== taskList.length ||
                       estimations.some(val => !val || isNaN(val) || Number(val) <= 0);


    if (hasEmpty) {
      alert('Please enter valid positive numbers for all estimations.');
      return;
    }

    const estimationData = {
      estimator_name: estimator.trim(),
      r1_estimation: estimations.map(Number),
      r2_estimation: [],
      r3_estimation: [],
    };

    const existingData = JSON.parse(localStorage.getItem('estimationData')) || [];

    const existingIndex = existingData.findIndex(
      item => item.estimator_name.toLowerCase() === estimator.trim().toLowerCase()
    );

    let updatedData;
    if (existingIndex >= 0) {
      // Confirm before overwriting existing data
      const shouldOverwrite = confirm(`${estimator.trim()} already has Round 1 data. Overwrite?`);
      if (!shouldOverwrite) return;

      updatedData = [...existingData];
      updatedData[existingIndex] = estimationData;
    } else {
      updatedData = [...existingData, estimationData];
    }

    localStorage.setItem('estimationData', JSON.stringify(updatedData));
    alert('Round 1 estimations saved successfully!');

    setEstimations([]);
    setEstimator('');
    // Optionally reload existing estimators after saving
    const updatedEstimationData = JSON.parse(localStorage.getItem('estimationData')) || [];
    setExistingEstimators(updatedEstimationData.map(item => item.estimator_name));

  };

  if (isLoading) {
    // Use a themed loading indicator if you have one, or keep simple text
    return <div className="loading">Loading modules...</div>;
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
        <h3 className="card-title">Round 1 Estimations</h3> {/* Use card-title */}
      </div>

       {/* Wrap Estimator Input in a Card */}
      <div className="card elevation-2">
         <div className="estimator-input-container form-group"> {/* Keep inner container and form-group */}
           <label htmlFor="estimator-name-r1" className="label">Your Name</label> {/* Added label */}
           <input
             id="estimator-name-r1" // Added ID for label
             type="text"
             className="pixel-input" // Use pixel-input class
             placeholder="Enter your name" // Changed placeholder text
             value={estimator}
             onChange={(e) => setEstimator(e.target.value)}
             list="estimatorList" // Keep datalist if you're using it
             required
           />
           {/* Optional: Add a datalist for existing estimators */}
           {existingEstimators.length > 0 && (
               <datalist id="estimatorList">
                   {existingEstimators.map((name, index) => (
                       <option key={index} value={name} />
                   ))}
               </datalist>
           )}
           {existingEstimators.length > 0 && (
             // Use small tag and potentially a class for hint text
             <small className="estimator-hint">
               Existing estimators: {existingEstimators.join(', ')}
             </small>
           )}
         </div>
      </div>

       {/* Wrap Table and Form in a Card */}
      <div className="card elevation-2">
         <form onSubmit={handleSubmit}> {/* Form remains */}
           <div className="table-container"> {/* Use table-container */}
             {/* Removed extra whitespace between table tags */}
             <table className="estimation-table">
               <thead>
                 <tr>
                   <th>Module</th>
                   <th>Description</th>
                   <th>Estimation (hours)</th>
                 </tr>
               </thead>
               <tbody>
                 {taskList.map((obj, i) => (
                   <tr key={i}>
                     <td className="module-name">{obj.Name}</td>
                     <td className="module-desc">{obj.Description}</td>
                     <td className="module-estimation">
                       {/* Use pixel-like input class */}
                       <input
                         type="number"
                         className="pixel-input" // Use pixel-input class
                         min="0.5"
                         step="0.5"
                         placeholder="0.5"
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
               Save Round 1 {/* Button text */}
              </button>
            </div>
         </form> {/* Close form */}
      </div> {/* Close card */}
    </div> 
    </ProtectedRoute>
  );
};

export default InputRound1;