'use client'; // This ensures that the component is rendered on the client side

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter
import Image from 'next/image'; // Use Next.js Image component
import signup_img from '../../../public/images/signup.jpg'; // Image should be inside the 'public' folder
import  '../styles/Auth.css'; // Assuming you're using CSS Modules
import Link from 'next/link';


const Signup = () => {
  const router = useRouter(); // Replace useNavigate with useRouter
  const [user, setUser] = useState({ fname: '', lname: '', email: '', password: '' });
  const [errors, setErrors] = useState({ fname: '', lname: '', email: '', password: '' });
  const [showMessage, setShowMessage] = useState({ type: '', message: '', subMessage: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const toggleImageVisibility = () => {
      const image = document.getElementById('img_container');
      if (image) {
        image.style.display = window.innerWidth <= 768 ? 'none' : 'block';
      }
    };

    toggleImageVisibility(); // Run on mount
    window.addEventListener('resize', toggleImageVisibility);

    return () => {
      window.removeEventListener('resize', toggleImageVisibility);
    };
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const Validation = () => {
    let isValid = true;
    const newErrors = { fname: '', lname: '', email: '', password: '' };

    // First Name Validation
    if (!user.fname) {
      newErrors.fname = 'First name is required.';
      isValid = false;
    } else if (user.fname.length < 3) {
      newErrors.fname = 'First name must be at least 3 characters long.';
      isValid = false;
    }

    // Last Name Validation
    if (!user.lname) {
      newErrors.lname = 'Last name is required.';
      isValid = false;
    } else if (user.lname.length < 3) {
      newErrors.lname = 'Last name must be at least 3 characters long.';
      isValid = false;
    }

    // Email Validation
    if (!user.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password Validation
    if (!user.password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (user.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
      isValid = false;
    } else if (!/[A-Z]/.test(user.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
      isValid = false;
    } else if (!/[0-9]/.test(user.password)) {
      newErrors.password = 'Password must contain at least one number.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const PostData = async (e) => {
    e.preventDefault();
    if (!Validation()) {
      return; // Stop if validation fails
    }

    setIsLoading(true); // Show loader
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();

      if (data.status === 422 || !data) {
        setShowMessage({ type: 'error', message: 'Invalid Registration', subMessage: 'Please check your details.' });
      } else {
        setShowMessage({ type: 'success', message: 'Registration Successful', subMessage: 'Redirecting to login page...' });
        setTimeout(() => {
          router.push('/sign-in'); // Redirect using Next.js's router
        }, 2000);
      }
    } catch (error) {
      setShowMessage({ type: 'warning', message: 'Network Error', subMessage: 'Please check your connection.' });
    } finally {
      setIsLoading(false); // Hide loader
      setTimeout(() => setShowMessage({ type: '', message: '', subMessage: '' }), 3000); // Hide message after 3 seconds
    }
  };

  return (
    <div className="custom-container">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-5 col-lg-5 col-xl-4 my-5 border border-secondary rounded p-3 my-container">
            <form method="POST">
              <h3 className="mb-4">Sign Up</h3>

              {/* First Name */}
              <div className="mb-3">
                <input
                  value={user.fname}
                  onChange={handleInput}
                  name="fname"
                  type="text"
                  className={`form-control ${errors.fname ? 'is-invalid' : ''}`}
                  placeholder="First name"
                />
                {errors.fname && <div className="invalid-feedback">{errors.fname}</div>}
              </div>

              {/* Last Name */}
              <div className="mb-3">
                <input
                  value={user.lname}
                  onChange={handleInput}
                  name="lname"
                  type="text"
                  className={`form-control ${errors.lname ? 'is-invalid' : ''}`}
                  placeholder="Last name"
                />
                {errors.lname && <div className="invalid-feedback">{errors.lname}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <input
                  value={user.email}
                  onChange={handleInput}
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <input
                  value={user.password}
                  onChange={handleInput}
                  name="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {/* Submit Button */}
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary" onClick={PostData} disabled={isLoading}>
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>

              {/* Sign In Link */}
              <p className="forgot-password text-center mt-3">
                Already registered? <Link href="/sign-in">Sign in here</Link>
              </p>
            </form>
          </div>

          {/* Image Container */}
          <div className="col-md-6 col-lg-7 col-xl-8 order-md-first img_container" id="img_container">
            <Image src={signup_img} alt="Signup form illustration" className="img-fluid" style={{ height: '80vh', objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* Message Card */}
      {showMessage.type && (
        <div className="message-card-overlay">
          <div className={`message-card ${showMessage.type}`}>
            <svg className="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                fillOpacity="1"
              ></path>
            </svg>

            <div className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                strokeWidth="0"
                fill="currentColor"
                width="36px"
                height="36px"
              >
                <path
                  fill="currentColor"
                  d="M256 8C119.031 8 8 119.031 8 256s111.031 248 248 248 248-111.031 248-248S392.969 8 256 8zM256 440c-101.745 0-184-82.255-184-184S154.255 72 256 72s184 82.255 184 184-82.255 184-184 184z"
                ></path>
              </svg>
            </div>

            <div className="message">
              <p>{showMessage.message}</p>
              <small>{showMessage.subMessage}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
