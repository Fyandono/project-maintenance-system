import React, {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {FaUser, FaChevronDown, FaSignOutAlt, FaLock} from "react-icons/fa";

import styles from "./Navbar.module.css";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleChangePassword = () => {
		navigate("/change-password");     
	};

	const handleLogout = () => {
		dispatch(logout());        
		navigate("/login");     
	};

	const isPathActive = (path) => {
		if (path === "/") return location.pathname === path;
		return location.pathname.startsWith(path);
	};

	const navLinks = [
		{name: "Vendors", path: "/vendor"},
		{name: "Master User", path: "/user"},
		{name: "Master Unit", path: "/unit"},
		{name: "Master Role", path: "/role"},
	];

	return (
		<nav className={styles.noPrint}>
			<nav className={styles.navbarRightContainer}>
				<div className={styles.navbarLeft}>
					<span className={styles.logo}>Project Monitoring System</span>

					<div className={styles.navLinks}>
						{navLinks.map((link) => {
							const isActive = isPathActive(link.path);
							return (
								<a
									key={link.path}
									href={link.path}
									className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
								>
									{link.name}
								</a>
							);
						})}
					</div>
				</div>

				{/* Right Side Username */}
				<div className={styles.navbarRight} ref={dropdownRef}>
					{user && (
						<div className={styles.userMenu} onClick={toggleDropdown}>
							<FaUser className={styles.userIcon} />
							<span className={styles.usernameDisplay}>{user.name}</span>
							<FaChevronDown className={styles.chevronIcon} />

							{isDropdownOpen && (
								<div className={styles.dropdownMenu}>
									<button className={styles.dropdownItem} onClick={handleChangePassword}>
										<FaLock className={styles.dropdownIcon} />
										Change Password
									</button>
									<button className={styles.dropdownItem} onClick={handleLogout}>
										<FaSignOutAlt className={styles.dropdownIcon} />
										Logout
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</nav>
		</nav>
	);
};

export default Navbar;
