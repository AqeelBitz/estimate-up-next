"use client";
import { useState } from 'react';
import '../styles/Faq.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Which estimation method should I use for my software project?",
      answer: (
        <>
          <p><strong>Choose based on your project phase and data availability:</strong></p>
          <ul>
            <li><strong>Early-phase:</strong> Use COCOMO II or Analogous Estimation when only high-level requirements exist</li>
            <li><strong>Requirements-ready:</strong> Function Point Analysis works best with detailed requirements</li>
            <li><strong>Expert-driven:</strong> Delphi method when you have access to domain experts</li>
            <li><strong>Agile projects:</strong> Three-Point Estimation with story points works well for sprints</li>
          </ul>
        </>
      )
    },
    {
      question: "How accurate is Three-Point Estimation compared to other methods?",
      answer: (
        <>
          <p>Three-Point Estimation (PERT) typically achieves <strong>70-85% accuracy</strong> for software projects when:</p>
          <ul>
            <li>Optimistic/pessimistic estimates represent true 5th/95th percentiles</li>
            <li>Used on projects under 6 months duration</li>
            <li>Team has historical velocity data</li>
          </ul>
          <p>Compared to other methods:</p>
          <table className="accuracy-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Typical Accuracy</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Three-Point</td>
                <td>70-85%</td>
                <td>Short-term tasks</td>
              </tr>
              <tr>
                <td>Function Points</td>
                <td>80-90%</td>
                <td>Requirements-complete projects</td>
              </tr>
              <tr>
                <td>Delphi</td>
                <td>75-90%</td>
                <td>Novel/uncertain projects</td>
              </tr>
            </tbody>
          </table>
        </>
      )
    },
    {
      question: "What's the minimum viable team size for Delphi estimation?",
      answer: (
        <>
          <p>The ideal Delphi panel for software estimation consists of <strong>5-9 experts</strong>:</p>
          <ul>
            <li><strong>Minimum:</strong> 3 experts (but increases variance)</li>
            <li><strong>Optimal:</strong> 5-7 experts from different roles (dev, QA, architect)</li>
            <li><strong>Maximum:</strong> 9 experts (beyond this, coordination becomes difficult)</li>
          </ul>
          <p>Key composition principles:</p>
          <ul>
            <li>Include at least one architect/senior developer</li>
            <li>Add one domain expert (if complex business logic exists)</li>
            <li>Include a QA representative for test effort estimation</li>
          </ul>
        </>
      )
    },
    {
      question: "How do I convert Function Points to development hours?",
      answer: (
        <>
          <p>Use industry benchmark conversion factors:</p>
          <pre>
            {`Effort (hours) = FP × Productivity Factor

Typical Productivity Factors:
- Java: 15-20 hours/FP
- C#: 12-18 hours/FP
- Python: 10-15 hours/FP
- Legacy Systems: 20-30 hours/FP`}
          </pre>
          <p>Adjust for your organization's historical data:</p>
          <ol>
            <li>Calculate your team's historical hours/FP from past projects</li>
            <li>Apply a ±20% adjustment for project complexity</li>
            <li>Factor in team experience (novice teams add 15-30%)</li>
          </ol>
        </>
      )
    },
    {
      question: "Can I combine multiple estimation techniques?",
      answer: (
        <>
          <p><strong>Yes, hybrid approaches often yield the best results:</strong></p>
          <div className="technique-combinations">
            <div className="combination">
              <h4>1. Delphi + Three-Point</h4>
              <p>Use Delphi for high-level estimates, then apply Three-Point for individual tasks</p>
            </div>
            <div className="combination">
              <h4>2. Function Points + COCOMO</h4>
              <p>Calculate FP first, then feed into COCOMO II for effort estimation</p>
            </div>
            <div className="combination">
              <h4>3. Analogous + PERT</h4>
              <p>Start with analogous estimation, then refine with Three-Point ranges</p>
            </div>
          </div>
          <p className="warning-note">
            ⚠️ Always document which techniques were used for each component to maintain traceability.
          </p>
        </>
      )
    },
    {
      question: "How often should we re-estimate during a software project?",
      answer: (
        <>
          <p><strong>Recommended estimation cadence:</strong></p>
          <ul>
            <li><strong>Waterfall:</strong> Re-estimate at each phase gate (Requirements → Design → Implementation)</li>
            <li><strong>Agile:</strong> Re-estimate every sprint (with sprint retrospective data)</li>
            <li><strong>Critical Path:</strong> Recalculate whenever:
              <ul>
                <li>Scope changes &gt; 15%</li>
                <li>Key team members change</li>
                <li>Technical risks materialize</li>
              </ul>
            </li>
          </ul>
          <p>Use the "<strong>5/10 rule</strong>": If estimates are off by &gt; 10% early or &gt; 5% late in the project, trigger re-estimation.</p>
        </>
      )
    }
  ];

  return (
    <div className="faq-container">
      <div className="faq-wrapper">
        <h1 className="faq-title">Software Estimation FAQs</h1>
        <p className="faq-subtitle">Practical guidance for implementing estimation techniques</p>
        
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question-container">
              <h2 className="faq-question">{faq.question}</h2>
              <button className="faq-toggle">
                {activeIndex === index ? '−' : '+'}
              </button>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;