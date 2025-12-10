import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {changePasswordThunk} from "../changePasswordSlice";
import ChangePasswordForm from "../components/ChangePasswordForm";
import styles from "./ChangePasswordPage.module.css";

export default function ChangePasswordPage () {
	// Local state for controlled form inputs
	const [newPassword, setNewPassword] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Select global state from the Redux store (State Listeners)
	const {isLoading, error, success} = useSelector((state) => state.changePassword);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(changePasswordThunk({newPassword, currentPassword}));
		}
		catch (err) {
			console.error("Change Password failed in handleSubmit:", err);
		}
	};

	return (
		// Uses the component-level CSS Module for styling the page container
		<div className={styles.changePasswordContainer}>
			{/* Display error message if present in Redux state */}
			{error && <div className={styles.errorMessage}>{error}</div>}
			<ChangePasswordForm isSuccess={success} newPassword={newPassword} currentPassword={currentPassword} onNewPasswordChange={(e) => setNewPassword(e.target.value)} onCurrentPasswordChange={(e) => setCurrentPassword(e.target.value)} onSubmit={handleSubmit} isLoading={isLoading} />
		</div>
	);
}
