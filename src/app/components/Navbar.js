'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import logo from '../../../public/images/my_logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showMessage, setShowMessage] = useState({ 
        type: '', 
        message: '', 
        subMessage: '' 
    });
    const router = useRouter();

    useEffect(() => {
        const toggleImageVisibility = () => {
            const image = document.getElementById('myImage');
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

    const closeNavbar = () => {
        setIsNavOpen(false);
    };

    const handleLogoutClick = async () => {
        setIsLoading(true);
        try {
            await logout(); // Using the logout function from AuthContext
            setShowMessage({ 
                type: 'success', 
                message: 'Logout Successful', 
                subMessage: 'Redirecting...' 
            });
            
            // No need for manual redirect as logout() already handles it
        } catch (error) {
            setShowMessage({ 
                type: 'error', 
                message: 'Logout Failed', 
                subMessage: error.message || 'Please try again.' 
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowMessage({ 
                type: '', 
                message: '', 
                subMessage: '' 
            }), 3000);
        }
    };

    return (
        <div>
            <nav className="myNavbar sticky-top navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link href="/" passHref>
                        <Image 
                            className="navbar-brand text-light" 
                            src={logo} 
                            alt="EstimatUp" 
                            width={200} 
                            height={60}
                            priority
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsNavOpen(!isNavOpen)}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link 
                                    className="nav-link active text-light hover-underline-animation" 
                                    href="/" 
                                    onClick={closeNavbar}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className="nav-link active text-light hover-underline-animation" 
                                    href="/about" 
                                    onClick={closeNavbar}
                                >
                                    About
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className="nav-link active text-light hover-underline-animation" 
                                    href="/service" 
                                    onClick={closeNavbar}
                                >
                                    Services
                                </Link>
                            </li>
                        </ul>

                        <ul className="navbar-nav right-nav-items">
                            {isAuthenticated ? (
                                <li className="nav-item">
                                    <button 
                                        className="mysubmit" 
                                        type="button" 
                                        onClick={() => {
                                            handleLogoutClick();
                                            closeNavbar();
                                          }} 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Logging Out...' : 'Logout'}
                                    </button>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link href="/sign-in" passHref>
                                            <button 
                                                className="mysubmit login-btn" 
                                                type="button" 
                                                onClick={closeNavbar}
                                            >
                                                Login
                                            </button>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/sign-up" passHref>
                                            <button 
                                                className="mysubmit signup-btn" 
                                                type="button" 
                                                onClick={closeNavbar}
                                            >
                                                Sign Up
                                            </button>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Message Card */}
            {showMessage.type && (
                <div className="message-card-overlay">
                    <div className={`message-card ${showMessage.type}`}>
                        <svg className="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                                fillOpacity="1"
                            />
                        </svg>

                        <div className="message-content">
                            <div className="message-icon">
                                {showMessage.type === 'success' ? (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                ) : showMessage.type === 'error' ? (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                    </svg>
                                )}
                            </div>
                            <div className="message-text">
                                <h4>{showMessage.message}</h4>
                                <p>{showMessage.subMessage}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loader */}
            {isLoading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
        </div>
    );
};

export default Navbar;