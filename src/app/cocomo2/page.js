'use client';

import { useState } from 'react';
import Head from 'next/head';
import '../styles/Cocomo2.css';
import ProtectedRoute from '../components/ProtectedRoute';

// Constants for DRY principles
const FP_CHARACTERISTICS = [
    { id: 'fp1', label: 'Data transmission complexity' },
    { id: 'fp2', label: 'Distributed data processing complexity' },
    { id: 'fp3', label: 'Performance requirements' },
    { id: 'fp4', label: 'Operating restrictions' },
    { id: 'fp5', label: 'Transaction frequency' },
    { id: 'fp6', label: 'Online data entry complexity' },
    { id: 'fp7', label: 'End User Efficiency' },
    { id: 'fp8', label: 'Live update complexity' },
    { id: 'fp9', label: 'Complexity of processing' },
    { id: 'fp10', label: 'Reusability requirements' },
    { id: 'fp11', label: 'Ease of installation' },
    { id: 'fp12', label: 'Ease of operation' },
    { id: 'fp13', label: 'Multi-platform installation complexity' },
    { id: 'fp14', label: 'Ease of change' },
];

const SCALE_FACTORS = [
    {
        name: 'prec', label: 'Precedentedness', options: [
            { value: 0, label: 'Select' }, { value: 6.2, label: 'VL' },
            { value: 4.9, label: 'L' }, { value: 3.7, label: 'N' },
            { value: 2.6, label: 'H' }, { value: 1.2, label: 'VH' },
            { value: 0, label: 'EH' }
        ]
    },
    {
        name: 'Flex', label: 'Development Flexibility', options: [
            { value: 0, label: 'Select' }, { value: 5.0, label: 'VL' },
            { value: 3.7, label: 'L' }, { value: 2.6, label: 'N' },
            { value: 1.2, label: 'H' }, { value: 0.4, label: 'VH' },
            { value: 0, label: 'EH' }
        ]
    },
    {
        name: 'Risk', label: 'Risk Resolution', options: [
            { value: 0, label: 'Select' }, { value: 6.0, label: 'VL' },
            { value: 4.0, label: 'L' }, { value: 3.0, label: 'N' },
            { value: 1.5, label: 'H' }, { value: 0.7, label: 'VH' },
            { value: 0, label: 'EH' }
        ]
    },
    {
        name: 'team', label: 'Team Cohesion', options: [
            { value: 0, label: 'Select' }, { value: 5.4, label: 'VL' },
            { value: 4.7, label: 'L' }, { value: 3.4, label: 'N' },
            { value: 2.4, label: 'H' }, { value: 1.0, label: 'VH' },
            { value: 0, label: 'EH' }
        ]
    },
    {
        name: 'pmat', label: 'Process Maturity', options: [
            { value: 0, label: 'Select' }, { value: 5.6, label: 'VL' },
            { value: 4.2, label: 'L' }, { value: 2.8, label: 'N' },
            { value: 1.3, label: 'H' }, { value: 0.4, label: 'VH' },
            { value: 0, label: 'EH' }
        ]
    },
];

