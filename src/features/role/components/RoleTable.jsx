import React from "react";
import styles from "./RoleTable.module.css";
import {formatDate} from "../../../core/utils/formatDate";
import {useSelector} from "react-redux";

// Helper function to count active permissions
const countActivePermissions = (role) => {
	let count = 0;
	const permissionKeys = ["can_add_role", "can_edit_role", "can_add_user", "can_edit_user", "can_add_vendor", "can_edit_vendor", "can_add_project", "can_edit_project", "can_add_pm", "can_edit_pm", "can_verify_pm", "can_add_unit", "can_edit_unit", "can_get_vendor", "can_get_role", "can_get_unit", "can_get_user", "can_get_project", "can_get_pm"];

	permissionKeys.forEach((key) => {
		if (role[key] === true) {
			count++;
		}
	});
	return count;
};

// ⭐️ The component now accepts currentPage and pageSize as props
export default React.memo(function RoleTable ({handleEdit, data, currentPage, pageSize}) {
	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canEditRole = user?.can_edit_role === true;

	if (!data || data.length === 0) {
		return <p>No role data available based on current filters.</p>;
	}
	// Updated headers to include the new Permissions column
	const headers = ["No", "Name", "Permissions", "Status", "Created Info", "Updated Info", "Action"];

	// Calculate the index offset based on the current page and size
	const startIndex = (currentPage - 1) * pageSize;

	return (
		<div className={styles.tableWrapper}>
			<table className={styles.roleTable}>
				<thead>
					<tr>
						{headers.map((header) => (
							<th key={header}>{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((role, index) => {
						// Calculate active permissions for display
						const activePermissionCount = countActivePermissions(role);

						return (
							<tr key={role.id}>
								{/* CONTINUOUS ROW NUMBER CALCULATION */}
								<td className={styles.rowNumberCell}>{startIndex + index + 1}</td>
								<td className={styles.nameCell}>{role.name || "-"}</td>

								{/* ⭐️ NEW PERMISSIONS COLUMN */}
								<td className={styles.permissionsCell}>{activePermissionCount > 0 ? <span className={styles.permissionBadge}>{activePermissionCount} Active Permissions</span> : <span className={styles.noPermissionBadge}>None</span>}</td>

								{/* Status */}
								<td className={styles.statusCell}>
									{role.is_active === true ? (
										<div className={styles.active}>
											<span className={styles.icon}>✅</span> Active
										</div>
									) : (
										<div className={styles.deactivated}>
											<span className={styles.icon}>❌</span> Deactivated
										</div>
									)}
								</td>
								{/* Created Info */}
								<td>
									<div className={styles.metaInfo}>
										<span className={styles.metaDate}>{formatDate(role.created_at)}</span>
										{/* NOTE: Updated styles.metaRole to styles.metaUser as per your CSS */}
										<span className={styles.metaUser}>{role.created_by || "-"}</span>
									</div>
								</td>

								{/* Updated Info */}
								<td>
									<div className={styles.metaInfo}>
										<span className={styles.metaDate}>{formatDate(role.updated_at)}</span>
										<span className={styles.metaUser}>{role.updated_by || "-"}</span>
									</div>
								</td>
								{/* Action Button */}
								{canEditRole && (
									<td className={styles.actionCell}>
										<div className={styles.actionRow}>
											<button className={styles.detailButton} onClick={() => handleEdit(role)}>
												Edit
											</button>
										</div>
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
});
