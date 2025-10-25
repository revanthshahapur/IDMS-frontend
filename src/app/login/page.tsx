'use client';

import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { APIURL } from '@/constants/api';
import Loader from '@/components/Loader';


interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
  email: string;
  roles: string[];
  token: string;
  employeeId?: string | null;
  employeeName?: string | null;
  department?: string | null;
  position?: string | null;
  status?: string | null;
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});
  const [loginAsEmployee, setLoginAsEmployee] = useState(false);
  
  const redirectBasedOnRole = (roles: string[]) => {
    if (roles.includes('ADMIN')) {
      router.replace('/admin');
    } else if (roles.includes('STORE')) {
      router.replace('/store');
    } else if (roles.includes('FINANCE')) {
      router.replace('/finance-manager/dashboard');
    } else if (roles.includes('HR')) {
      router.replace('/hr');
    } else if (roles.includes('DATAMANAGER')) {
      router.replace('/data-manager');
    } else {
      router.replace('/dashboard');
    }
  };

  // Utility function to create authenticated fetch requests
  const createAuthenticatedFetch = (token: string) => {
    return (url: string, options: RequestInit = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });
    };
  };

  // Store token and set up global fetch interceptor
  const storeAuthData = (loginData: LoginResponse) => {
    // Store in localStorage
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('userEmail', loginData.email);
    localStorage.setItem('roles', JSON.stringify(loginData.roles));
    
    // Store employee data if available
    if (loginData.employeeId) {
      localStorage.setItem('employeeId', loginData.employeeId);
      localStorage.setItem('employeeProfile', JSON.stringify(loginData));
    }
    
    // Set token state
    (window as unknown as { authenticatedFetch?: (url: string, options?: RequestInit) => Promise<Response> }).authenticatedFetch = createAuthenticatedFetch(loginData.token);
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };
  
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const apiUrl = loginAsEmployee
        ?  APIURL + '/api/employees/login'
        : APIURL + `/api/auth/login`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON response (like HTML error pages)
        if (response.status === 401) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else if (response.status === 404) {
          toast.error('Login service not found. Please contact support.');
        } else if (response.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error('Login failed. Please check your credentials and try again.');
        }
        return;
      }

      const data: LoginResponse = await response.json();

      if (response.ok) {
        // Store authentication data and set up authenticated requests
        storeAuthData(data);
        
        // Show success message
        // toast.success('Login successful!');
        
        // If employee login and has employee data, redirect to employee page
        if (loginAsEmployee && data.employeeId) {
          console.log('Logged in employeeId:', data.employeeId);
          router.replace('/employee');
          return;
        }
        
        // Redirect based on role
        redirectBasedOnRole(data.roles);
      } else {
        // Handle API error responses
        const errorMessage = data.message || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
        
        // Clear any existing tokens on failed login
        clearAuthData();
      }
    } catch (e: Error | unknown) {
      // Handle network errors and other exceptions
      if (e instanceof TypeError && (e as Error).message.includes('fetch')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else if (e instanceof SyntaxError) {
        toast.error('Invalid response from server. Please try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      
      // Clear any existing tokens on error
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('roles');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeProfile');
    delete (window as unknown as { authenticatedFetch?: (url: string, options?: RequestInit) => Promise<Response> }).authenticatedFetch;
  };

  // On mount, check if token exists in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      (window as unknown as { authenticatedFetch?: (url: string, options?: RequestInit) => Promise<Response> }).authenticatedFetch = createAuthenticatedFetch(storedToken);
    }
  }, []);
  
  return (
    // 1. Main container: min-h-screen ensures it takes full height, flex centers content
    <div className="min-h-screen flex relative">
      <img 
        src="/Background login.png" 
        alt="Full Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 2. Content Container: Ensure content is centered both vertically and horizontally */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-0"> 
        
        {/* Left Side: Welcome Text (Hidden on small screens) */}
        <div className="hidden lg:flex flex-col justify-center w-full lg:w-1/2 text-white p-16 space-y-4"> 
            <h1 className="text-5xl font-extrabold leading-tight"> 
                Welcome <br /> Back
            </h1>
            <p className="text-lg font-light max-w-lg text-white/90"> 
            Beyond simple data storage, our system delivers intelligent insight, automating workflows and elevating every decision your team makes.
            </p>
            <div className="flex space-x-4 pt-2"> 
                <a href="#" className="text-white hover:text-blue-400 transition"><User className="w-5 h-5"/></a>
                <a href="#" className="text-white hover:text-blue-400 transition"><Lock className="w-5 h-5"/></a>
                <a href="#" className="text-white hover:text-blue-400 transition"><Shield className="w-5 h-5"/></a>
            </div>
        </div>

        {/* Right Side: Login Form (Card) - Now centered globally */}
        <div className="flex items-center justify-center w-full lg:w-1/2">
          {/* Form Card: max-w-sm for mobile, max-w-md for larger screens, centered by its parent */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 border border-white/20">
            
            <Toaster
              position="top-center" // Adjusted position for better mobile visibility
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#f9fafb',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
                error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
              }}
            />

            {/* Title Section */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-1">Sign In</h2> 
              <p className="text-white/80 text-sm">Use your email and password</p>
            </div>
  
            {/* Form Fields */}
            <div className="space-y-4">
                
                {/* Email Field Section */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white border ${
                          validationErrors.email 
                            ? 'border-red-500' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                        } rounded-lg focus:ring-2 transition-all duration-200 text-gray-900 placeholder-gray-500`}
                        placeholder="Enter the Email" 
                        required
                      />
                    </div>
                  {validationErrors.email && (
                    <p className="text-sm text-red-400 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {validationErrors.email}
                    </p>
                  )}
                </div>
  
                {/* Password Field Section */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-white">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-3 bg-white border ${
                          validationErrors.password 
                            ? 'border-red-500' 
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                        } rounded-lg focus:ring-2 transition-all duration-200 text-gray-900 placeholder-gray-500`}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-400 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {validationErrors.password}
                    </p>
                  )}
                </div>
                
                {/* Forgot Password and Employee Login Checkbox Container */}
                <div className="flex justify-between items-center pt-1.5">
                    <Link 
                        href="/forgot-password" 
                        className="text-sm text-white/80 hover:text-white font-medium hover:underline transition-colors duration-200"
                    >
                        Forgot Password?
                    </Link>
                    <div className="flex items-center space-x-2">
                        <input
                            id="loginAsEmployee"
                            type="checkbox"
                            checked={loginAsEmployee}
                            onChange={() => setLoginAsEmployee(v => !v)}
                            className="h-4 w-4 text-blue-400 bg-white/10 border-white/50 rounded focus:ring-blue-400 focus:ring-2 cursor-pointer"
                        />
                        <label htmlFor="loginAsEmployee" className="text-sm font-medium text-white/80 cursor-pointer">
                            Login as Employee
                        </label>
                    </div>
                </div>
              </div>
  
              {/* Sign In Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium text-base shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <span>Sign In now</span>
                )}
              </button>

            {/* Create Account and Terms/Privacy Section */}
            <div className="mt-6 text-center">
                
                {/* Don't have an account? Create Account */}
                <div className="flex justify-center text-sm font-medium mb-4">
                    <p className="text-white/70">
                    </p>
                    <Link 
                        href="/register" 
                        className="text-white hover:text-orange-300 font-bold hover:underline transition-colors duration-200 ml-1"
                    >
                    </Link>
                </div>
                
                {/* Terms and Privacy Policy */}
                <div className="text-xs text-white/50">
                    By clicking on 'Sign in now' you agree to<br/>
                    <Link href="/terms" className="hover:underline text-white/80">Terms of Service</Link> | 
                    <Link href="/privacy" className="hover:underline text-white/80">Privacy Policy</Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}