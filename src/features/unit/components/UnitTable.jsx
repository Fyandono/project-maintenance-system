import React from "react";
import styles from "./UnitTable.module.css";
import { formatDate } from "../../../core/utils/formatDate";

// ⭐️ The component now accepts currentPage and pageSize as props
export default React.memo(function UnitTable ({handleEdit, data, currentPage, pageSize}) {
	if (!data || data.length === 0) {
		return <p>No unit data available based on current filters.</p>;
	}
	const headers = ["No", "Name", "Created Info", "Updated Info", "Status", "Action"];

	// Calculate the index offset based on the current page and size
	const startIndex = (currentPage - 1) * pageSize;

	return (
		<div className={styles.tableWrapper}>
			<table className={styles.unitTable}>
				<thead>
					<tr>
						{headers.map((header) => (
							<th key={header}>{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((unit, index) => (
						<tr key={unit.id}>
							{/* ⭐️ CONTINUOUS ROW NUMBER CALCULATION: startIndex + index + 1 */}
							<td className={styles.rowNumberCell}>{startIndex + index + 1}</td>
							<td className={styles.nameCell}>{unit.name || "-"}</td>
							
							<td>
								<div className={styles.metaInfo}>
									<span className={styles.metaDate}>{formatDate(unit.created_at)}</span>
									<span className={styles.metaUnit}>{unit.created_by || "-"}</span>
								</div>
							</td>

							<td>
								<div className={styles.metaInfo}>
									<span className={styles.metaDate}>{formatDate(unit.updated_at)}</span>
									<span className={styles.metaUnit}>{unit.updated_by || "-"}</span>
								</div>
							</td>

							<td className={styles.statusCell}>
								{unit.is_active === true ? (
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
							<td className={styles.actionCell}>
								<div className={styles.actionRow}>
									<button className={styles.detailButton} onClick={() => handleEdit(unit)}>
										Edit
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
});