const EFFORT_ADJUSTMENT_FACTORS = [
    {
        name: 'PERS', label: 'Personnel Capability', options: [
            { value: 1, label: 'Select' }, { value: 1.42, label: 'EL' },
            { value: 1.17, label: 'L' }, { value: 1.00, label: 'N' },
            { value: 0.86, label: 'H' }, { value: 0.70, label: 'VH' }
        ]
    },
    {
        name: 'RCPX', label: 'Required Software Reliability', options: [
            { value: 1, label: 'Select' }, { value: 0.75, label: 'VL' },
            { value: 0.88, label: 'L' }, { value: 1.00, label: 'N' },
            { value: 1.15, label: 'H' }, { value: 1.40, label: 'VH' },
            { value: 2.14, label: 'EH' }
        ]
    },
    {
        name: 'RUSE', label: 'Reusability', options: [
            { value: 1, label: 'Select' }, { value: 0.95, label: 'L' },
            { value: 1.00, label: 'N' }, { value: 1.07, label: 'H' },
            { value: 1.15, label: 'VH' }, { value: 1.24, label: 'EH' }
        ]
    },
    {
        name: 'PDIF', label: 'Platform Difficulty', options: [
            { value: 1, label: 'Select' }, { value: 1.00, label: 'N' },
            { value: 1.08, label: 'H' }, { value: 1.16, label: 'VH' },
            { value: 1.24, label: 'EH' }
        ]
    },
    {
        name: 'FCIL', label: 'Facility', options: [
            { value: 1, label: 'Select' }, { value: 1.43, label: 'EL' },
            { value: 1.14, label: 'L' }, { value: 1.00, label: 'N' },
            { value: 0.87, label: 'H' }, { value: 0.74, label: 'VH' }
        ]
    },
    {
        name: 'SCED', label: 'Schedule Constraint', options: [
            { value: 1, label: 'Select' }, { value: 1.29, label: 'VL' },
            { value: 1.10, label: 'L' }, { value: 1.00, label: 'N' },
            { value: 1.00, label: 'H' }, { value: 1.00, label: 'VH' },
            { value: 1.23, label: 'EH' }
        ]
    },
    {
        name: 'PREX', label: 'Personnel Experience', options: [
            { value: 1, label: 'Select' }, { value: 1.22, label: 'VL' },
            { value: 1.09, label: 'L' }, { value: 1.00, label: 'N' },
            { value: 0.90, label: 'H' }, { value: 0.81, label: 'VH' }
        ]
    },
];

const MDP_INPUTS = [
    { name: 'rusePr', label: 'Reuse Percentage (%)', type: 'number', min: 0, max: 100 },
    {
        name: 'exp', label: 'Productivity / Experience', type: 'select', options: [
            { value: 100, label: 'Average (100%)' },
            { value: 150, label: 'Experienced (150%)' },
            { value: 200, label: 'Highly Experienced (200%)' }
        ]
    },
    { name: 'sS', label: 'Simple Screens', type: 'number', min: 0 },
    { name: 'mS', label: 'Medium Screens', type: 'number', min: 0 },
    { name: 'hS', label: 'Hard Screens', type: 'number', min: 0 },
    { name: 'sD', label: 'Simple Docs', type: 'number', min: 0 },
    { name: 'mD', label: 'Medium Docs', type: 'number', min: 0 },
    { name: 'hD', label: 'Hard Docs', type: 'number', min: 0 },
    { name: 'mod', label: 'Modules', type: 'number', min: 0 },
];

const MATRIX_TYPES = [
    {
        key: 'EI',
        name: 'External Inputs (EI)',
        headers: ['Data Elements', '1-4 (Simple)', '5-15 (Medium)', '>15 (Complex)'],
        rows: ['0-1 File Types', '2 File Types', '>2 File Types'],
        weights: [[3, 3, 4], [3, 4, 6], [4, 6, 6]]
    },
    {
        key: 'EO',
        name: 'External Outputs (EO)',
        headers: ['Data Elements', '1-4 (Simple)', '5-19 (Medium)', '>19 (Complex)'],
        rows: ['0-1 File Types', '2-3 File Types', '>3 File Types'],
        weights: [[4, 4, 5], [4, 5, 7], [5, 7, 7]]
    },
    {
        key: 'ILF',
        name: 'Internal Logical Files (ILF)',
        headers: ['Record Types', '1-19 (Simple)', '20-50 (Medium)', '>50 (Complex)'],
        rows: ['1 Data Element', '2-5 Data Elements', '>5 Data Elements'],
        weights: [[7, 7, 10], [7, 10, 15], [10, 15, 15]]
    },
    {
        key: 'EIF',
        name: 'External Interface Files (EIF)',
        headers: ['Record Types', '1-19 (Simple)', '20-50 (Medium)', '>50 (Complex)'],
        rows: ['1 Data Element', '2-5 Data Elements', '>5 Data Elements'],
        weights: [[5, 5, 7], [5, 7, 10], [7, 10, 10]]
    },
    {
        key: 'EQ',
        name: 'External Inquiries (EQ)',
        headers: ['File Types', '1-4 (Simple)', '5-19 (Medium)', '>19 (Complex)'],
        rows: ['0-1 Data Elements', '2-3 Data Elements', '>3 Data Elements'],
        weights: [[3, 3, 4], [3, 4, 6], [4, 6, 6]]
    }
];

