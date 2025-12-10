// src/features/project/components/ProjectTable.jsx
import React from "react";
import styles from "./ProjectTable.module.css";
import {useNavigate} from "react-router-dom";
import {formatDate} from "../../../core/utils/formatDate";
import { useSelector } from "react-redux";

// ⭐️ The component now accepts currentPage and pageSize as props
export default function ProjectTable ({handleEdit, vendorId, data, currentPage, pageSize}) {
	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canViewPM = user?.can_get_pm === true;
	const canEditProject = user?.can_edit_project === true;

	const headers = ["No", "Name", "Project Type", "PIC Name", "PIC Email", "PIC Unit", "PM Uploaded", "PM Unverified", "PM Verified", "Created Info", "Updated Info", "Action"];

	// Calculate the index offset based on the current page and size
	const startIndex = (currentPage - 1) * pageSize;

	// Handler for navigation
	let navigate = useNavigate();
	const handleDetailClick = (projectId) => {
		navigate(`/vendor/${vendorId}/project/${projectId}`);
	};

	return (
		<div className={styles.scrollit}>
			<div className={styles.tableWrapper}>
				<table className={styles.projectTable}>
					<thead>
						<tr>
							{headers.map((header) => (
								<th key={header}>{header}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{!data || data.length === 0 ? (
							<tr>
								<td colSpan={headers.length} className={styles.noDataRow} style={{textAlign: "center"}}>
									No Data Available
								</td>
							</tr>
						) : (
							data.map((project, index) => (
								<tr key={project.id}>
									{/* Row Number */}
									<td className={styles.rowNumberCell}>{startIndex + index + 1}</td>

									{/* Basic Info */}
									<td className={styles.nameCell}>{project.name || "-"}</td>
									<td>{project.project_type || "-"}</td>
									<td>{project.pic_name || "-"}</td>
									<td>{project.pic_email || "-"}</td>
									<td>{project.pic_unit || "-"}</td>

									{/* PM Info */}
									<td>{project.count_pm_uploaded || "0"}</td>
									<td>{project.count_pm_unverified || "0"}</td>
									<td>{project.count_pm_verified || "0"}</td>

									{/* Created Info */}
									<td>
										<div className={styles.metaInfo}>
											<span className={styles.metaDate}>{formatDate(project.created_at)}</span>
											<span className={styles.metaUser}>{project.created_by || "-"}</span>
										</div>
									</td>

									{/* Updated Info */}
									<td>
										<div className={styles.metaInfo}>
											<span className={styles.metaDate}>{formatDate(project.updated_at)}</span>
											<span className={styles.metaUser}>{project.updated_by || "-"}</span>
										</div>
									</td>

									{/* Action Button */}
									<td className={styles.actionCell}>
										<div className={styles.actionRow}>
											{canViewPM && (
											<button className={styles.detailButton} onClick={() => handleDetailClick(project.id)}>
												Detail
											</button>)}
											{canEditProject && (
												<button className={styles.detailButton} onClick={() => handleEdit(project)}>
													Edit
												</button>
											)}
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
