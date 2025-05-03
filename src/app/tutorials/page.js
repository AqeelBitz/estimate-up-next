"use client";
import { useState } from 'react';
import '../styles/Tutorials.css';

const Tutorials = () => {
  const [expandedTutorial, setExpandedTutorial] = useState(null);

  const toggleTutorial = (id) => {
    setExpandedTutorial(expandedTutorial === id ? null : id);
  };

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with Three-Point Estimation",
      summary: "Step-by-step guide to using three-point estimation (optimistic, pessimistic, and most likely) for more accurate project predictions.",
      content: (
        <>
          <h3>What You&apos;ll Learn:</h3>
          <ul>
            <li>The PERT formula and beta distribution</li>
            <li>How to gather optimistic, pessimistic, and most likely estimates</li>
            <li>Calculating confidence intervals and standard deviation</li>
          </ul>

          <h3>Step-by-Step Guide:</h3>
          <ol>
            <li>
              <strong>Gather Three Estimates:</strong>
              <p>For each task, collect optimistic (O), most likely (M), and pessimistic (P) estimates from your team&apos;s input.</p>
            </li>
            <li>
              <strong>Calculate Expected Value:</strong>
              <p>Use the formula: E = (O + 4M + P) / 6</p>
            </li>
            <li>
              <strong>Determine Standard Deviation:</strong>
              <p>Calculate: SD = (P - O) / 6</p>
            </li>
            <li>
              <strong>Establish Confidence Ranges:</strong>
              <p>E &plusmn; SD = 68% confidence, E &plusmn; 2SD = 95% confidence</p>
            </li>
          </ol>

          <h3>Pro Tips:</h3>
          <div className="tutorial-tips">
            <div className="tip-card">
              <h4>Estimate Ranges</h4>
              <p>Optimistic: Best-case scenario (5th percentile)</p>
            </div>
            <div className="tip-card">
              <h4>When to Use</h4>
              <p>Best for uncertain tasks with historical data available</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 2,
      title: "Mastering Delphi Estimation: A Three-Round Process",
      summary: "Learn how to conduct Delphi estimation rounds to reach expert consensus.",
      content: (
        <>
          <h3>What You&apos;ll Learn:</h3>
          <ul>
            <li>The fundamentals of Delphi estimation technique</li>
            <li>How to conduct all three estimation rounds</li>
            <li>Interpreting consensus results and confidence intervals</li>
          </ul>

          <h3>Step-by-Step Guide:</h3>
          <ol>
            <li>
              <strong>Round 1 - Initial Estimates:</strong>
              <p>Each estimator provides independent, anonymous estimates based on their expertise.</p>
            </li>
            <li>
              <strong>Round 2 - Feedback & Revision:</strong>
              <p>Review group statistics and adjust your estimates.</p>
            </li>
            <li>
              <strong>Round 3 - Final Consensus:</strong>
              <p>Submit final estimates after considering feedback.</p>
            </li>
          </ol>

          <h3>Pro Tips:</h3>
          <div className="tutorial-tips">
            <div className="tip-card">
              <h4>Estimator Selection</h4>
              <p>Include 3-7 domain experts with diverse perspectives</p>
            </div>
            <div className="tip-card">
              <h4>Time Management</h4>
              <p>Allow 2-3 days between rounds for consideration</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 3,
      title: "Analogous Estimation: Leveraging Past Projects",
      summary: "Use historical data from similar projects for quick estimates.",
      content: (
        <>
          <h3>What You&apos;ll Learn:</h3>
          <ul>
            <li>How to use historical data for quick estimates</li>
            <li>Adjusting for differences between projects</li>
          </ul>

          <h3>Step-by-Step Guide:</h3>
          <ol>
            <li>
              <strong>Identify Similar Projects:</strong>
              <p>Find 2-3 past projects with similar scope.</p>
            </li>
            <li>
              <strong>Gather Historical Data:</strong>
              <p>Collect actual effort/duration from completed projects.</p>
            </li>
            <li>
              <strong>Adjust for Differences:</strong>
              <p>Modify estimates based on known variances.</p>
            </li>
          </ol>
        </>
      )
    },
    {
      id: 4,
      title: "Parametric Estimation: Data-Driven Modeling",
      summary: "Create mathematical models based on project parameters.",
      content: (
        <>
          <h3>What You&apos;ll Learn:</h3>
          <ul>
            <li>Building statistical estimation models</li>
            <li>Identifying key cost drivers</li>
          </ul>

          <h3>Step-by-Step Guide:</h3>
          <ol>
            <li>
              <strong>Identify Parameters:</strong>
              <p>Determine measurable factors that influence effort.</p>
            </li>
            <li>
              <strong>Gather Historical Data:</strong>
              <p>Collect data points from past projects.</p>
            </li>
            <li>
              <strong>Develop Model:</strong>
              <p>Create mathematical relationships.</p>
            </li>
          </ol>
        </>
      )
    }
  ];

  return (
    <div className="tutorial-container">
      <div className="tutorial-wrapper">
        <h1 className="tutorial-title">Estimation Tutorials</h1>

        {/* Ensure tutorials is an array before mapping */}
        {Array.isArray(tutorials) && tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className={`tutorial-card ${expandedTutorial === tutorial.id ? 'expanded' : ''}`}
          >
            <div
              className="tutorial-header"
              onClick={() => toggleTutorial(tutorial.id)}
            >
              <h2 className="tutorial-heading">{tutorial.title}</h2>
              <p className="tutorial-summary">{tutorial.summary}</p>
              <button className="toggle-button">
                {expandedTutorial === tutorial.id ? '▲ Show Less' : '▼ Show More'}
              </button>
            </div>

            {expandedTutorial === tutorial.id && (
              <div className="tutorial-content">
                {tutorial.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;