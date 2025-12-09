import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {loginUserThunk} from "../authSlice";
import LoginForm from "../components/LoginForm";
import styles from "./LoginPage.module.css";
import {unwrapResult} from "@reduxjs/toolkit";

export default function LoginPage () {
	// Local state for controlled form inputs
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Select global state from the Redux store (State Listeners)
	const {isLoading, error, token} = useSelector((state) => state.auth);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(loginUserThunk({username, password}));
		}
		catch (err) {
			console.error("Login failed in handleSubmit:", err);
		}
	};

	useEffect(() => {
		if (token) {
			navigate("/vendor");
		}
	}, [token, navigate]);

	return (
		// Uses the component-level CSS Module for styling the page container
		<div className={styles.loginPageContainer}>
			{/* Display error message if present in Redux state */}
			{error && <div className={styles.errorMessage}>{error}</div>}
			{/* LoginForm is the pure UI component, passed only props */}
			<LoginForm username={username} password={password} onUsernameChange={(e) => setUsername(e.target.value)} onPasswordChange={(e) => setPassword(e.target.value)} onSubmit={handleSubmit} isLoading={isLoading} />
		</div>
	);
}
