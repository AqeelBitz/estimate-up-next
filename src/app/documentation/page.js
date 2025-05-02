"use client";
import  { useState } from 'react';
import '../styles/Documentation.css';

const Documentation = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const techniques = [
    {
      id: 1,
      title: "Three-Point Estimation for Software",
      summary: "PERT-based estimation for software development tasks",
      standards: [
        {
          name: "IEEE Std 730-2014",
          description: "Software Quality Assurance (Section 5.3 on Estimation)",
          url: "https://standards.ieee.org/ieee/730/4548/"
        },
        {
          name: "SEI COCOMO Papers",
          description: "Research papers on software cost estimation",
          url: "https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=513819"
        }
      ],
      content: (
        <>
          <h3>Software-Specific Implementation</h3>
          <p>Adapted PERT formula for software tasks:</p>
          <pre>E = (O + 4M + P) / 6 ± (P-O)/6</pre>
          
          <div className="standards-box">
            <h4>Software Engineering References:</h4>
            <ul>
              <li>
                <a href="https://standards.ieee.org/ieee/730/4548/" target="_blank" rel="noopener noreferrer">
                  IEEE 730-2014 - Software Quality Assurance Standards
                </a>
              </li>
              <li>
                <a href="https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=513819" target="_blank" rel="noopener noreferrer">
                  SEI Technical Note on Software Estimation
                </a>
              </li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: 2,
      title: "Delphi for Software Estimation",
      summary: "Expert consensus technique for software projects",
      standards: [
        {
          name: "IEEE SWEBOK v3.0",
          description: "Software Engineering Body of Knowledge (Ch. 7 - Engineering Economics)",
          url: "https://www.computer.org/education/bodies-of-knowledge/software-engineering"
        },
        {
          name: "SEI Expert Judgment",
          description: "Software Engineering Institute's guidelines",
          url: "https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=9665"
        }
      ],
      content: (
        <>
          <h3>Software-Specific Delphi Process</h3>
          <ol>
            <li><strong>Round 1:</strong> Estimate SLOC, story points, or function points</li>
            <li><strong>Round 2:</strong> Compare with COCOMO benchmarks</li>
            <li><strong>Round 3:</strong> Finalize accounting for technical debt</li>
          </ol>
          
          <div className="standards-box">
            <h4>Software References:</h4>
            <ul>
              <li>
                <a href="https://www.computer.org/education/bodies-of-knowledge/software-engineering" target="_blank" rel="noopener noreferrer">
                  IEEE SWEBOK Estimation Chapter
                </a>
              </li>
              <li>
                <a href="https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=9665" target="_blank" rel="noopener noreferrer">
                  SEI Expert Judgment Guide
                </a>
              </li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: 3,
      title: "Function Point Analysis (ISO)",
      summary: "ISO-standardized software sizing method",
      standards: [
        {
          name: "ISO/IEC 20926",
          description: "IFPUG Function Point Counting Practices Manual",
          url: "https://www.iso.org/standard/41339.html"
        },
        {
          name: "ISO/IEC 24570",
          description: "NESMA Function Point Analysis Standard",
          url: "https://www.iso.org/standard/38811.html"
        }
      ],
      content: (
        <>
          <h3>Software Measurement Standard</h3>
          <p>Key software components measured:</p>
          <ul>
            <li>Internal Logical Files (ILFs)</li>
            <li>External Interface Files (EIFs)</li>
            <li>External Inputs/Outputs/Queries (EIs/EOs/EQs)</li>
          </ul>
          
          <div className="standards-box">
            <h4>ISO Software Standards:</h4>
            <ul>
              <li>
                <a href="https://www.iso.org/standard/41339.html" target="_blank" rel="noopener noreferrer">
                  ISO/IEC 20926 - IFPUG FPA
                </a>
              </li>
              <li>
                <a href="https://www.iso.org/standard/38811.html" target="_blank" rel="noopener noreferrer">
                  ISO/IEC 24570 - NESMA FPA
                </a>
              </li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: 4,
      title: "COCOMO II (Software Cost Model)",
      summary: "Algorithmic model for software development effort",
      standards: [
        {
          name: "COCOMO II Book",
          description: "Software Cost Estimation with COCOMO II (Boehm et al.)",
          url: "https://csse.usc.edu/csse/research/COCOMOII/cocomo_main.html"
        },
        {
          name: "IEEE Std 16326",
          description: "Software Engineering - Project Management",
          url: "https://standards.ieee.org/ieee/16326/5911/"
        }
      ],
      content: (
        <>
          <h3>Software Cost Drivers</h3>
          <p>Key parameters in COCOMO II:</p>
          <pre>
            Effort = A × (Size)^B × ∏(EM_i)<br/>
            Where B = scaling factor based on project complexity
          </pre>
          
          <div className="standards-box">
            <h4>Software Cost Estimation Standards:</h4>
            <ul>
              <li>
                <a href="https://csse.usc.edu/csse/research/COCOMOII/cocomo_main.html" target="_blank" rel="noopener noreferrer">
                  Official COCOMO II Site (USC)
                </a>
              </li>
              <li>
                <a href="https://standards.ieee.org/ieee/16326/5911/" target="_blank" rel="noopener noreferrer">
                  IEEE 16326 - Software Project Management
                </a>
              </li>
            </ul>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="doc-container">
      <div className="doc-wrapper">
        <h1 className="doc-title">Software Estimation Standards</h1>
        <p className="doc-subtitle">Authoritative references from IEEE, ISO, and SEI</p>
        
        {techniques.map((tech) => (
          <div 
            key={tech.id} 
            className={`doc-section ${expandedSection === tech.id ? 'expanded' : ''}`}
          >
            <div 
              className="doc-header"
              onClick={() => toggleSection(tech.id)}
            >
              <h2 className="doc-heading">{tech.title}</h2>
              <p className="doc-summary">{tech.summary}</p>
              <button className="doc-toggle">
                {expandedSection === tech.id ? '▲ Collapse' : '▼ Expand'}
              </button>
            </div>
            
            {expandedSection === tech.id && (
              <div className="doc-content">
                {tech.content}
                <div className="external-links">
                  <h4>Additional Software Resources:</h4>
                  <ul>
                    {tech.standards.map((standard, index) => (
                      <li key={index}>
                        <a href={standard.url} target="_blank" rel="noopener noreferrer">
                          <strong>{standard.name}</strong>: {standard.description}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documentation;