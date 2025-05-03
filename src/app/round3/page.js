'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ProtectedRoute from '../components/ProtectedRoute';
import { useCallback } from 'react';
import '../styles/Delphi.css';

const Round3 = () => {
    const [taskList, setTaskList] = useState([]);
    const headingRef = useRef(null);
    const [round1, setRound1] = useState([]);
    const [round2, setRound2] = useState([]);
    const [round3, setRound3] = useState([]);
    const [e_name, setE_name] = useState([]);
    const [total_effort, setTotal_effort] = useState([]);
    const [total_effort2, setTotal_effort2] = useState([]);
    const [total_effort3, setTotal_effort3] = useState([]);
    const [total_avg1, setTotal_avg] = useState(0);
    const [total_avg2, setTotal_avg2] = useState(0);
    const [total_avg3, setTotal_avg3] = useState(0);
    const [lowerBound, setLowerBound] = useState(NaN);
    const [upperBound, setUpperBound] = useState(NaN);
    const [standardError1, setStandardError1] = useState(0);
    const [meanEffort, setMeanEffort] = useState(0);
    const [projectName, setProjectName] = useState('');
    

    const fetchEstimationData = () => {
        if (typeof window !== 'undefined') {
            const arr = localStorage.getItem("modules");
            const storedEstimationData = JSON.parse(localStorage.getItem("estimationData") || "[]");

            if (storedEstimationData) {
                const Estimator_name = storedEstimationData.map(data => data.estimator_name);
                setE_name(Estimator_name);

                const round1_estimation = storedEstimationData.map(data => data.r1_estimation);
                setRound1(round1_estimation);

                const round2_estimation = storedEstimationData.map(data => data.r2_estimation);
                setRound2(round2_estimation);

                const round3_estimation = storedEstimationData.map(data => data.r3_estimation);
                setRound3(round3_estimation);

                const mytotal = round1_estimation.map(est => est ? est.reduce((acc, curr) => acc + Number(curr || 0), 0) : 0);
                setTotal_effort(mytotal);

                const mytotal2 = round2_estimation.map(est => est ? est.reduce((acc, curr) => acc + Number(curr || 0), 0) : 0);
                setTotal_effort2(mytotal2);

                const mytotal3 = round3_estimation.map(est => est ? est.reduce((acc, curr) => acc + Number(curr || 0), 0) : 0);
                setTotal_effort3(mytotal3);

                const validEstimatorsCount = Estimator_name.filter(Boolean).length;

                const sum1 = mytotal.reduce((acc, curr) => acc + curr, 0);
                setTotal_avg(validEstimatorsCount > 0 ? sum1 / validEstimatorsCount : 0);

                const sum2 = mytotal2.reduce((acc, curr) => acc + curr, 0);
                setTotal_avg2(validEstimatorsCount > 0 ? sum2 / validEstimatorsCount : 0);

                const sum3 = mytotal3.reduce((acc, curr) => acc + curr, 0);
                setTotal_avg3(validEstimatorsCount > 0 ? sum3 / validEstimatorsCount : 0);
            }

            if (arr) {
                const obj = JSON.parse(arr);
                setTaskList(obj);
            }
        }
    };

    useEffect(() => {
        fetchEstimationData();
        const project = localStorage.getItem('projectName');
        if (project) setProjectName(project);
        const handleStorageChange = () => {
            fetchEstimationData();
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorageChange);
            }
        };
  


    }, []);

    useEffect(() => {
        const heading = headingRef.current;
        const headingText = 'Round 3 Estimation Sheet';
        let index = 0;
        let typingInterval;

        const startTypingAnimation = () => {
            if (heading) {
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
            }
        };

        startTypingAnimation();

        return () => {
            clearInterval(typingInterval);
        };
    }, []);

    const calculateConfidenceInterval = useCallback((data, confidenceLevel) =>{
        const validData = data.filter(value => typeof value === 'number');
        if (validData.length < 2) {
            return [NaN, NaN];
        }
        const mean = validData.reduce((sum, value) => sum + value, 0) / validData.length;
        const stdError = standardError(validData);
        const z = getZScore(confidenceLevel);
        const lowerBound = mean - z * stdError;
        const upperBound = mean + z * stdError;
        return [lowerBound, upperBound];
    }, [standardError, getZScore]);

    function standardError(data) {
        const n = data.length;
        const stdDev = standardDeviation(data);
        return stdDev / Math.sqrt(n);
    }

    function standardDeviation(data) {
        const n = data.length;
        const mean = data.reduce((sum, value) => sum + value, 0) / n;
        const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
        return Math.sqrt(variance);
    }

    function getZScore(confidenceLevel) {
        const standardNormalDistribution = {
            '90%': 1.645,
            '95%': 1.96,
            '99%': 2.576,
        };
        return standardNormalDistribution[confidenceLevel];
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = e_name.map((_, index) => {
                return (total_effort[index] || 0) + (total_effort2[index] || 0) + (total_effort3[index] || 0);
            });
            const confidenceLevel = '95%';
            const [lb, ub] = calculateConfidenceInterval(data, confidenceLevel);
            setLowerBound(lb);
            setUpperBound(ub);
            let n = data.filter(value => typeof value === 'number').length;
            let mean = (total_avg1 || 0) + (total_avg2 || 0) + (total_avg3 || 0);
            setMeanEffort(mean);
            const validDataForStdDev = data.filter(value => typeof value === 'number');
            const standardDeviationCalc = validDataForStdDev.length > 1 ? Math.sqrt(validDataForStdDev.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (validDataForStdDev.length - 1)) : 0;
            const standardErrorCalc = n > 0 && standardDeviationCalc > 0 ? standardDeviationCalc / Math.sqrt(n) : 0;
            setStandardError1(standardErrorCalc);

            localStorage.setItem("Effort", mean.toFixed(2));
            localStorage.setItem("lowerBound", lb.toFixed(2));
            localStorage.setItem("upperBound", ub.toFixed(2));
            localStorage.setItem("SE", standardErrorCalc.toFixed(2));
        }
    }, [e_name, total_effort, total_effort2, total_effort3, total_avg1, total_avg2, total_avg3,calculateConfidenceInterval]);

    return (
        <ProtectedRoute>
            <div className="pixel-container">
                <Header step={4} />

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
                                    <span key={index} className="estimator-name">
                                        {expertName || 'Estimator ' + (index + 1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="unit-display">Unit: Days</div>
                    </div>
                </div>

                <div className="card elevation-2">
                    <div className="table-container">
                        <table className="estimation-table">
                            <thead>
                                <tr>
                                    <th>Modules</th>
                                    {e_name.map((_, index) => (
                                        <th key={index}>Estimator {index + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {taskList.map((obj, i) => (
                                    <tr key={i}>
                                        <th scope="row">{obj.Name}</th>
                                        {round1.map((est1, j) => (
                                            <td key={j}>
                                                <div className="estimation-triplet">
                                                    <span className={est1?.[i] ? '' : 'pending-text'}>
                                                        {est1?.[i] || 'Pending'}
                                                    </span>
                                                    <span className="separator">/</span>
                                                    <span className={round2[j]?.[i] ? '' : 'pending-text'}>
                                                        {round2[j]?.[i] || 'Pending'}
                                                    </span>
                                                    <span className="separator">/</span>
                                                    <span className={round3[j]?.[i] ? '' : 'pending-text'}>
                                                        {round3[j]?.[i] || 'Pending'}
                                                    </span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card elevation-2">
                    <div className="table-container">
                        <table className="summary-table">
                            <thead>
                                <tr>
                                    <th>Estimators</th>
                                    <th>Total Efforts</th>
                                    <th>Highest Effort</th>
                                    <th>Lowest Effort</th>
                                </tr>
                            </thead>
                            <tbody>
                                {e_name.map((expertName, index) => (
                                    <tr key={index}>
                                        <th scope="row">{expertName || 'Estimator ' + (index + 1)}</th>
                                        <td>{(total_effort[index] || 0) + (total_effort2[index] || 0) + (total_effort3[index] || 0)}</td>
                                        <td>
                                            {Math.max(
                                                ...(round1[index] || []).map(Number),
                                                ...(round2[index] || []).map(Number),
                                                ...(round3[index] || []).map(Number)
                                            )}
                                        </td>
                                        <td>
                                            {Math.min(
                                                ...(round1[index] || []).map(Number),
                                                ...(round2[index] || []).map(Number),
                                                ...(round3[index] || []).map(Number)
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card elevation-2">
                    <div className="table-container">
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>Average Effort</th>
                                    <th>Confidence Interval 95%</th>
                                    <th>Standard Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{meanEffort.toFixed(2)}</td>
                                    <td>
                                        {isNaN(lowerBound) ? 'N/A' : lowerBound.toFixed(2)} - {isNaN(upperBound) ? 'N/A' : upperBound.toFixed(2)}
                                    </td>
                                    <td>{standardError1.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card elevation-2 final-estimate">
                    <h4 className="card-subtitle">Final Estimate</h4>
                    <div className="estimate-result">
                        <div className="estimate-value">
                            <span className="estimate-label">Mean Effort:</span>
                            <span className="estimate-number">{meanEffort.toFixed(2)} days</span>
                        </div>
                        <div className="estimate-range">
                            <span className="range-label">Confidence Range:</span>
                            <span className="range-values">
                                {isNaN(lowerBound) ? 'N/A' : lowerBound.toFixed(2)} to {isNaN(upperBound) ? 'N/A' : upperBound.toFixed(2)} days
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Round3;