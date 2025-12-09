import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {formatDate} from "../../../core/utils/formatDate";
import {fetchPMDetailThunk} from "../pmDetailSlice";
import CircularLoader from "../../../core/components/CircularLoader";
import styles from "./PMDetailPage.module.css";
import {FaDownload, FaPrint} from "react-icons/fa";
import {apiController} from "../../../core/api/apiController";
import CreateEditPMModal from "../form/CreateEditPMModal";
import VerifyPMModal from "../form/VerifyPMModal";
import {editPMThunk, verifyPMthunk} from "../pmSlice";
import StatusBanner from "../../../core/components/StatusBanner";

const PMDetailPage = () => {
	let params = useParams();
	const pmId = params.pmId;
	const projectId = params.projectId;
	const vendorId = params.vendorId;

	const dispatch = useDispatch();

	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canEditPM = user?.can_edit_pm === true;
	const canVerifyPM = user?.can_verify_pm === true;

	// ⭐️ SELECTOR: Get data, loading, and error states from the new slice
	const {data, project_data, isLoading, error} = useSelector((state) => state.pmDetail);

	const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'failure'
	const [submissionMessage, setSubmissionMessage] = useState(null);

	// ⭐️ NEW: Modal state
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalVerifyVisible, setIsModalVerifyVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [verifyData, setVerifyData] = useState(null);

	// ⭐️ EFFECT: Fetch data when the component mounts or pmId changes
	useEffect(() => {
		if (pmId) {
			dispatch(fetchPMDetailThunk(pmId));
		}
	}, [pmId, dispatch]);

	// --- Loading, Error, and Not Found States ---
	if (isLoading || !data) {
		if (isLoading && !data) {
			return (
				<div className={styles.centered}>
					<CircularLoader />
				</div>
			);
		}
		if (!isLoading && !data) {
			return <p className={styles.centered}>No detail available for PM ID: {pmId}</p>;
		}
	}
	if (error) {
		return (
			<p className={styles.centered} style={{color: "red"}}>
				Error loading data: {error}
			</p>
		);
	}
	// --- Data is available (data is not null) ---

	// Define status verification variables for cleaner JSX below
	const isVerified = data.is_verified === true;
	const isRejected = data.is_verified === false;
	const isWaiting = data.is_verified === null || data.is_verified === undefined;

	// We reference 'data' directly now
	const pm = data;
	const project = project_data;

	// Handler to dismiss the banner
	const handleCloseBanner = () => {
		setSubmissionMessage(null);
		setSubmissionStatus(null);
	};

	// ⭐️ HANDLER: Edit/Create Submission (FIXED: Added success/failure banner logic)
	const handlePMSubmit = (data) => {
		setIsModalVisible(false);
		setEditData(null);
		handleCloseBanner(); // Clear any previous banner

		dispatch(editPMThunk(data))
			.unwrap()
			.then(() => {
				setSubmissionStatus("success");
				setSubmissionMessage(`Project Monitoring item ID ${data.id} successfully updated.`);
				dispatch(fetchPMDetailThunk(pmId));
			})
			.catch ((err) => {
				console.error("Edit PM failed:", err);
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to update PM: ${err.message || "An unknown error occurred"}`);
				dispatch(fetchPMDetailThunk(pmId)); // Re-fetch to ensure data is fresh
			});
	};

	// ⭐️ HANDLER: Verification Submission (FIXED: Added success/failure banner logic and determined 'action')
	const handleVerify = (data) => {
		setIsModalVerifyVisible(false);
		setVerifyData(null);
		handleCloseBanner(); // Clear any previous banner

		const action = data.is_verified ? "verified" : "rejected"; // Determine action for message

		dispatch(verifyPMthunk(data))
			.unwrap()
			.then(() => {
				setSubmissionStatus("success");
				setSubmissionMessage(`Project Monitoring item successfully ${action}.`);
				dispatch(fetchPMDetailThunk(pmId));
			})
			.catch ((err) => {
				console.error("Verification failed:", err);
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to ${action} PM: ${err.message || "An unknown error occurred"}`);
				dispatch(fetchPMDetailThunk(pmId)); // Re-fetch to ensure data is fresh
			});
	};

	// ⭐️ HANDLER: Download logic (kept as is)
	const handleDownload = async (project_pm_id, url_file) => {
		let filename = `file_${project_pm_id}`;
		if (url_file) {
			const parts = url_file.split("/");
			const pathFilename = parts[parts.length - 1];
			if (pathFilename) {
				filename = pathFilename;
			}
		}
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
			return;
		}
		const blob = response.data;
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	// ⭐️ HANDLER: Print logic (kept as is)
	const handlePrint = () => {
		window.print();
	};

	// ⭐️ HANDLER: Edit button click
	const handleEdit = () => {
		handleCloseBanner();
		setEditData(pm); // Set current PM data into the edit state
		setIsModalVisible(true);
	};

	// ⭐️ HANDLER: Verify button click
	const handleVerifyClick = () => {
		handleCloseBanner();
		setVerifyData(pm); // Set current PM data into the verify state
		setIsModalVerifyVisible(true);
	};

	return (
		<div className={styles.container}>
			<div className={`${styles.breadcrumb} ${styles.noPrint}`}>
				<a href="/vendor">Vendor</a>
				<span className={styles.separator}>/</span>
				<a href={`/vendor/${vendorId}/project/${projectId}}`}>Project</a>
				<span className={styles.separator}>/</span>
				<a href={`/vendor/${vendorId}/project/${projectId}`}>Project Monitoring</a>
				<span className={styles.separator}>/</span>
				<span>Detail</span>
			</div>
			{submissionMessage && <StatusBanner message={submissionMessage} type={submissionStatus} onClose={handleCloseBanner} />}
			<div className={styles.contentWrapper}>
				<div className={styles.titleWrapper}>
					<h2 className={styles.title}>Project Monitoring Detail (ID: {pmId})</h2>
				</div>

				{/* ⭐️ FIXED: StatusBanner is now rendered here conditionally */}
				<div className={styles.content}>
					{/* Main Detail Rows */}
					<h3>Project</h3>

					<div className={styles.row}>
						<span className={styles.label}>Vendor</span>
						{/* Assuming project_data structure matches the keys */}
						<span className={`${styles.value} ${styles.fullWidth}`}>{project?.vendor_name}</span>
					</div>

					<div className={styles.row}>
						<span className={styles.label}>Project</span>
						<span className={`${styles.value} ${styles.fullWidth}`}>{project?.name}</span>
					</div>
					<h3>Maintenance</h3>

					<div className={styles.row}>
						<span className={styles.label}>Task</span>
						<span className={`${styles.value} ${styles.fullWidth}`}>{pm.pm_description}</span>
					</div>

					<div className={styles.row}>
						<span className={styles.label}>Solution</span>
						<span className={`${styles.value} ${styles.fullWidth}`}>{pm.pm_solution}</span>
					</div>

					<div className={styles.row}>
						<span className={styles.label}>Type</span>
						<span className={styles.value}>{pm.pm_type}</span>
					</div>

					<div className={styles.row}>
						<span className={styles.label}>Project Date</span>
						<span className={styles.value}>{formatDate(pm.pm_project_date)}</span>
					</div>

					<div className={styles.row}>
						<span className={styles.label}>Completion Date</span>
						<span className={styles.value}>{formatDate(pm.pm_completion_date)}</span>
					</div>

					{/* ⭐️ Status Row */}
					<div className={`${styles.row} ${styles.statusRow}`}>
						<span className={styles.label}>Status</span>
						<div className={styles.statusCell}>
							{isVerified && (
								<div className={styles.verified}>
									<span className={styles.icon}>✅</span> Verified
								</div>
							)}
							{isRejected && (
								<div className={styles.rejected}>
									<span className={styles.icon}>❌</span> Need Revise
								</div>
							)}
							{isWaiting && (
								<div className={styles.unverified}>
									<span className={styles.icon}>🕐</span> Waiting
								</div>
							)}
						</div>
					</div>

					{/* PIC Information */}
					<h3>PIC Information</h3>
					<div className={styles.row}>
						<span className={styles.label}>PIC Name</span>
						<span className={styles.value}>{pm.pic_name}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>PIC Email</span>
						<span className={styles.value}>{pm.pic_email}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>PIC Unit</span>
						<span className={styles.value}>{pm.pic_unit}</span>
					</div>

					{/* Audit Information */}
					<h3>Audit Trail</h3>
					<div className={styles.row}>
						<span className={styles.label}>Created By</span>
						<span className={styles.value}>{pm.created_by}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Created At</span>
						<span className={styles.value}>{formatDate(pm.created_at)}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Updated By</span>
						<span className={styles.value}>{pm.updated_by || "-"}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Updated At</span>
						<span className={styles.value}>{formatDate(pm.updated_at)}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Verified By</span>
						<span className={styles.value}>{pm.verified_by || "-"}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Verified At</span>
						<span className={styles.value}>{formatDate(pm.verified_at) || "N/A"}</span>
					</div>

					{/* ⭐️ Action Row with print-hide class */}
					<div className={`${styles.actionRow} ${styles.noPrint}`}>
						<button className={styles.detailButton} onClick={() => handleDownload(pm.id, pm.url_file)}>
							<FaDownload size={10} className={styles.buttonIcon} />
							File
						</button>

						<button className={styles.detailButton} onClick={() => handlePrint()}>
							<FaPrint size={10} className={styles.buttonIcon} />
							Print
						</button>

						{/* Only allow edit/verify if not already verified */}
						{!isVerified && canEditPM && (
							<button className={styles.detailButton} onClick={() => handleEdit()}>
								Edit
							</button>
						)}
						{!isVerified && canVerifyPM && (
							<button className={styles.detailButton} onClick={() => handleVerifyClick()}>
								Verify
							</button>
						)}
					</div>
				</div>

				{/* ⭐️ RENDER MODALS */}
				{/* Edit/Create Modal (uses project details for context) */}
				{canEditPM && !isLoading && pm && (
					<CreateEditPMModal
						visible={isModalVisible}
						onClose={() => {
							setIsModalVisible(false);
							setEditData(null);
						}}
						onSubmit={handlePMSubmit}
						projectName={project?.name || "Current Project"}
						// Assume pm object contains the necessary project_id if project_data is missing
						initialProjectId={project?.id || pm.project_id}
						initialData={editData}
					/>
				)}
				{/* Verify Modal */}
				{canVerifyPM && !isLoading && pm && (
					<VerifyPMModal
						visible={isModalVerifyVisible}
						onClose={() => {
							setIsModalVerifyVisible(false);
							setVerifyData(null);
						}}
						onSubmit={handleVerify}
						initialData={verifyData}
					/>
				)}
			</div>
		</div>
	);
};

export default PMDetailPage;
