'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/fp.css';

// Define input field configuration outside the component for clarity
const INPUT_FIELDS = [
  { id: 'in', label: 'Number of User Inputs' },
  { id: 'out', label: 'Number of User Outputs' },
  { id: 'inq', label: 'Number of Inquiries' },
  { id: 'files', label: 'Number of Files (ILF/EIF)' }, // Added clarification
  { id: 'ext_int', label: 'Number of External Interfaces' },
];

// Define Weighting Factor configuration (Mapping key to values and labels)
const WEIGHTING_FACTORS = {
  simple: { value: 1, label: 'Simple', weights: { p: 3, q: 4, r: 3, s: 7, t: 5 } },
  average: { value: 2, label: 'Average', weights: { p: 4, q: 5, r: 4, s: 10, t: 7 } },
  complex: { value: 3, label: 'Complex', weights: { p: 6, q: 7, r: 6, s: 15, t: 10 } },
};

// Define General System Characteristics (GSC) Questions for DI
const DI_QUESTIONS = [
  "Does the system require reliable backup and recovery?",
  "Are data communications required?",
  "Are there distributed processing functions?",
  "Is performance critical?",
  "Will the system run in an existing, heavily utilized operational environment?",
  "Does the system require online data entry?",
  "Does the online data entry require the input transaction to be built over multiple screens or operations?",
  "Are the inputs, outputs, files, or inquiries complex?", // Note: Standard IFPUG rates complexity per function type, this is a simplification.
  "Are the master files updated online?",
  "Is the internal processing complex?",
  "Is the code designed to be reusable?",
  "Are conversion and installation included in the design?",
  "Is the system designed for multiple installations in different organizations?",
  "Is the application designed to facilitate change and ease of use by the user?" // Corrected typo 'by user' -> 'by the user'
];

