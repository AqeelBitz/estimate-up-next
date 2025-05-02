'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import MessageCard from '../components/MessageCard';
import signin_img from '../../../public/images/signin.jpg';
import '../styles/Auth.css';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const toggleImageVisibility = () => {
      const image = document.getElementById('img_container');
      if (image) {
        image.style.display = window.innerWidth <= 768 ? 'none' : 'block';
      }
    };

    toggleImageVisibility();
    window.addEventListener('resize', toggleImageVisibility);

    return () => {
      window.removeEventListener('resize', toggleImageVisibility);
    };
  }, []);

  const validate = () => {
    let isValid = true;
    const newErrors = { email: false, password: false };
    let errorMessage = '';

    if (!formData.email) {
      newErrors.email = true;
      errorMessage = "Please enter an email address.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true;
      errorMessage = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = true;
      errorMessage = "Please enter a password.";
      isValid = false;
    }

    setErrors(newErrors);
    if (errorMessage) {
      setMessage({
        type: 'error',
        message: 'Validation Error',
        subMessage: errorMessage
      });
    }

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log('Login email:', data.email); 
      localStorage.setItem('loggedin_user', data.email); 
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and authenticate
      login(data.token);
      
      setMessage({
        type: 'success',
        message: 'Login Successful',
        subMessage: 'Redirecting to home page...'
      });

      // Redirect after showing success message
      setTimeout(() => router.push('/'), 2000);

    } catch (error) {
      console.error('Login error:', error);
      const errorType = error.message.includes('Network') ? 'warning' : 'error';
      setMessage({
        type: errorType,
        message: errorType === 'warning' ? 'Network Error' : 'Login Failed',
        subMessage: error.message || (errorType === 'warning' 
          ? 'Please check your connection.' 
          : 'Invalid email or password.')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-5 col-lg-5 col-xl-4 my-5">
            <div className="my-container border border-secondary rounded p-3">
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4">Sign In</h3>

                <div className="mb-4 text-start">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter email"
                  />
                  {errors.email && <div className="invalid-feedback">{message?.subMessage}</div>}
                </div>

                <div className="mb-4 text-start">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter password"
                  />
                  {errors.password && <div className="invalid-feedback">{message?.subMessage}</div>}
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : 'Submit'}
                  </button>
                </div>

                <p className="forgot-password text-right">
                  <Link href="/sign-up">Create Account?</Link>
                </p>
              </form>
            </div>
          </div>

          <div className="col-md-6 col-lg-7 col-xl-8 order-md-first img_container" id='img_container'>
            <Image 
              src={signin_img} 
              alt="login form illustration" 
              className="img-fluid" 
              style={{ height: '80vh', objectFit: 'contain' }} 
              priority
            />
          </div>
        </div>
      </div>

      {message && (
        <MessageCard 
          type={message.type} 
          message={message.message} 
          subMessage={message.subMessage} 
          onClose={() => setMessage(null)}
        />
      )}

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Login;