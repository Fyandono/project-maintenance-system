import styles from "./PMTable.module.css";
import {apiController} from "../../../core/api/apiController";
import {formatDate} from "../../../core/utils/formatDate";
import {useNavigate, useParams} from "react-router-dom";
import {FaDownload} from "react-icons/fa";
import {useSelector} from "react-redux";

// ⭐️ The component now accepts currentPage and pageSize as props
export default function PMTable ({handleEdit, handleVerifyClick, data, currentPage, pageSize}) {
	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canEditPM = user?.can_edit_pm === true;
	const canVerifyPM = user?.can_verify_pm === true;

	// Headers
	const headers = ["No", "Task", "Solution", "Type", "PIC Name", "PIC Email", "PIC Unit", "Project Date", "Completion Date", "Created Info", "Updated Info", "Verified Info", "Status", "Action"];

	// Calculate the index offset based on the current page and size
	const startIndex = (currentPage - 1) * pageSize;

	// Handler for navigation
	const handleDownload = async (project_pm_id, url_file) => {
		// 1. Determine Filename/Extension from Local Data (pm.url_file)
		let filename = `file_${project_pm_id}`; // Default fallback

		// Safely extract the filename from the path
		if (url_file) {
			// Find the last '/' to isolate the filename part (e.g., "C:/data/docs/report.pdf" -> "report.pdf")
			const parts = url_file.split("/");
			const pathFilename = parts[parts.length - 1];

			// If we found a filename with an extension, use it
			if (pathFilename) {
				filename = pathFilename;
			}
		}
		// 2. Fetch the Binary File Data
		let response;
		try {
			response = await apiController({
				method: "get",
				endpoint: "/x/files/" + project_pm_id,
				customConfig: {
					responseType: "blob",
				},
			});
		}
		catch (error) {
			console.error("File download failed during fetch:", error);
			// Add robust error handling (e.g., reading error message from Blob)
			return;
		}
		// 3. Extract the Blob
		const blob = response.data;

		// 4. Trigger Download using the locally derived filename

		// Create a temporary URL for the Blob
		const url = window.URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		// ⭐ Use the filename derived from the pm.url_file property
		link.download = filename;

		// Trigger the click
		document.body.appendChild(link);
		link.click();

		// 5. Cleanup
		link.parentNode.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	const navigate = useNavigate();
	const params = useParams();
	const handleDetail = (pmId) => {
		navigate(`/vendor/${params.vendorId}/project/${params.projectId}/pm/${pmId}`);
	};

	return (
		<div className={styles.tableWrapper}>
			<div className={styles.scrollit}>
				<table className={styles.pmTable}>
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
							data.map((pm, index) => (
								<tr key={pm.id}>
									{/* ⭐️ CONTINUOUS ROW NUMBER CALCULATION: startIndex + index + 1 */}
									<td className={styles.rowNumberCell}>{startIndex + index + 1}</td>
									<td>{pm.pm_description || "-"}</td>
									<td>{pm.pm_solution || "-"}</td>
									<td>{pm.pm_type || "-"}</td>
									<td>{pm.pic_name || "-"}</td>
									<td>{pm.pic_email || "-"}</td>
									<td>{pm.pic_unit || "-"}</td>

									<td>{formatDate(pm.pm_project_date)}</td>
									<td>{formatDate(pm.pm_completion_date)}</td>

									{/* Combined Created Info Cell */}
									<td>
										<div className={styles.metaInfo}>
											<span className={styles.metaDate}>{formatDate(pm.created_at)}</span>
											<span className={styles.metaUser}>{pm.created_by || "-"}</span>
										</div>
									</td>

									{/* Combined Updated Info Cell */}
									<td>
										<div className={styles.metaInfo}>
											<span className={styles.metaDate}>{formatDate(pm.updated_at)}</span>
											<span className={styles.metaUser}>{pm.updated_by || "-"}</span>
										</div>
									</td>

									{/* Combined Verified Info Cell */}
									<td>
										{/* The original meta info for the current verification status */}
										<div className={styles.metaInfoVerify}>
											<span className={styles.metaDate}>{formatDate(pm.verified_at)}</span>
											<span className={styles.metaUser}>{pm.verified_by || "-"}</span>
										</div>

										{/* --- Notes History Implementation with Parsing --- */}
										{(() => {
											let notesHistory = [];

											// 1. Check if pm.note exists and is a string
											if (pm.note && typeof pm.note === "string") {
												try {
													// 2. Attempt to parse the JSON string into an array
													const parsedData = JSON.parse(pm.note);

													// 3. Ensure the result is actually an array before assigning
													if (Array.isArray(parsedData)) {
														notesHistory = parsedData;
													}
												}
												catch (error) {
													console.error("Failed to parse notes history JSON:", error);
													// If parsing fails, notesHistory remains an empty array, which is safe.
												}
											}
											else if (Array.isArray(pm.note)) {
												// Safety net: if it's already an array (e.g., from a successful update response)
												notesHistory = pm.note;
											}
											if (notesHistory.length === 0) {
												return null;
											}
											// 4. Render the notes history if the array is not empty
											return (
												<div className={styles.notesHistoryContainer}>
													<p className={styles.notesHeader}>Notes:</p>
													{notesHistory.map((noteEntry, index) => (
														<div key={index} className={styles.noteEntry}>
															<p className={styles.noteText}>{noteEntry.note || "No details provided."}</p>
															<span className={styles.noteMeta}>
																{noteEntry.user || "System"} on {formatDate(noteEntry.timestamp)}
															</span>
														</div>
													))}
												</div>
											);
										})()}
									</td>
									<td className={styles.statusCell}>
										{pm.is_verified === true ? (
											<div className={styles.verified}>
												<span className={styles.icon}>✅</span> Verified
											</div>
										) : pm.is_verified === false ? (
											<div className={styles.rejected}>
												<span className={styles.icon}>❌</span> Need Revision
											</div>
										) : (
											<div className={styles.unverified}>
												<span className={styles.icon}>🕐</span> On Progress
											</div>
										)}
									</td>

									<td className={styles.actionCell}>
										<div className={styles.actionRow}>
											<button className={styles.detailButton} onClick={() => handleDetail(pm.id)}>
												Detail
											</button>

											<button className={styles.detailButton} onClick={() => handleDownload(pm.id, pm.url_file)}>
												<FaDownload size={10} className={styles.buttonIcon} />
												File
											</button>

											{canEditPM && !pm.is_verified && (
												<button className={styles.detailButton} onClick={() => handleEdit(pm)}>
													Edit
												</button>
											)}
											{canVerifyPM && !pm.is_verified && // Check if project_date exists and is <= today
												pm.pm_project_date && new Date(pm.pm_project_date) <= new Date() && (
													<button className={styles.detailButton} onClick={() => handleVerifyClick(pm)}>
														Verify
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