const FunctionF = () => {
  // State for final calculations
  const [ufp, setUfp] = useState('');
  const [di, setDi] = useState('');
  const [fp, setFp] = useState('');

  // State for UFP inputs using controlled components
  const [weightingFactorType, setWeightingFactorType] = useState('average'); // Default to average
  const [inputValues, setInputValues] = useState(
    INPUT_FIELDS.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {})
  );

  // State for Modal and DI questions
  const [showModal, setShowModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(''); // Current answer in modal input
  const [answers, setAnswers] = useState([]); // Array of answers for DI calculation
  const modalInputRef = useRef(null); // Ref for focusing modal input

  // State for loading and errors
  const [isCalculatingUFP, setIsCalculatingUFP] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data from localStorage on initial render
  useEffect(() => {
    loadData();
  }, []);

  // Focus input when modal opens or question changes
  useEffect(() => {
    if (showModal && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [showModal, currentQuestionIndex]);

  // --- Data Persistence ---
  const saveData = (currentUfp, currentDi, currentFp) => {
    try {
      const data = {
        ufp: currentUfp ?? ufp, // Use passed value or existing state
        di: currentDi ?? di,
        fp: currentFp ?? fp,
        inputs: {
          wf: weightingFactorType,
          ...inputValues,
        },
        answers: currentDi !== undefined ? answers : (JSON.parse(localStorage.getItem('fpCalculatorData') || '{}').answers || []), // Preserve answers if DI isn't being updated now
      };
      // Ensure answers are saved correctly when DI is calculated
      if (currentDi !== undefined) {
        data.answers = answers;
      }
      localStorage.setItem('fpCalculatorData', JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      // Handle potential storage errors (e.g., quota exceeded)
    }
  };

  const loadData = () => {
    try {
      const savedData = localStorage.getItem('fpCalculatorData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setUfp(data.ufp || '');
        setDi(data.di || '');
        setFp(data.fp || '');
        setWeightingFactorType(data.inputs?.wf || 'average');
        // Initialize inputValues based on INPUT_FIELDS to ensure all keys exist
        const loadedInputValues = INPUT_FIELDS.reduce((acc, field) => {
          acc[field.id] = data.inputs?.[field.id] || '';
          return acc;
        }, {});
        setInputValues(loadedInputValues);
        setAnswers(data.answers || []);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      localStorage.removeItem('fpCalculatorData'); // Clear corrupted data
    }
  };

  // --- Input Handling ---
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Allow only non-negative integers (or empty string)
    if (/^\d*$/.test(value)) {
      setInputValues((prev) => ({ ...prev, [id]: value }));
      // Clear error for this field on valid input
      if (errors[id]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id]; // Remove the key entirely
          return newErrors;
        });
      }
      // Clear downstream results if inputs change
      setUfp('');
      setDi('');
      setFp('');
      setAnswers([]); // Reset DI answers if inputs change
      // No need to call saveData here, UFP calc will save
    }
  };

  const handleWeightingFactorChange = (type) => {
    setWeightingFactorType(type);
    // Clear downstream results if complexity changes
    setUfp('');
    setDi('');
    setFp('');
    setAnswers([]); // Reset DI answers if complexity changes
    // No need to call saveData here, UFP calc will save
  };

  // --- Calculation Logic ---
  const calculateUFP = () => {
    setIsCalculatingUFP(true);
    setErrors({}); // Clear previous errors
    const newErrors = {};

    // Validate function counts
    let hasErrors = false;
    INPUT_FIELDS.forEach(({ id }) => {
      const value = inputValues[id];
      if (value === '' || isNaN(Number(value)) || Number(value) < 0) {
        newErrors[id] = 'Enter a valid count (0 or more).';
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setIsCalculatingUFP(false);
      return;
    }

    // Get weights based on selected factor
    const { weights } = WEIGHTING_FACTORS[weightingFactorType];

    // Calculate UFP
    const calculatedUfp = (
      (weights.p * Number(inputValues.in)) +
      (weights.q * Number(inputValues.out)) +
      (weights.r * Number(inputValues.inq)) +
      (weights.s * Number(inputValues.files)) +
      (weights.t * Number(inputValues.ext_int))
    );

    setUfp(calculatedUfp);
    setIsCalculatingUFP(false);
    // Clear DI/FP since UFP changed
    setDi('');
    setFp('');
    setAnswers([]); // Reset DI answers as DI needs recalc
    saveData(calculatedUfp, '', ''); // Save UFP, clear DI/FP in storage
  };

  const calculateFP = () => {
    // Ensure necessary values are numbers and present
    const ufpValue = Number(ufp);
    const diValue = Number(di);
    if (isNaN(ufpValue) || ufpValue === '' || isNaN(diValue) || diValue === '') return;

    const vaf = 0.65 + (0.01 * diValue); // Value Adjustment Factor
    const calculatedFp = ufpValue * vaf;

    // Round to a reasonable number of decimal places (e.g., 2)
    const roundedFp = Math.round(calculatedFp * 100) / 100;

    setFp(roundedFp);
    saveData(ufp, di, roundedFp); // Save final FP
  };

  // --- Modal Logic ---
  const startComplexityQuestions = () => {
    setAnswers([]); // Reset answers for a fresh start
    setCurrentQuestionIndex(0);
    setUserAnswer(''); // Clear input field
    setDi(''); // Clear previous DI result
    setFp(''); // Clear previous FP result as DI will change
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Optional: If closed prematurely, maybe revert DI/FP state?
    // For now, just closes the modal. State remains as it was before opening if not finished.
  };

  const handleAnswerChange = (e) => {
    const value = e.target.value;
    // Allow only single digits between 0 and 5
    if (/^[0-5]?$/.test(value)) {
      setUserAnswer(value);
    }
  };

  const handleAnswerSubmit = () => {
    // Validate the current answer before proceeding
    const answer = parseInt(userAnswer, 10);
    if (userAnswer === '' || isNaN(answer) || answer < 0 || answer > 5) {
      // Optionally show an inline validation message or shake animation
      if (modalInputRef.current) {
        modalInputRef.current.focus(); // Keep focus on invalid input
      }
      return;
    }

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setUserAnswer(''); // Clear input for next question

    if (currentQuestionIndex < DI_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Focus will be handled by the useEffect hook watching currentQuestionIndex
    } else {
      // All questions answered - calculate DI
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      setDi(sum);
      setShowModal(false);
      setFp(''); // Clear old FP, needs recalculation
      saveData(ufp, sum, ''); // Save UFP and new DI, clear FP in storage
    }
  };

  const handleModalKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Prevent default form submission if wrapped in form
      e.preventDefault();
      // Check if the submit button is enabled before submitting
      const isValid = userAnswer !== '' && parseInt(userAnswer, 10) >= 0 && parseInt(userAnswer, 10) <= 5;
      if (isValid) {
        handleAnswerSubmit();
      }
    } else if (e.key === 'Escape'){
      closeModal();
    }
  };

  const undoLastAnswer = () => {
    if (answers.length > 0 && currentQuestionIndex > 0) {
      const lastAnswer = answers[answers.length - 1]; // Get the value being undone
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Pre-fill input with the undone value for quick correction?
      setUserAnswer(lastAnswer.toString());
      // Focus will be handled by the useEffect hook
    }
  };

  // --- Render Logic ---
  const isUfpCalculated = ufp !== '' && !isNaN(Number(ufp));
  const isDiCalculated = di !== '' && !isNaN(Number(di));
  const isModalInputValid = userAnswer !== '' && parseInt(userAnswer, 10) >= 0 && parseInt(userAnswer, 10) <= 5;

  return (
    <ProtectedRoute>
      <Head>
        {/* Metadata remains the same */}
        <title>Function Point Calculator | EstimateUp</title>
         <meta
          name="description"
          content="Use this free Function Point Estimation tool to calculate Unadjusted Function Points (UFP) and total FP based on software complexity factors. Ideal for project estimation."
        />
        <meta property="og:title" content="Function Point Estimator | EstimateUp" />
        <meta
          property="og:description"
          content="Calculate software Function Points easily using our interactive online calculator. Perfect for developers, engineers, and project managers."
        />
        <meta property="og:url" content="https://estimate-up.vercel.app/fp" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://estimate-up.vercel.app/fp" />
      </Head>

      <div className="main cocomo-pixel-theme">
        <h1 className='t_name'>Function Point Calculator</h1>

        {/* Step 1: Calculate UFP */}
        <section className="step-section">
          <div className="step-heading-container">
            <h2 className="step-heading">Step 1: Calculate UFP</h2>
          </div>

          {/* Weighting Factor Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Function Types</th>
                  <th>Simple</th>
                  <th>Average</th>
                  <th>Complex</th>
                </tr>
              </thead>
              <tbody className='table-body'>
                <tr><td>1</td><td>Number of User Inputs</td><td>3</td><td>4</td><td>6</td></tr>
                <tr><td>2</td><td>Number of User Outputs</td><td>4</td><td>5</td><td>7</td></tr>
                <tr><td>3</td><td>Number of User Inquiries</td><td>3</td><td>4</td><td>6</td></tr>
                <tr><td>4</td><td>Number of Files (ILF/EIF)</td><td>7</td><td>10</td><td>15</td></tr>
                <tr><td>5</td><td>Number of External Interfaces</td><td>5</td><td>7</td><td>10</td></tr>
              </tbody>
            </table>
          </div>

           <p className="instruction-text small-instruction">
              Select the overall project complexity based on the table above, then enter the counts for each function type. Changing inputs or complexity will require recalculating subsequent steps.
            </p>


          {/* Weighting Factor Selection Buttons */}
          <div className="input-group">
            <label className="label-bold">Project Complexity Level:</label>
            <div className="weighting-factor-options">
              {Object.entries(WEIGHTING_FACTORS).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  className={`wf-option-button ${weightingFactorType === key ? 'active' : ''}`}
                  onClick={() => handleWeightingFactorChange(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>


          {/* Function Count Inputs */}
          <div className="input-grid">
            {INPUT_FIELDS.map(({ id, label }) => (
              <div className="input-group" key={id}>
                <label htmlFor={id}>{label}:</label>
                <input
                  type="number" // Use number for semantics & mobile keyboards
                  inputMode="numeric" // Hint for numeric keyboard
                  pattern="[0-9]*" // Pattern for validation reinforcement
                  id={id}
                  min="0"
                  value={inputValues[id]}
                  onChange={handleInputChange}
                  className={errors[id] ? 'input-error' : ''}
                  aria-describedby={errors[id] ? `${id}-error` : undefined}
                  aria-invalid={errors[id] ? 'true' : 'false'}
                />
                {errors[id] && <div id={`${id}-error`} className="error-message" role="alert">{errors[id]}</div>}
              </div>
            ))}
          </div>

          {/* Calculate UFP Button */}
          <div className='btn-43-container'> {/* Use a container for better centering/layout */}
            <button
              className="button-43"
              onClick={calculateUFP}
              disabled={isCalculatingUFP}
              aria-live="polite" // Announce changes when calculating
            >
              {isCalculatingUFP ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span> Calculating...
                </>
              ) : 'Calculate UFP'}
            </button>
          </div>

          {/* UFP Result */}
           {isUfpCalculated && (
            <div className="results-section">
              <div className="result-card" role="status">
                <div className="result-label">Unadjusted Function Points (UFP)</div>
                <div className="result-value">{ufp}</div>
              </div>
            </div>
          )}
        </section>

        <hr className="divider" />

        {/* Step 2: Determine DI */}
        <section className="step-section">
          <div className="step-heading-container">
            <h2 className="step-heading">Step 2: Determine DI</h2>
          </div>

          <p className="instruction-text small-instruction">
            Rate the influence of the following 14 General System Characteristics (GSCs) on a scale of 0 (Not present/No influence) to 5 (Strong influence). UFP must be calculated first.
          </p>

          {/* Button to open DI Modal */}
          <div className='btn-43-container'>
            <h3>Assess Complexity Factors (GSCs)</h3>
            <button
              className="button-43"
              onClick={startComplexityQuestions}
              disabled={!isUfpCalculated} // Disable if UFP isn't calculated
              aria-label={isDiCalculated ? "Re-assess complexity factors (DI)" : "Assess complexity factors (DI)"}
            >
              {isDiCalculated ? 'Re-assess Complexity Factors' : 'Assess Complexity Factors'}
            </button>
          </div>

          {/* DI Result */}
          {isDiCalculated && (
            <div className="results-section">
              <div className="result-card" role="status">
                <div className="result-label">Degree of Influence (DI)</div>
                <div className="result-value">{di}</div>
              </div>
            </div>
          )}
        </section>

        {/* Modal for DI Questions */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal} onKeyDown={handleModalKeyDown}>
             <div className="modal-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
              {/* Progress Bar */}
               <div className="progress-bar-container">
                 <div className="progress-bar" aria-valuenow={currentQuestionIndex + 1} aria-valuemin="1" aria-valuemax={DI_QUESTIONS.length}>
                   <div
                     className="progress-fill"
                     style={{ width: `${((currentQuestionIndex + 1) / DI_QUESTIONS.length) * 100}%` }}
                   />
                 </div>
               </div>

              <div className="modal-header">
                <h3 id="modal-title">Complexity Factor {currentQuestionIndex + 1} of {DI_QUESTIONS.length}</h3>
              </div>

              <div className="modal-body">
                <p id="modal-description" className="modal-question">{DI_QUESTIONS[currentQuestionIndex]}</p>
                  <p className="scale-reminder">(Rate 0 = No Influence to 5 = Strong Influence)</p>
                <div className="input-container">
                  <label htmlFor="complexity-answer">Your Rating (0-5):</label>
                  <input
                    ref={modalInputRef}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-5]" // More specific pattern
                    id="complexity-answer"
                    min="0"
                    max="5"
                    value={userAnswer}
                    onChange={handleAnswerChange}
                    // onKeyDown handled by modal container
                    className="modal-input"
                    autoFocus
                    required
                    aria-required="true"
                    aria-invalid={!isModalInputValid && userAnswer !== ''} // Indicate invalid if not empty and not valid
                  />
                   {/* Optional: Inline validation message */}
                   {/* {!isModalInputValid && userAnswer !== '' && <div className="error-message modal-error">Enter a number between 0 and 5.</div>} */}
                </div>
              </div>

              <div className="modal-footer">
                  {/* Group navigation buttons */}
                  <div className="modal-nav-buttons">
                      {/* Undo Button - Conditionally Rendered */}
                      {answers.length > 0 && currentQuestionIndex > 0 && (
                          <button
                              className="button-43 modal-button secondary"
                              onClick={undoLastAnswer}
                              aria-label="Undo last rating and go back"
                          >
                              Undo Last
                          </button>
                      )}
                       {/* Next/Finish Button */}
                      <button
                          className="button-43 modal-button"
                          onClick={handleAnswerSubmit}
                          disabled={!isModalInputValid}
                          aria-disabled={!isModalInputValid}
                      >
                          {currentQuestionIndex < DI_QUESTIONS.length - 1 ? 'Next Question' : 'Finish & Calculate DI'}
                      </button>
                  </div>
                   {/* Close Button */}
                   <button
                      onClick={closeModal}
                      className="button-43 modal-button secondary close-button"
                      aria-label="Close complexity assessment without saving current step"
                    >
                      Close
                    </button>
              </div>
            </div>
          </div>
        )}

        <hr className="divider" />

        {/* Step 3: Final FP */}
        <section className="step-section">
          <div className="step-heading-container">
            <h2 className="step-heading">Step 3: Calculate Final FP</h2>
          </div>

          <p className="instruction-text small-instruction">
            Calculates the final Adjusted Function Points (FP) using the UFP and DI values. Both UFP and DI must be determined first.
          </p>

          {/* Calculate Final FP Button */}
          <div className='btn-43-container'>
            <button
              className="button-43"
              onClick={calculateFP}
              disabled={!isUfpCalculated || !isDiCalculated} // Disable if UFP or DI missing
            >
              Calculate Final FP
            </button>
          </div>

          {/* Final FP Result */}
          {/* Always render the card structure, show value or placeholder */}
          <div className="results-section">
            <div className={`result-card ${fp ? 'highlight' : ''}`} role="status" aria-live="polite">
              <div className="result-label">Final Adjusted Function Points (FP)</div>
              <div className="result-value">{fp !== '' ? fp : '--'}</div>
               {fp !== '' && <p className="formula-note" aria-label="Formula used: FP equals UFP multiplied by (0.65 plus 0.01 multiplied by DI)"> (FP = UFP * [0.65 + 0.01 * DI])</p>}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className='button-navigation'>
        <Link href="/cocomo" className="cocomo-pixel-text-button">
        <svg className="cocomo-pixel-icon" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
          <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
        </svg>
        Go Back
      </Link>

          <Link href="/sloc" className="button-primary">
            Source Lines of Code <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FunctionF;