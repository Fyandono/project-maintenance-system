// App.js
import {Routes, Route, useLocation} from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import VendorPage from "./features/vendor/pages/VendorPage";
import ProjectPage from "./features/project/pages/ProjectPage";
import PermissionProtectedRoute from "./core/components/PermissionProtectedRoute";
import PMPage from "./features/pm/pages/PMPage";
import Navbar from "./core/components/Navbar";
import UserPage from "./features/user/pages/UserPage";
import PMDetailPage from "./features/pm/pages/PMDetailPage";
import UnitPage from "./features/unit/pages/UnitPage";
import RolePage from "./features/role/pages/RolePage";
import ChangePasswordPage from "./features/auth/pages/ChangePasswordPage";
import UnauthorizedPage from "./features/unauthorized/UnauthorizedPage";
import ReportPage from "./features/report/pages/ReportPage";

export default function App () {
	const location = useLocation();
	const isLoginPage = location.pathname === "/" || location.pathname === "/login";

	return (
		<div>
			{!isLoginPage && <Navbar />}
			<div className={isLoginPage ? "Auth-Layout" : "App-Layout"}>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<LoginPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/unauthorized" element={<UnauthorizedPage />} />

					{/* Protected routes with permission checking */}
					<Route
						path="/vendor"
						element={
							<PermissionProtectedRoute>
								<VendorPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/vendor/:vendorId"
						element={
							<PermissionProtectedRoute>
								<ProjectPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/vendor/:vendorId/project/:projectId"
						element={
							<PermissionProtectedRoute>
								<PMPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/vendor/:vendorId/project/:projectId/pm/:pmId"
						element={
							<PermissionProtectedRoute>
								<PMDetailPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/user"
						element={
							<PermissionProtectedRoute>
								<UserPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/unit"
						element={
							<PermissionProtectedRoute>
								<UnitPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/role"
						element={
							<PermissionProtectedRoute>
								<RolePage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/report"
						element={
							<PermissionProtectedRoute>
								<ReportPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route
						path="/change-password"
						element={
							<PermissionProtectedRoute>
								<ChangePasswordPage />
							</PermissionProtectedRoute>
						}
					/>

					<Route path="*" element={<h1>404 Not Found</h1>} />
				</Routes>
			</div>
		</div>
	);
}
