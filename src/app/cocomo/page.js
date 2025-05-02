'use client';

import Head from 'next/head';
import Link from 'next/link';
import '../styles/Cocomo.css';
import ProtectedRoute from '../components/ProtectedRoute';

const Cocomo = () => {
  return (
    <ProtectedRoute>
      <Head>
        <title>COCOMO I Estimation Tool | EstimateUp</title>
        <meta
          name="description"
          content="Use the COCOMO-I model to estimate software development effort, time, and cost. Start with Function Point or SLOC input and get accurate predictions."
        />
        <meta property="og:title" content="COCOMO-I Estimator | EstimateUp" />
        <meta
          property="og:description"
          content="Estimate software project effort and duration using the COCOMO-I model. Includes Function Point and SLOC-based estimation methods."
        />
        <meta property="og:url" content="https://estimate-up.vercel.app/cocomo" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://estimate-up.vercel.app/cocomo" />
      </Head>

      <main className="container">
        <section className="cocomo-header">
          <h1>COCOMO-I</h1>
          <p className="subtitle">Estimate software project effort, time, and cost with industry-proven models</p>
        </section>

        <section className="card">
          <h3>Functionalities</h3>
          <ul className="button-list">
            <li className='li-item'>
              <Link href="/function">
                <button className="md-button">Function Point Calculation</button>
              </Link>
            </li>
            <li className='li-item'>
              <Link href="/sloc">
                <button className="md-button">SLOC Calculation</button>
              </Link>
            </li>
            <li className='li-item'>
              <Link href="/estimate">
                <button className="md-button">Effort, Time & Cost Estimation</button>
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default Cocomo;
