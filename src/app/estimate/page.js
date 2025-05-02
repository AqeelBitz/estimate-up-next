'use client';
import {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import '../styles/Cocomo.css'; 
import ProtectedRoute from '../components/ProtectedRoute';


const CocomoEstimation = () => {
  // State for all form values
  const [sloc, setSloc] = useState('');
  const [kloc, setKloc] = useState('');
  const [laborRate, setLaborRate] = useState('');
  const [projectClass, setProjectClass] = useState('1');
  const [mf, setMf] = useState('');
  const [effort, setEffort] = useState('');
  const [time, setTime] = useState('');
  const [cost, setCost] = useState('');

  // State for all 15 cost drivers
  const [costDrivers, setCostDrivers] = useState({
    reliability: 1,
    databaseSize: 1,
    complexity: 1,
    runtimeConstraints: 1,
    memoryConstraints: 1,
    vmVolatility: 1,
    turnaroundTime: 1,
    analystCapability: 1,
    applicationExperience: 1,
    softwareEngineeringCapability: 1,
    vmExperience: 1,
    languageExperience: 1,
    methodsUse: 1,
    toolsUse: 1,
    schedule: 1
  });

  const calculateKloc = () => {
    if (sloc) {
      const klocValue = parseFloat(sloc) / 1000;
      setKloc(klocValue.toFixed(2));
    }
  };

  const handleCostDriverChange = (name, value) => {
    setCostDrivers(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const calculateMf = () => {
    const values = Object.values(costDrivers);
    const mfValue = values.reduce((acc, val) => acc * val, 1);
    setMf(mfValue.toFixed(2));
  };

  const calculateEffort = () => {
    if (!kloc || !mf || !projectClass) return;
    
    const a = projectClass === '1' ? 2.4 : projectClass === '2' ? 3.0 : 3.6;
    const b = projectClass === '1' ? 1.05 : projectClass === '2' ? 1.12 : 1.20;
    
    const effortValue = a * Math.pow(parseFloat(kloc), b) * parseFloat(mf);
    const timeValue = 2.5 * Math.pow(effortValue, 0.32 + 0.2 * (b - 1.01));
    const costValue = effortValue * (laborRate ? parseFloat(laborRate) : 1);
    
    setEffort(effortValue.toFixed(2));
    setTime(timeValue.toFixed(2));
    setCost(costValue.toFixed(2));
  };

  return (
    <ProtectedRoute>
    <div className="cocomo-pixel-theme cocomo-pixel-container">
      <Head>
        <title>Software Cost Estimation | EstimateUp</title>
        <meta name="description" content="Estimate the cost, effort, and time of software development using the COCOMO model." />
        {/* Other meta tags */}
      </Head>

      <div className="cocomo-pixel-main">
        <h1 className="cocomo-pixel-title">Estimation of Cost, Effort, Time of development of Software</h1>

        <div className="cocomo-pixel-card">
          <div className="cocomo-pixel-input-group">
            <label className="cocomo-pixel-input-label">Write SLOC:</label>
            <div className="cocomo-pixel-input-row">
              <input 
                type="text" 
                className="cocomo-pixel-text-input" 
                value={sloc}
                onChange={(e) => setSloc(e.target.value)}
                required 
                aria-label="Enter SLOC" 
              />
              <button 
                className="cocomo-pixel-button-contained" 
                onClick={calculateKloc} 
                aria-label="Calculate KLOC"
              >
                GET KLOC
              </button>
            </div>
            <div className="cocomo-pixel-input-row">
              <span className="cocomo-pixel-input-label">KLOC=</span>
              <input 
                type="text" 
                className="cocomo-pixel-text-input cocomo-pixel-text-input-readonly" 
                value={kloc} 
                aria-label="KLOC result" 
                readOnly 
              />
            </div>
          </div>

          <h3 className="cocomo-pixel-section-header">Software Cost Drivers</h3>
          
          {/* Product Attributes */}
          <div className="cocomo-pixel-section">
            <h4 className="cocomo-pixel-subheader">Product:</h4>
            <div className="cocomo-pixel-form-group">
              <label htmlFor="reliability" className="cocomo-pixel-select-label">Requirement software reliability:</label>
              <select 
                className="cocomo-pixel-select" 
                id="reliability"
                value={costDrivers.reliability}
                onChange={(e) => handleCostDriverChange('reliability', e.target.value)}
              >
                <option value="0.75">Very low</option>
                <option value="0.88">low</option>
                <option value="1">Nominal</option>
                <option value="1.15">high</option>
                <option value="1.40">Very high</option>
                <option value="1.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="size-db" className="cocomo-pixel-select-label">Size of application database:</label>
              <select 
                className="cocomo-pixel-select" 
                id="size-db"
                value={costDrivers.databaseSize}
                onChange={(e) => handleCostDriverChange('databaseSize', e.target.value)}
              >
                <option value="0.75">Very low</option>
                <option value="0.94">low</option>
                <option value="1">Nominal</option>
                <option value="1.08">high</option>
                <option value="1.16">Very high</option>
                <option value="1.30">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="complexity" className="cocomo-pixel-select-label">Complexity of the product:</label>
              <select 
                className="cocomo-pixel-select" 
                id="complexity"
                value={costDrivers.complexity}
                onChange={(e) => handleCostDriverChange('complexity', e.target.value)}
              >
                <option value="0.75">Very low</option>
                <option value="0.85">low</option>
                <option value="1">Nominal</option>
                <option value="1.15">high</option>
                <option value="1.30">Very high</option>
                <option value="1.65">Extremely high</option>
              </select>
            </div>
          </div>

          {/* Hardware Attributes */}
          <div className="cocomo-pixel-section">
            <h4 className="cocomo-pixel-subheader">Hardware attributes:</h4>
            <div className="cocomo-pixel-form-group">
              <label htmlFor="runtime" className="cocomo-pixel-select-label">Run-time performance constraints:</label>
              <select 
                className="cocomo-pixel-select" 
                id="runtime"
                value={costDrivers.runtimeConstraints}
                onChange={(e) => handleCostDriverChange('runtimeConstraints', e.target.value)}
              >
                <option value="0.75">Very low</option>
                <option value="0.88">low</option>
                <option value="1">Nominal</option>
                <option value="1.15">high</option>
                <option value="1.40">Very high</option>
                <option value="1.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="memory" className="cocomo-pixel-select-label">Memory constraints:</label>
              <select 
                className="cocomo-pixel-select" 
                id="memory"
                value={costDrivers.memoryConstraints}
                onChange={(e) => handleCostDriverChange('memoryConstraints', e.target.value)}
              >
                <option value="0.75">Very low</option>
                <option value="0.88">low</option>
                <option value="1">Nominal</option>
                <option value="1.15">high</option>
                <option value="1.40">Very high</option>
                <option value="1.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="volatility" className="cocomo-pixel-select-label">Volatility of virtual machines environment:</label>
              <select 
                className="cocomo-pixel-select" 
                id="volatility"
                value={costDrivers.vmVolatility}
                onChange={(e) => handleCostDriverChange('vmVolatility', e.target.value)}
              >
                <option value="0.75">Very low</option>
                <option value="0.88">low</option>
                <option value="1">Nominal</option>
                <option value="1.15">high</option>
                <option value="1.40">Very high</option>
                <option value="1.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="turnabout" className="cocomo-pixel-select-label">Required turnabout time:</label>
              <select 
                className="cocomo-pixel-select" 
                id="turnabout"
                value={costDrivers.turnaroundTime}
                onChange={(e) => handleCostDriverChange('turnaroundTime', e.target.value)}
              >
                <option value="0.75">Very low</option>
                <option value="0.88">low</option>
                <option value="1">Nominal</option>
                <option value="1.15">high</option>
                <option value="1.40">Very high</option>
                <option value="1.50">Extremely high</option>
              </select>
            </div>
          </div>

          {/* Personnel Attributes */}
          <div className="cocomo-pixel-section">
            <h4 className="cocomo-pixel-subheader">Personnel attributes:</h4>
            <div className="cocomo-pixel-form-group">
              <label htmlFor="analyst" className="cocomo-pixel-select-label">Analyst capability:</label>
              <select 
                className="cocomo-pixel-select" 
                id="analyst"
                value={costDrivers.analystCapability}
                onChange={(e) => handleCostDriverChange('analystCapability', e.target.value)}
              >
                <option value="1.46">Very low</option>
                <option value="1.19">low</option>
                <option value="1">Nominal</option>
                <option value="0.86">high</option>
                <option value="0.71">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="experience" className="cocomo-pixel-select-label">Application experience:</label>
              <select 
                className="cocomo-pixel-select" 
                id="experience"
                value={costDrivers.applicationExperience}
                onChange={(e) => handleCostDriverChange('applicationExperience', e.target.value)}
              >
                <option value="1.29">Very low</option>
                <option value="1.13">low</option>
                <option value="1">Nominal</option>
                <option value="0.91">high</option>
                <option value="0.82">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="engineering" className="cocomo-pixel-select-label">Software engineering capability:</label>
              <select 
                className="cocomo-pixel-select" 
                id="engineering"
                value={costDrivers.softwareEngineeringCapability}
                onChange={(e) => handleCostDriverChange('softwareEngineeringCapability', e.target.value)}
              >
                <option value="1.42">Very low</option>
                <option value="1.17">low</option>
                <option value="1">Nominal</option>
                <option value="0.86">high</option>
                <option value="0.71">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="vm-experience" className="cocomo-pixel-select-label">Virtual machine experience:</label>
              <select 
                className="cocomo-pixel-select" 
                id="vm-experience"
                value={costDrivers.vmExperience}
                onChange={(e) => handleCostDriverChange('vmExperience', e.target.value)}
              >
                <option value="1.21">Very low</option>
                <option value="1.10">low</option>
                <option value="1">Nominal</option>
                <option value="0.90">high</option>
                <option value="0.71">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="language" className="cocomo-pixel-select-label">Programming language experience:</label>
              <select 
                className="cocomo-pixel-select" 
                id="language"
                value={costDrivers.languageExperience}
                onChange={(e) => handleCostDriverChange('languageExperience', e.target.value)}
              >
                <option value="1.14">Very low</option>
                <option value="1.07">low</option>
                <option value="1">Nominal</option>
                <option value="0.95">high</option>
                <option value="0.71">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
          </div>

          {/* Project Attributes */}
          <div className="cocomo-pixel-section">
            <h4 className="cocomo-pixel-subheader">Project attributes:</h4>
            <div className="cocomo-pixel-form-group">
              <label htmlFor="methods" className="cocomo-pixel-select-label">Application of software Engineering methods:</label>
              <select 
                className="cocomo-pixel-select" 
                id="methods"
                value={costDrivers.methodsUse}
                onChange={(e) => handleCostDriverChange('methodsUse', e.target.value)}
              >
                <option value="1.24">Very low</option>
                <option value="1.10">low</option>
                <option value="1">Nominal</option>
                <option value="0.91">high</option>
                <option value="0.82">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="tools" className="cocomo-pixel-select-label">Use of software tools:</label>
              <select 
                className="cocomo-pixel-select" 
                id="tools"
                value={costDrivers.toolsUse}
                onChange={(e) => handleCostDriverChange('toolsUse', e.target.value)}
              >
                <option value="1.24">Very low</option>
                <option value="1.10">low</option>
                <option value="1">Nominal</option>
                <option value="0.91">high</option>
                <option value="0.82">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
            
            <div className="cocomo-pixel-form-group">
              <label htmlFor="schedule" className="cocomo-pixel-select-label">Required development schedule:</label>
              <select 
                className="cocomo-pixel-select" 
                id="schedule"
                value={costDrivers.schedule}
                onChange={(e) => handleCostDriverChange('schedule', e.target.value)}
              >
                <option value="1.24">Very low</option>
                <option value="1.10">low</option>
                <option value="1">Nominal</option>
                <option value="0.91">high</option>
                <option value="0.82">Very high</option>
                <option value="0.50">Extremely high</option>
              </select>
            </div>
          </div>

          <div className="cocomo-pixel-button-group">
            <button className="cocomo-pixel-button-contained" onClick={calculateMf} aria-label="Calculate MF">
              Calculate MF
            </button>
            <input 
              className="cocomo-pixel-text-input cocomo-pixel-text-input-readonly" 
              type="text" 
              value={mf} 
              readOnly 
            />
          </div>
        </div>

        <div className="cocomo-pixel-card">
          <div className="cocomo-pixel-form-group">
            <label htmlFor="class" className="cocomo-pixel-select-label">Select the class type</label>
            <select 
              className="cocomo-pixel-select" 
              id="class"
              value={projectClass}
              onChange={(e) => setProjectClass(e.target.value)}
            >
              <option value="1">ORGANIC</option>
              <option value="2">SEMI-DETACHED</option>
              <option value="3">EMBEDDED</option>
            </select>
          </div>

          <div className="cocomo-pixel-form-group">
            <label htmlFor="LR" className="cocomo-pixel-input-label">LABOR RATE:</label>
            <div className="cocomo-pixel-input-row">
              <input 
                type="text" 
                className="cocomo-pixel-text-input" 
                placeholder="labour rate" 
                id="LR" 
                aria-label="Enter LABOR RATE" 
                required 
                value={laborRate}
                onChange={(e) => setLaborRate(e.target.value)}
              />
              <span className="cocomo-pixel-input-suffix">$</span>
            </div>
          </div>

          <div className="cocomo-pixel-button-group">
            <button 
              className="cocomo-pixel-button-contained" 
              onClick={calculateEffort} 
              aria-label="Calculate Effort, Time, and Cost"
            >
              Calculate Effort, Time, and Cost
            </button>
          </div>
          
          <div className="cocomo-pixel-results-group">
            <div className="cocomo-pixel-result-item">
              <span className="cocomo-pixel-result-label">Effort:</span>
              <div className="cocomo-pixel-result-value">
                <input 
                  type="text" 
                  className="cocomo-pixel-text-input cocomo-pixel-text-input-readonly" 
                  value={effort} 
                  aria-label="Effort result" 
                  readOnly 
                />
                <span className="cocomo-pixel-input-suffix">P-M</span>
              </div>
            </div>
            
            <div className="cocomo-pixel-result-item">
              <span className="cocomo-pixel-result-label">Time of Dev.:</span>
              <div className="cocomo-pixel-result-value">
                <input 
                  type="text" 
                  className="cocomo-pixel-text-input cocomo-pixel-text-input-readonly" 
                  value={time} 
                  aria-label="Time of Development result" 
                  readOnly 
                />
                <span className="cocomo-pixel-input-suffix">Months</span>
              </div>
            </div>
            
            <div className="cocomo-pixel-result-item">
              <span className="cocomo-pixel-result-label">Cost:</span>
              <div className="cocomo-pixel-result-value">
                <input 
                  type="text" 
                  className="cocomo-pixel-text-input cocomo-pixel-text-input-readonly" 
                  value={cost} 
                  aria-label="Cost result" 
                  readOnly 
                />
                <span className="cocomo-pixel-input-suffix">$</span>
              </div>
            </div>
          </div>
        </div>

        <Link href="/sloc" className="cocomo-pixel-text-button">
          <svg className="cocomo-pixel-icon" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
            <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/>
          </svg>
          Go Back
        </Link>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default CocomoEstimation;