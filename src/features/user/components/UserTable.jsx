import React from "react";
import styles from "./UserTable.module.css";
import {formatDate} from "../../../core/utils/formatDate";
import {useSelector} from "react-redux";

export default React.memo(function UserTable ({handleEdit, data, currentPage, pageSize}) {
	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canEditUser = user?.can_edit_user === true;

	if (!data || data.length === 0) {
		return <p>No user data available based on current filters.</p>;
	}
	const headers = ["No", "Name", "Username", "Role", "Created Info", "Updated Info", "Status", "Action"];

	// Calculate the index offset based on the current page and size
	const startIndex = (currentPage - 1) * pageSize;

	return (
		<div className={styles.tableWrapper}>
			<table className={styles.userTable}>
				<thead>
					<tr>
						{headers.map((header) => (
							<th key={header}>{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((user, index) => (
						<tr key={user.id}>
							{/* ⭐️ CONTINUOUS ROW NUMBER CALCULATION: startIndex + index + 1 */}
							<td className={styles.rowNumberCell}>{startIndex + index + 1}</td>
							<td className={styles.nameCell}>{user.name || "-"}</td>
							<td>{user.username || "-"}</td>
							<td>{user.role || "-"}</td>

							<td>
								<div className={styles.metaInfo}>
									<span className={styles.metaDate}>{formatDate(user.created_at)}</span>
									<span className={styles.metaUser}>{user.created_by || "-"}</span>
								</div>
							</td>

							<td>
								<div className={styles.metaInfo}>
									<span className={styles.metaDate}>{formatDate(user.updated_at)}</span>
									<span className={styles.metaUser}>{user.updated_by || "-"}</span>
								</div>
							</td>

							<td className={styles.statusCell}>
								{user.is_active === true ? (
									<div className={styles.active}>
										<span className={styles.icon}>✅</span> Active
									</div>
								) : (
									<div className={styles.deactivated}>
										<span className={styles.icon}>❌</span> Deactivated
									</div>
								)}
							</td>

							{/* Action Button */}
							{canEditUser && (
								<td className={styles.actionCell}>
									<div className={styles.actionRow}>
										<button className={styles.detailButton} onClick={() => handleEdit(user)}>
											Edit
										</button>
									</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
});
