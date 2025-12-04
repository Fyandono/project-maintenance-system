import React, {useState, useEffect} from "react"; // ⭐️ Import useState and useEffect
import {useLocation} from "react-router-dom";
import styles from "./Navbar.module.css";
import {decodeToken} from "../utils/jwt";

const Navbar = () => {
	const location = useLocation();
	const currentPath = location.pathname;

	// ⭐️ NEW STATE: To store the username
	const [username, setUsername] = useState("");

	// ⭐️ EFFECT: Read username from local storage once on mount
	useEffect(() => {
		// Assume the username is stored under the key 'user' or 'username'
		const token = localStorage.getItem("accessToken");
		const claim = decodeToken(token);
		const storedUsername = claim.name;
		if (storedUsername) {
			setUsername(storedUsername);
		}
	}, []);

	// Helper function to check if a path is active (remains the same)
	const isPathActive = (path) => {
		if (path === "/") {
			return currentPath === path;
		}
		return currentPath.startsWith(path);
	};

	const navLinks = [
		{name: "Vendors", path: "/vendor"},
		{name: "Master User", path: "/user"},
		{name: "Master Unit", path: "/unit"},
	];

	return (
		<nav className={styles.noPrint}>
			{/* // ⭐️ Use styles.navbarRightContainer to enable space-between */}
			<nav className={styles.navbarRightContainer}>
				<div className={styles.navbarLeft}>
					{/* ⭐️ Use styles.logo */}
					<span className={styles.logo}>Project System</span>

					{/* Navigation links */}
					<div className={styles.navLinks}>
						{navLinks.map((link) => {
							const isActive = isPathActive(link.path);
							const linkClasses = `${styles.navLink} ${isActive ? styles.activeLink : ""}`;

							return (
								<a key={link.path} href={link.path} className={linkClasses}>
									{link.name}
								</a>
							);
						})}
					</div>
				</div>

				{/* ⭐️ NEW: Right-hand side for Username */}
				<div className={styles.navbarRight}>
					{username && <span className={styles.usernameDisplay}>{username}</span>}
					{/* You can add a user icon or logout button here */}
				</div>
			</nav>
		</nav>
	);
};

export default Navbar;
