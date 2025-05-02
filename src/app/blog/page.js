"use client"
import  { useState } from 'react';
import '../styles/Blog.css';

const blogPosts = [
    {
      id: 1,
      title: "Understanding COCOMO II: A Comprehensive Guide",
      date: "May 15, 2023",
      summary: "Learn how to effectively use the COCOMO II model for your software project estimations.",
      fullContent: `
        <h2>Introduction to COCOMO II</h2>
        <p>Our COCOMO II calculator implements the modern Constructive Cost Model developed by Barry Boehm, providing accurate estimates for software development projects.</p>
        
        <h3>Key Features of Our Implementation</h3>
        <ul>
          <li><strong>Three Estimation Models:</strong> Application Composition, Early Design, and Post-Architecture</li>
          <li><strong>Detailed Function Point Analysis:</strong> 14 complexity factors rated 0-5</li>
          <li><strong>Scale Factors:</strong> PREC, FLEX, RESL, TEAM, and PMAT</li>
          <li><strong>Effort Multipliers:</strong> PERS, RCPX, RUSE, PDIF, FCIL, SCED</li>
        </ul>
        
        <h3>How to Use the Calculator</h3>
        <ol>
          <li>Complete the Function Point Analysis section</li>
          <li>Select appropriate scale factors</li>
          <li>Choose your estimation model based on project phase</li>
          <li>Review the calculated effort and duration</li>
        </ol>
        
        <h3>Technical Implementation</h3>
        <p>The calculator uses React with:</p>
        <ul>
          <li>useEffect and useRef hooks for DOM interaction</li>
          <li>Complex calculation logic following COCOMO II formulas</li>
          <li>Responsive design with accessibility features</li>
        </ul>
        
        <h3>Example Calculation</h3>
        <pre>
          Effort = A × (Size)^E × ∏(EM)\n
          Where:
          A = 2.94 (constant)
          Size = KLOC
          E = Exponent from scale factors
          EM = Effort multipliers
        </pre>
      `
    },
    {
      id: 2,
      title: "Function Point Analysis: When and How to Use It",
      date: "April 28, 2023",
      summary: "Discover the power of Function Point Analysis for estimating software development costs.",
      fullContent: `
        <h2>Function Point Basics</h2>
        <p>Function Point Analysis is a method used to measure the functional size of software applications.</p>
        
        <h3>Our Implementation Includes:</h3>
        <ul>
          <li><strong>External Inputs (EI):</strong> Data entering the system</li>
          <li><strong>External Outputs (EO):</strong> Data leaving the system</li>
          <li><strong>Internal Logical Files (ILF):</strong> Data maintained within the system</li>
          <li><strong>External Interface Files (EIF):</strong> Data referenced but not maintained</li>
          <li><strong>External Inquiries (EQ):</strong> Input/output combinations</li>
        </ul>
        
        <h3>Complexity Factors</h3>
        <p>Our calculator evaluates 14 factors including:</p>
        <ul>
          <li>Data communications</li>
          <li>Distributed processing</li>
          <li>Performance requirements</li>
          <li>Transaction frequency</li>
          <li>End-user efficiency</li>
        </ul>
        
        <h3>Calculation Process</h3>
        <ol>
          <li>Count each function point type</li>
          <li>Assign complexity weights</li>
          <li>Calculate Unadjusted Function Points (UFP)</li>
          <li>Apply Value Adjustment Factor (VAF)</li>
          <li>Compute Adjusted Function Points (AFP)</li>
        </ol>
        
        <h3>Integration with COCOMO II</h3>
        <p>The function points are converted to KLOC for use in the COCOMO II equations:</p>
        <pre>
          KLOC = AFP × (conversion factor)
        </pre>
      `
    },
    {
        id: 3,
        title: "Mastering COCOMO-I: The Complete Estimation Guide",
        date: "June 10, 2023",
        summary: "Learn how to use all three COCOMO-I estimation techniques in our calculator.",
        fullContent: `
          <h2>Introduction to COCOMO-I</h2>
          <p>The Constructive Cost Model (COCOMO-I) is a procedural software cost estimation model developed by Barry Boehm. Our implementation provides three key estimation methods:</p>
          
          <h3>1. Function Point Analysis</h3>
          <p>This method measures functionality from the user's perspective:</p>
          <ul>
            <li><strong>Inputs:</strong> User inputs and inquiries</li>
            <li><strong>Outputs:</strong> Screens, reports, and interfaces</li>
            <li><strong>Files:</strong> Internal logical files and external interfaces</li>
          </ul>
          <p>Our calculator automatically converts function points to SLOC for COCOMO calculations.</p>
          
          <h3>2. Source Lines of Code (SLOC)</h3>
          <p>The traditional COCOMO approach using code size:</p>
          <ul>
            <li><strong>Organic Mode:</strong> Small teams with flexible requirements</li>
            <li><strong>Semi-Detached Mode:</strong> Medium-size projects</li>
            <li><strong>Embedded Mode:</strong> Complex projects with strict requirements</li>
          </ul>
          
          <h3>3. Effort, Time, and Cost Estimation</h3>
          <p>The core COCOMO formulas we implement:</p>
          <pre>
            Effort = a × (KLOC)^b × EAF\n
            Development Time = c × (Effort)^d\n
            Staff Required = Effort / Development Time
          </pre>
          <p>Where EAF is the Effort Adjustment Factor from cost drivers.</p>
          
          <h2>Practical Usage Guide</h2>
          <h3>Step 1: Choose Your Input Method</h3>
          <p>Select either Function Points or direct SLOC input based on your project phase.</p>
          
          <h3>Step 2: Select Project Characteristics</h3>
          <p>Our calculator includes all COCOMO-I cost drivers:</p>
          <ul>
            <li>Product attributes (RELY, DATA, CPLX)</li>
            <li>Hardware attributes (TIME, STOR, VIRT)</li>
            <li>Personnel attributes (ACAP, AEXP, PCAP)</li>
            <li>Project attributes (TOOL, SCED)</li>
          </ul>
          
          <h3>Step 3: Review Results</h3>
          <p>The calculator provides:</p>
          <ul>
            <li>Estimated effort in person-months</li>
            <li>Project duration in months</li>
            <li>Staffing requirements</li>
            <li>Cost estimates (when hourly rates are provided)</li>
          </ul>
          
          <h2>Technical Implementation</h2>
          <p>Our React-based calculator features:</p>
          <ul>
            <li>Real-time calculations without page reloads</li>
            <li>Mode-specific coefficient adjustments</li>
            <li>Interactive forms with validation</li>
            <li>Responsive design for all devices</li>
          </ul>
        `
      },
      {
        id: 4,
        title: "Function Points vs SLOC: When to Use Each",
        date: "May 28, 2023",
        summary: "Understanding which COCOMO-I input method works best for your project phase.",
        fullContent: `
          <h2>Choosing the Right Estimation Approach</h2>
          
          <h3>Function Point Analysis</h3>
          <p><strong>Best for:</strong> Early-stage estimation when requirements are known but implementation details aren't</p>
          <p><strong>Advantages:</strong></p>
          <ul>
            <li>Technology-independent</li>
            <li>User perspective focused</li>
            <li>Better for comparing across projects</li>
          </ul>
          
          <h3>SLOC Direct Input</h3>
          <p><strong>Best for:</strong> Later stages when code structure is defined</p>
          <p><strong>Advantages:</strong></p>
          <ul>
            <li>More precise for known codebases</li>
            <li>Direct mapping to COCOMO formulas</li>
            <li>Better for maintenance estimates</li>
          </ul>
          
          <h3>Our Calculator's Conversion</h3>
          <p>We use industry-standard conversion factors:</p>
          <pre>
            SLOC = Function Points × Language Factor\n
            Language Factors:\n
            C: 128\n
            Java: 53\n
            Python: 30\n
            JavaScript: 55
          </pre>
        `
      },
      {
        id: 5,
        title: "Mastering Three-Point Estimation for Software Projects",
        date: "June 15, 2023",
        summary: "Learn how to use the PERT technique for more accurate project estimates.",
        fullContent: `
          <h2>Introduction to Three-Point Estimation</h2>
          <p>Three-Point Estimation, also known as PERT (Program Evaluation and Review Technique), is a statistical approach that considers three scenarios to calculate expected duration:</p>
          
          <h3>The Three Estimates</h3>
          <ul>
            <li><strong>Optimistic (O):</strong> Best-case scenario estimate</li>
            <li><strong>Most Likely (M):</strong> Realistic estimate</li>
            <li><strong>Pessimistic (P):</strong> Worst-case scenario estimate</li>
          </ul>
          
          <h2>Our Implementation Features</h2>
          <p>Your Three-Point Estimation tool provides:</p>
          <ul>
            <li>Task and subtask hierarchy for complex projects</li>
            <li>Real-time PERT calculations</li>
            <li>Responsive input forms</li>
            <li>Visual feedback on estimates</li>
          </ul>
          
          <h3>Key Formulas Used</h3>
          <pre>
            Expected Duration (E) = (O + 4M + P) / 6\n
            Standard Deviation (SD) = (P - O) / 6\n
            Variance (V) = [(P - O) / 6]²
          </pre>
          
          <h2>Step-by-Step Guide</h2>
          <h3>1. Adding Tasks</h3>
          <p>Click "Add Task" to create project components (e.g., "User Authentication")</p>
          
          <h3>2. Defining Subtasks</h3>
          <p>For each task, add subtasks with three estimates:</p>
          <ul>
            <li><strong>Example:</strong> "Implement login API"</li>
            <li>Optimistic: 2 hours</li>
            <li>Most Likely: 3 hours</li>
            <li>Pessimistic: 5 hours</li>
          </ul>
          
          <h3>3. Calculating Estimates</h3>
          <p>The tool automatically computes:</p>
          <ul>
            <li>Expected duration for each subtask</li>
            <li>Aggregated totals for all tasks</li>
            <li>Standard deviation for risk assessment</li>
          </ul>
          
          <h2>When to Use Three-Point Estimation</h2>
          <ul>
            <li><strong>Early project planning:</strong> When requirements are uncertain</li>
            <li><strong>Complex tasks:</strong> Where single-point estimates are unreliable</li>
            <li><strong>Risk management:</strong> To understand potential variances</li>
          </ul>
          
          <h2>Best Practices</h2>
          <ol>
            <li>Involve multiple team members in estimating</li>
            <li>Use historical data to inform your estimates</li>
            <li>Review and adjust estimates as projects progress</li>
            <li>Combine with other techniques like <Link to="/cocomo">COCOMO</Link> for comprehensive planning</li>
          </ol>
        `
      },
      {
        id: 6,
        title: "Understanding PERT: The Math Behind Three-Point Estimation",
        date: "May 22, 2023",
        summary: "Dive into the statistical foundations of the PERT technique.",
        fullContent: `
          <h2>The PERT Probability Distribution</h2>
          <p>Three-Point Estimation uses a beta distribution model that:</p>
          <ul>
            <li>Weights the most likely estimate 4x more than optimistic/pessimistic</li>
            <li>Accounts for uncertainty in project tasks</li>
            <li>Provides probability ranges for completion</li>
          </ul>
          
          <h3>Confidence Levels</h3>
          <p>The PERT model gives these probability ranges:</p>
          <pre>
            E ± SD = 68% confidence\n
            E ± 2SD = 95% confidence\n
            E ± 3SD = 99.7% confidence
          </pre>
          
          <h2>Example Calculation</h2>
          <p>For a task with estimates:</p>
          <ul>
            <li>Optimistic (O): 10 hours</li>
            <li>Most Likely (M): 15 hours</li>
            <li>Pessimistic (P): 25 hours</li>
          </ul>
          
          <p>Your tool calculates:</p>
          <pre>
            E = (10 + 4×15 + 25) / 6 = 15.83 hours\n
            SD = (25 - 10) / 6 = 2.5 hours\n
            Range: 13.33 to 18.33 hours (68% confidence)
          </pre>
          
          <h2>Comparing with Other Methods</h2>
          <table>
            <tr>
              <th>Method</th>
              <th>When to Use</th>
              <th>Advantages</th>
            </tr>
            <tr>
              <td>Three-Point</td>
              <td>Uncertain tasks</td>
              <td>Accounts for risk</td>
            </tr>
            <tr>
              <td>Analogous</td>
              <td>Similar past projects</td>
              <td>Quick estimates</td>
            </tr>
            <tr>
              <td>Parametric</td>
              <td>Quantifiable components</td>
              <td>Highly accurate</td>
            </tr>
          </table>
        `
      },{
        id: 7,
        title: "Mastering Delphi Estimation: The Three-Round Consensus Method",
        date: "June 15, 2023",
        summary: "Learn how Delphi's structured rounds produce accurate software estimates through expert consensus.",
        fullContent: `
          <h2>The Delphi Estimation Process</h2>
          <p>Delphi estimation uses anonymous expert input across three structured rounds:</p>
          <ul>
            <li>Eliminates groupthink and personality bias</li>
            <li>Progressively converges toward consensus</li>
            <li>Provides statistical analysis of estimates</li>
          </ul>
          
          <h3>Round Breakdown</h3>
          <table class="delphi-rounds">
            <tr>
              <th>Round</th>
              <th>Purpose</th>
              <th>Key Actions</th>
            </tr>
            <tr>
              <td>1</td>
              <td>Initial Estimates</td>
              <td>Independent anonymous estimates</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Feedback & Revision</td>
              <td>Review group statistics and adjust</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Final Consensus</td>
              <td>Converge on final estimates</td>
            </tr>
          </table>
          
          <h2>Statistical Analysis</h2>
          <p>After Round 3, your tool calculates:</p>
          <pre>
            Average Effort = Mean of all final estimates\n
            Confidence Interval = ±2 Standard Deviations\n
            Standard Error = SD/√(number of estimators)
          </pre>
          
          <h2>Example Estimation Flow</h2>
          <p>For a login module:</p>
          <div class="estimate-flow">
            <div class="round">
              <h4>Round 1 Estimates (days)</h4>
              <p>Estimator A: 3, Estimator B: 5, Estimator C: 7</p>
            </div>
            <div class="round">
              <h4>Round 2 Estimates</h4>
              <p>After seeing average (5 days): 4, 5, 6</p>
            </div>
            <div class="round">
              <h4>Round 3 Consensus</h4>
              <p>Final estimates: 5, 5, 5</p>
              <p>Result: 5 days ±0.5 (95% confidence)</p>
            </div>
          </div>
          
          <h2>When to Use Delphi</h2>
          <table class="method-comparison">
            <tr>
              <th>Situation</th>
              <th>Best Method</th>
              <th>Reason</th>
            </tr>
            <tr>
              <td>Novel projects</td>
              <td>Delphi</td>
              <td>Leverages expert judgment</td>
            </tr>
            <tr>
              <td>Controversial estimates</td>
              <td>Delphi</td>
              <td>Removes political bias</td>
            </tr>
            <tr>
              <td>Clear requirements</td>
              <td>Three-Point</td>
              <td>Faster for known quantities</td>
            </tr>
          </table>
          
          <h3>Pro Tips</h3>
          <ol>
            <li>Include 3-7 domain experts</li>
            <li>Provide detailed specifications</li>
            <li>Allow 2-3 days between rounds</li>
            <li>Focus discussion on outliers</li>
          </ol>
        `,
        css: `
          .delphi-rounds {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }
          .delphi-rounds th, .delphi-rounds td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .delphi-rounds tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .estimate-flow {
            border-left: 3px solid #3498db;
            padding-left: 1rem;
            margin: 1.5rem 0;
          }
          .round {
            margin-bottom: 1rem;
          }
          .method-comparison {
            width: 100%;
            margin: 1rem 0;
          }
          .method-comparison th {
            background-color: #3498db;
            color: white;
          }
          pre {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
        `
      }
  ];
const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="blog-container">
      <div className="blog-wrapper">
        <h1 className="blog-title">EstimateUp Blog</h1>
        
        {!selectedPost ? (
          blogPosts.map(post => (
            <div 
              key={post.id} 
              className="blog-card"
              onClick={() => setSelectedPost(post)}
            >
              <h2 className="blog-heading">{post.title}</h2>
              <small className="blog-date">{post.date}</small>
              <p className="blog-content">{post.summary}</p>
              <button className="read-more-btn">Read More</button>
            </div>
          ))
        ) : (
          <div className="blog-detail">
            <button className="back-btn" onClick={() => setSelectedPost(null)}>
              ← Back to Blog
            </button>
            <h2 className="blog-heading">{selectedPost.title}</h2>
            <small className="blog-date">{selectedPost.date}</small>
            <div 
              className="blog-full-content"
              dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;