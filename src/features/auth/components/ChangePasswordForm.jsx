import styles from './ChangePasswordForm.module.css';
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordForm({ 
  newPassword, 
  currentPassword, 
  onNewPasswordChange, 
  onCurrentPasswordChange, 
  onSubmit, 
  isLoading,
  isSuccess
}) {
  const navigate = useNavigate();

  const handleRelogin = () => {
    navigate('/login');
  };

  // If success, show success message and relogin button
  if (isSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Password Changed Successfully!</h2>
        <p className={styles.successMessage}>
          Your password has been updated. For security reasons, please log in again with your new password.
        </p>
        <button 
          onClick={handleRelogin} 
          className={styles.reloginButton}
        >
          Re-Login
        </button>
      </div>
    );
  }

  // Original form for when not successful
  return (
    <form onSubmit={onSubmit} className={styles.changePasswordForm}>
      <h2>Change Password</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="password">Current Password</label>
        <input 
          id="password"
          type="password" 
          placeholder="Enter current password" 
          value={currentPassword} 
          onChange={onCurrentPasswordChange} 
          required 
          disabled={isLoading}
        />
      </div>

     <div className={styles.formGroup}>
        <label htmlFor="newPassword">New Password</label>
        <input 
          id="newPassword"
          type="password" 
          placeholder="Enter new password" 
          value={newPassword} 
          onChange={onNewPasswordChange} 
          required 
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Changing Password...' : 'Change Password'}
      </button>
    </form>
  );
}