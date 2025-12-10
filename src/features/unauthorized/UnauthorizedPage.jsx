// src/core/components/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>403</h1>
      <h2 style={{ marginBottom: '20px' }}>Access Denied</h2>
      <p style={{ marginBottom: '30px', maxWidth: '500px' }}>
        You don't have permission to access this page. Please contact your administrator 
        if you believe this is an error.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
}