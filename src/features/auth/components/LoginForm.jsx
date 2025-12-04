// src/features/auth/components/LoginForm.jsx
import React from 'react';
import styles from './LoginForm.module.css';

export default function LoginForm({ 
  username, 
  password, 
  onUsernameChange, 
  onPasswordChange, 
  onSubmit, 
  isLoading 
}) {
  return (
    <form onSubmit={onSubmit} className={styles.loginForm}>
      <h2>Project Maintenance System</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="username">Username</label>
        <input 
          id="username"
          type="text" 
          placeholder="Enter username" 
          value={username} 
          onChange={onUsernameChange} 
          required 
          disabled={isLoading}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          placeholder="Enter password" 
          value={password} 
          onChange={onPasswordChange} 
          required 
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging In...' : 'Log In'}
      </button>
    </form>
  );
}