const Cocomo2 = () => {
    // State management
    const [fpCharacteristics, setFpCharacteristics] = useState(Array(14).fill(0));
    const [matrixInputs, setMatrixInputs] = useState(
        MATRIX_TYPES.reduce((acc, { key }) => {
            acc[key] = Array(3).fill(0).map(() => Array(3).fill(0));
            return acc;
        }, {})
    );
    const [scaleFactors, setScaleFactors] = useState(
        SCALE_FACTORS.reduce((acc, { name }) => ({ ...acc, [name]: 0 }), {})
    );
    const [effortAdjustmentFactors, setEffortAdjustmentFactors] = useState(
        EFFORT_ADJUSTMENT_FACTORS.reduce((acc, { name }) => ({ ...acc, [name]: 1 }), {})
    );
    const [mdpInputs, setMdpInputs] = useState(
        MDP_INPUTS.reduce((acc, { name, type }) => ({
            ...acc,
            [name]: type === 'select' ? 100 : 0
        }), {})
    );
    const [isCalculatingFP, setIsCalculatingFP] = useState(false);
    const [isCalculatingCOCOMO, setIsCalculatingCOCOMO] = useState(false);

    // Results state
    const [results, setResults] = useState({
        fi: 'N/A',
        ufp: 'N/A',
        fp: 'N/A',
        pValue: 'N/A',
        eArch: 'N/A',
        medaJob: 'N/A',
        medaTime: 'N/A',
        mdpJob: 'N/A',
        mdpTime: 'N/A',
    });

    // Handlers
    const handleButtonClick = (e, callback, setIsLoading) => {
        const button = e.currentTarget;
        const ripple = button.querySelector('.button-ripple');

        // Ripple effect
        if (ripple) {
            ripple.classList.remove('button-ripple');
            void ripple.offsetWidth; // Trigger reflow
            ripple.classList.add('button-ripple');

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        }

        // Set loading state and execute callback
        setIsLoading(true);
        Promise.resolve(callback(e)).finally(() => setIsLoading(false));
    };

    const handleFpCharacteristicChange = (index, value) => {
        const newCharacteristics = [...fpCharacteristics];
        newCharacteristics[index] = parseInt(value, 10) || 0;
        setFpCharacteristics(newCharacteristics);
    };
    const handleMatrixInputChange = (matrixType, rowIndex, colIndex, value) => {
        setMatrixInputs(prev => ({
            ...prev,
            [matrixType]: prev[matrixType].map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((col, cIdx) => cIdx === colIndex ? parseInt(value, 10) || 0 : col)
                    : row
            )
        }));
    };
    const handleScaleFactorChange = (factorName, value) => {
        setScaleFactors(prev => ({
            ...prev,
            [factorName]: parseFloat(value) || 0,
        }));
    };

    const handleEffortAdjustmentFactorChange = (factorName, value) => {
        setEffortAdjustmentFactors(prev => ({
            ...prev,
            [factorName]: parseFloat(value) || 1,
        }));
    };
    const handleMdpInputChange = (inputName, value) => {
        setMdpInputs(prev => ({
            ...prev,
            [inputName]: parseFloat(value) || 0,
        }));
    };


    // Calculations
    const calculateFunctionPoints = async (e) => {
        e.preventDefault();

        const sumCoeffCorrComplexity = fpCharacteristics.reduce((sum, value) => sum + value, 0);

        let ufp = 0; // Unadjusted Function Points
        MATRIX_TYPES.forEach(({ key, weights }) => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    ufp += matrixInputs[key][i][j] * weights[i][j];
                }
            }
        });

        const correctFP = ufp * (0.65 + 0.01 * sumCoeffCorrComplexity);

        setResults(prev => ({
            ...prev,
            fi: sumCoeffCorrComplexity.toFixed(2),
            ufp: ufp.toFixed(2),
            fp: correctFP.toFixed(2),
        }));
    };

    const countP = () => {
        const sumScaleFactors = Object.values(scaleFactors).reduce((sum, value) => sum + value, 0);
        return 1.01 + 0.01 * sumScaleFactors;
    };

    const counteArch = () => {
        return Object.values(effortAdjustmentFactors).reduce((product, value) => product * value, 1);
    };

    const calculateMeda = async (e) => {
        e.preventDefault();

        const p = countP();
        const eArch = counteArch();
        const UFP = parseFloat(results.ufp) || 0;

        if (UFP === 0 || results.ufp === 'N/A') {
            alert("Please calculate Function Points first.");
            return;
        }

        // Calculations
        const kLOC_orig = (UFP / 100) * (30 * 64 + 10 * 21 + 60 * 53);
        const medaJob = 2.45 * eArch * Math.pow(kLOC_orig / 1000, p);
        const medaTime = 3.0 * Math.pow(medaJob, 0.33 + 0.2 * (p - 1.01));

        // MDP Calculation
        const { rusePr, exp, sS, mS, hS, sD, mD, hD, mod } = mdpInputs;
        const size = (sS + mS * 2 + hS * 3) + (sD * 2 + mD * 5 + hD * 8) + (mod * 10);
        const MdpJob = (size * ((100 - rusePr) / 100)) / exp;
        const mdpTime = 3 * Math.pow(MdpJob, 0.33 + 0.2 * (p - 1.01));

        setResults(prev => ({
            ...prev,
            pValue: p.toFixed(2),
            eArch: eArch.toFixed(2),
            medaJob: medaJob.toFixed(2),
            medaTime: medaTime.toFixed(2),
            mdpJob: MdpJob.toFixed(2),
            mdpTime: mdpTime.toFixed(2),
        }));
    };



    // Reusable Components
    const RatingInput = ({ id, label, value, onChange }) => (
        <div className="input-group">
            <label htmlFor={id}>{label}</label>
            <select id={id} value={value} onChange={onChange} className="form-input">
                {[0, 1, 2, 3, 4, 5].map(num => (
                    <option key={`${id}-${num}`} value={num}>
                        {num} - {num === 0 ? 'None' : num === 1 ? 'Low' : num === 5 ? 'High' : 'Medium'}
                    </option>
                ))}
            </select>
        </div>
    );

    const MatrixTable = ({ matrix }) => (
        <div className="matrix-container">
            <h4>{matrix.name}</h4>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {matrix.headers.map((header, idx) => (
                                <th key={`${matrix.key}-header-${idx}`}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.rows.map((rowLabel, rowIdx) => (
                            <tr key={`${matrix.key}-row-${rowIdx}`}>
                                <td>{rowLabel}</td>
                                {[0, 1, 2].map(colIdx => (
                                    <td key={`${matrix.key}-cell-${rowIdx}-${colIdx}`}>
                                        <input
                                            type="number"
                                            min="0"
                                            value={matrixInputs[matrix.key][rowIdx][colIdx]}
                                            onChange={(e) => handleMatrixInputChange(matrix.key, rowIdx, colIdx, e.target.value)}
                                            className="matrix-input"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const FormSelect = ({ label, value, options, onChange }) => {
        // Generate a unique ID for accessibility
        const id = `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
        
        return (
          <div className="mobile-select-container">
            <label htmlFor={id} className="mobile-select-label">
              {label}
            </label>
            <div className="mobile-select-wrapper">
              <select
                id={id}
                className="mobile-select"
                value={value}
                onChange={onChange}
              >
                {options.map((opt, i) => (
                  <option key={`${id}-option-${i}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="mobile-select-arrow">▼</span>
            </div>
          </div>
        );
      };

    const FormInput = ({ label, type = 'number', value, min, max, onChange }) => (
        <div className="input-row">
            <label>{label}</label>
            <input
                type={type}
                min={min}
                max={max}
                value={value}
                onChange={onChange}
            />
        </div>
    );

    const ResultItem = ({ label, value, unit }) => (
        <div className="result-item">
            <span>{label}</span>
            <strong>{value} {unit && <small>{unit}</small>}</strong>
        </div>
    );

    return (
        <ProtectedRoute>
        <div className="app-container">
            <Head>
                <title>COCOMO II Calculator</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Software project estimation using COCOMO II model" />
            </Head>

            <header className="app-header">
                <h1>COCOMO II Calculator</h1>
                <p>Software project estimation tool</p>
            </header>

            <main className="app-main">
                {/* Function Points Section */}
                <section className="card">
                    <h2>Function Points Analysis</h2>

                    <div className="card-section">
                        <h3>System Characteristics</h3>
                        <div className="characteristics-grid">
                            {FP_CHARACTERISTICS.map((char, index) => (
                                <RatingInput
                                    key={`char-${index}`}
                                    id={char.id}
                                    label={char.label}
                                    value={fpCharacteristics[index]}
                                    onChange={(e) => handleFpCharacteristicChange(index, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="card-section">
                        <h3>Complexity Matrices</h3>
                        {MATRIX_TYPES.map(matrix => (
                            <MatrixTable key={`matrix-${matrix.key}`} matrix={matrix} />
                        ))}
                    </div>

                    <button
                        onClick={calculateFunctionPoints}
                        className="pixel-button primary"
                        aria-label="Calculate function points"
                    >
                        <span className="button-content">
                            Calculate Function Points
                            <span className="button-icon">→</span>
                        </span>
                        <span className="button-ripple"></span>
                    </button>

                    <div className="results-section">
                        <ResultItem label="Correction Factor" value={results.fi} />
                        <ResultItem label="Unadjusted FP" value={results.ufp} />
                        <ResultItem label="Adjusted FP" value={results.fp} />
                    </div>
                </section>

                {/* COCOMO II Section */}
                <section className="card">
                    <h2>COCOMO II Estimation</h2>

                    <div className="form-columns">
                        <div className="form-group">
                            <h3>Scale Factors</h3>
                            {SCALE_FACTORS.map(factor => (
                                <FormSelect
                                    key={`scale-${factor.name}`}
                                    label={factor.label}
                                    value={scaleFactors[factor.name]}
                                    options={factor.options}
                                    onChange={(e) => handleScaleFactorChange(factor.name, e.target.value)}
                                />
                            ))}
                        </div>

                        <div className="form-group">
                            <h3>Effort Adjustment</h3>
                            {EFFORT_ADJUSTMENT_FACTORS.map(factor => (
                                <FormSelect
                                    key={`effort-${factor.name}`}
                                    label={factor.label}
                                    value={effortAdjustmentFactors[factor.name]}
                                    options={factor.options}
                                    onChange={(e) => handleEffortAdjustmentFactorChange(factor.name, e.target.value)}
                                />
                            ))}
                        </div>

                        <div className="form-group">
                            <h3>MDP Inputs</h3>
                            {MDP_INPUTS.map(input => input.type === 'select' ? (
                                <FormSelect
                                    key={`mdp-${input.name}`}
                                    label={input.label}
                                    value={mdpInputs[input.name]}
                                    options={input.options}
                                    onChange={(e) => handleMdpInputChange(input.name, e.target.value)}
                                />
                            ) : (
                                <FormInput
                                    key={`mdp-${input.name}`}
                                    label={input.label}
                                    value={mdpInputs[input.name]}
                                    min={input.min}
                                    max={input.max}
                                    onChange={(e) => handleMdpInputChange(input.name, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <button onClick={calculateMeda} className="primary-btn">
                        Calculate COCOMO II
                    </button>

                    <div className="results-section">
                        <h3>Results</h3>
                        <div className="results-grid">
                            <ResultItem label="Scale Factor (P)" value={results.pValue} />
                            <ResultItem label="Effort Adjustment (E)" value={results.eArch} />
                            <ResultItem label="MEDA Labor" value={results.medaJob} unit="person-months" />
                            <ResultItem label="MEDA Time" value={results.medaTime} unit="months" />
                            <ResultItem label="MDP Labor" value={results.mdpJob} unit="person-months" />
                            <ResultItem label="MDP Time" value={results.mdpTime} unit="months" />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="app-footer">
                <p>© {new Date().getFullYear()} COCOMO II Calculator</p>
                <p className="disclaimer">
                    Results are estimates based on the COCOMO II model. Actual project outcomes may vary.
                </p>
            </footer>
        </div>
        </ProtectedRoute>
    );
};

export default Cocomo2;

export const handleButtonClick = (e) => {
    const button = e.currentTarget;
    const ripple = button.querySelector('.button-ripple');

    // Reset animation
    ripple?.classList.remove('button-ripple');
    void ripple?.offsetWidth;
    ripple?.classList.add('button-ripple');

    // Position ripple
    if (ripple) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    }

    // Call your calculation function
    calculateFunctionPoints(e);
};