'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Cocomo.css';

const Sloc = () => {
  const [functionPoint, setFunctionPoint] = useState('');
  const [languageFactor, setLanguageFactor] = useState('null');
  const [sloc, setSloc] = useState('');

  const calc = (e) => {
    e.preventDefault();
    const fp = Number(functionPoint);
    const factor = Number(languageFactor);

    if (!isNaN(fp) && !isNaN(factor) && factor > 0) {
      const result = fp * factor;
      setSloc(result);
    } else {
      setSloc('Invalid input');
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Source Lines of Code (SLOC) Calculator</title>
        <meta name="description" content="Calculate Source Lines of Code (SLOC) based on Function Points and Programming Language." />
        <meta name="keywords" content="SLOC, source lines of code, function point, software estimation, software cost estimation, programming languages" />
        <meta name="author" content="EstimateUp" />
      </Head>

      <div className="cocomo-pixel-theme container py-5">
        <h1 className="mb-4 t_name">Source Lines of Code (SLOC) Calculator</h1>
        <form>
          <div className='sloc_separate_item'>
            <div className="form-group row items mb-2">
              <label htmlFor="askfp" className="col-sm-3 col-form-label">FUNCTION POINT:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="askfp"
                  className="form-control"
                  value={functionPoint}
                  onChange={(e) => setFunctionPoint(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row items mb-1">
              <label htmlFor="language_factor" className="col-sm-3 col-form-label">LANGUAGE USED:</label>
              <div className="col-sm-8">
                <select
                  id="language_factor"
                  className="form-control"
                  value={languageFactor}
                  onChange={(e) => setLanguageFactor(e.target.value)}
                >
                  <option value="null">Language</option>
                  <option value="97">C</option>
                  <option value="53">JAVA</option>
                  <option value="50">C++</option>
                  <option value="46">J2EE</option>
                  <option value="61">COBOL</option>
                  <option value="54">C#</option>
                  <option value="34">HTML</option>
                  <option value="57">.NET</option>
                  <option value="37">ORACLE</option>
                  <option value="21">SQL</option>
                </select>
              </div>
            </div>
            <small className="form-text text-muted">
              **The language factors used for the calculation are taken on the basis of average value.
            </small>
            <div className="sloc-buttons" style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'baseline' }}>
              <div className="col-sm-5">
                <button className="mr-3 align-self-center sloc_btn" type="button" onClick={calc}>
                  Calculate SLOC
                </button>
              </div>
              <div className="col-sm-5">
                <input type="text" id="result_sloc" className="form-control" value={sloc} readOnly />
              </div>
            </div>

            <div className="nav-buttons">
              <div className='btn-box'>
                
                  <Link href="/function" className="cocomo-pixel-text-button">
                    <svg className="cocomo-pixel-icon" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                      <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
                    </svg>
                    Go Back
                  </Link>
                
                <div>
                  <Link href="/estimate" className="btn btn-primary" style={{ display: 'flex' }}>
                    <span>Estimate Effort, Time, Cost</span>
                    <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default Sloc;
