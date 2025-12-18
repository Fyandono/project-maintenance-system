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
	
	// Get user permissions (use can_get_* or can_view_* based on your backend)
	const canViewVendor = user?.can_get_vendor === true;
	const canViewUser = user?.can_get_user === true;
	const canViewUnit = user?.can_get_unit === true;
	const canViewRole = user?.can_get_role === true;
	const canViewReport = user?.can_get_pm === true;

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

	// Define all possible nav links with their required permissions
	const allNavLinks = [
		{name: "Vendors", path: "/vendor", requiredPermission: canViewVendor},
		{name: "Master Unit", path: "/unit", requiredPermission: canViewUnit},
		{name: "Master User", path: "/user", requiredPermission: canViewUser},
		{name: "Master Role", path: "/role", requiredPermission: canViewRole},
		{name: "Report", path: "/report", requiredPermission: canViewReport},
	];

	// Filter nav links based on user permissions
	const navLinks = allNavLinks.filter(link => link.requiredPermission);

	// If user has no permissions, show nothing or a message
	const hasNoPermissions = navLinks.length === 0;

	return (
		<nav className={styles.noPrint}>
			<nav className={styles.navbarRightContainer}>
				<div className={styles.navbarLeft}>
					<span className={styles.logo}>Project Monitoring System</span>

					{hasNoPermissions ? (
						<div className={styles.noPermissionMessage}>
							No navigation permissions
						</div>
					) : (
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
					)}
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