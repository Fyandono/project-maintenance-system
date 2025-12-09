// src/features/vendors/components/VendorTable.jsx
import React from "react";
import styles from "./VendorTable.module.css";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const formatDate = (dateString) => {
	return dateString ? new Date(dateString).toLocaleDateString() : "-";
};

// ⭐️ The component now accepts currentPage and pageSize as props
export default React.memo(function VendorTable ({handleEdit, data, currentPage, pageSize}) {
	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canEditVendor = user?.can_edit_vendor === true;

	const navigate = useNavigate();
	if (!data || data.length === 0) {
		return <p>No vendor data available based on current filters.</p>;
	}

	const headers = ["No", "Name", "Address", "Email", "Phone Number", "Count Project", "Created Info", "Updated Info", "Action"];
	// Calculate the index offset based on the current page and size
	const startIndex = (currentPage - 1) * pageSize;

	// Handler for navigation
	const handleDetailClick = useCallback(
		(vendorId) => {
			// Construct the route using the vendor's ID
			navigate(`/vendor/${vendorId}`);
		},
		[navigate],
	);

	return (
		<div className={styles.scrollit}>
			<div className={styles.tableWrapper}>
				<table className={styles.vendorTable}>
					<thead>
						<tr>
							{headers.map((header) => (
								<th key={header}>{header}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((vendor, index) => (
							<tr key={vendor.id}>
								{/* ⭐️ CONTINUOUS ROW NUMBER CALCULATION: startIndex + index + 1 */}
								<td className={styles.rowNumberCell}>{startIndex + index + 1}</td>
								<td className={styles.nameCell}>{vendor.name || "-"}</td>
								<td>{vendor.address || "-"}</td>
								<td>{vendor.email || "-"}</td>
								<td>{vendor.phone_number || "-"}</td>
								<td>{vendor.count_project || "0"}</td>

								{/* Combined Created Info Cell */}
								<td>
									<div className={styles.metaInfo}>
										<span className={styles.metaDate}>{formatDate(vendor.created_at)}</span>
										<span className={styles.metaUser}>{vendor.created_by || "-"}</span>
									</div>
								</td>

								{/* Combined Updated Info Cell */}
								<td>
									<div className={styles.metaInfo}>
										<span className={styles.metaDate}>{formatDate(vendor.updated_at)}</span>
										<span className={styles.metaUser}>{vendor.updated_by || "-"}</span>
									</div>
								</td>

								{/* Action Button */}
								<td className={styles.actionCell}>
									<div className={styles.actionRow}>
										<button className={styles.detailButton} onClick={() => handleDetailClick(vendor.id)}>
											Detail
										</button>
										{canEditVendor && (
											<button className={styles.detailButton} onClick={() => handleEdit(vendor)}>
												Edit
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
});
