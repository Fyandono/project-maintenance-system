import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUserThunk } from '../authSlice'; // The BLoC-like async action
import LoginForm from '../components/LoginForm'; // The presentational component
import styles from './LoginPage.module.css'; // Component-scoped styles
import { unwrapResult } from '@reduxjs/toolkit';

export default function LoginPage() {
  // Local state for controlled form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select global state from the Redux store (State Listeners)
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {   
            // 1. Dispatch the Thunk action and wait for the Promise result
            let resultAction = await dispatch(loginUserThunk({ username, password }));
            
            // 2. Unwraps the result. If login fails, this throws an error and jumps to the catch block.
            unwrapResult(resultAction); 
            
            // 3. SUCCESS NAVIGATION: ONLY navigate if the Thunk promise fulfills (token is fresh and valid)
            navigate('/vendor'); 

        } catch (err) {
            // 4. FAILURE: The error state is already updated by the rejected Thunk reducer.
            console.error('Login failed in handleSubmit:', err);
            // No navigation needed here.
        }
  };

  return (
    // Uses the component-level CSS Module for styling the page container
    <div className={styles.loginPageContainer}>
      {/* Display error message if present in Redux state */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {/* LoginForm is the pure UI component, passed only props */}
      <LoginForm
        username={username}
        password={password}
        onUsernameChange={(e) => setUsername(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading} 
      />
    </div>
  );
}