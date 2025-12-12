import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setFilter, fetchPMSThunk, createPMthunk, verifyPMthunk, editPMThunk} from "../pmSlice";
import styles from "./PmPage.module.css";
import {useParams} from "react-router-dom";
import PMTable from "../components/PMTable";
import ProjectDetail from "../components/ProjectDetail";
import CircularLoader from "../../../core/components/CircularLoader";
import CreateEditPMModal from "../form/CreateEditPMModal";
import VerifyPMModal from "../form/VerifyPMModal";
import useDebounce from "../../../core/hooks/useDebounce";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import DateRangeFilter from "../../../core/components/DateRangePicker";
import StatusBanner from "../../../core/components/StatusBanner";
import Pagination from "../../../core/components/Pagination";

// Data for the new dropdown filter
const pmTypeOptions = ["Data", "Change Request", "Incident", "Bugs Fixing", "New Project"];
const pmStatusOptions = ["On Progress", "Need Revise", "Verified"];

export default function PMPage () {
	// ⭐️ 1. Read the projectId from the URL (e.g., /pms/123)
	let params = useParams();
	const projectId = params.projectId;
	const vendorId = params.vendorId;

	const dispatch = useDispatch();

	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canAddPM = user?.can_add_pm === true;

	// ⭐️ 2. SELECTOR CORRECTION: Select state from the 'pms' slice
	const {
		pms,
		extraData,

		totalPage,
		currentPage,
		pageSize,
		isLoading,
		error,
		filterDescription: globalFilterDescription,
		filterProjectId: globalProjectId,
		filterStartDate: globalFilterStartDate,
		filterEndDate: globalFilterEndDate,
		filterPMType: globalFilterPMType,
		filterPMStatus: globalFilterPMStatus,
	} = useSelector((state) => state.pms);

	const [localSearchTerm, setLocalSearchTerm] = useState(globalFilterDescription);
	const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

	// ⭐️ NEW STATE for Submission Status Banner
	const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'failure'
	const [submissionMessage, setSubmissionMessage] = useState(null);

	// Modal state
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalVerifyVisible, setIsModalVerifyVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [verifyData, setVerifyData] = useState(null);

	// EFFECT 1: Watch debounced search term and update Redux
	useEffect(() => {
		if (debouncedSearchTerm !== globalFilterDescription) {
			dispatch(setFilter({name: "filterDescription", value: debouncedSearchTerm}));
		}
	}, [debouncedSearchTerm, globalFilterDescription, dispatch]);

	useEffect(() => {
		if (projectId && projectId !== globalProjectId) {
			dispatch(setFilter({name: "filterProjectId", value: projectId}));
		}
	}, [projectId, globalProjectId, dispatch]);

	// ⭐️ 3. FILTERS: Create filters object, including the projectId and new type filter
	const filters = useMemo(
		() => ({
			currentPage,
			pageSize,
			projectId: globalProjectId,
			filterDescription: globalFilterDescription,
			filterStartDate: globalFilterStartDate,
			filterEndDate: globalFilterEndDate,
			filterPMType: globalFilterPMType,
			filterPMStatus: globalFilterPMStatus,
		}),
		[currentPage, pageSize, globalProjectId, globalFilterDescription, globalFilterStartDate, globalFilterEndDate, globalFilterPMType, globalFilterPMStatus],
	);

	// EFFECT 3: Fetch pms whenever filters (including the stable projectId) change
	useEffect(() => {
		if (filters.projectId) {
			dispatch(fetchPMSThunk(filters));
		}
	}, [filters, dispatch]);

	// Handler to dismiss the banner
	const handleCloseBanner = () => {
		setSubmissionMessage(null);
		setSubmissionStatus(null);
	};

	// Handlers
	const handleSearchChange = (e) => setLocalSearchTerm(e.target.value);
	const handlePageChange = (page) => dispatch(setFilter({name: "currentPage", value: page}));

	const handleTypeChange = (e) => {
		dispatch(setFilter({name: "filterPMType", value: e.target.value}));
	};

	const handleStatusChange = (e) => {
		dispatch(setFilter({name: "filterPMStatus", value: e.target.value}));
	};

	const handleDateRangeChange = (dates) => {
		console.log(dates);
		const [startDate, endDate] = dates;
		dispatch(setFilter({name: "filterStartDate", value: startDate || ""}));
		dispatch(setFilter({name: "filterEndDate", value: endDate || ""}));
	};

	// CREATE/EDIT Handler
	const handlePMSubmit = (data) => {
		setIsModalVisible(false);
		setEditData(null);

		const thunk = editData ? editPMThunk(data) : createPMthunk(data);
		const action = editData ? "updated" : "created";
		handleCloseBanner();

		dispatch(thunk)
			.unwrap()
			.then(() => {
				setSubmissionStatus("success");
				setSubmissionMessage(`PM item successfully ${action}.`);
				dispatch(fetchPMSThunk(filters));
			})
			.catch ((error) => {
				const message = error.message || error.toString() || "An unknown error occurred.";
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to ${action} PM item: ${message}`);
				console.error("PM submission failed:", error);
			});
	};

	// VERIFY/REJECT Handler (Using user's provided function name)
	const handleVerify = (data) => {
		handleCloseBanner();
		const action = data.is_verified ? "verified" : "informed as need revise";

		dispatch(verifyPMthunk(data))
			.unwrap()
			.then(() => {
				setIsModalVerifyVisible(false);
				setVerifyData(null);
				setSubmissionStatus("success");
				setSubmissionMessage(`PM item ID ${data.id} successfully ${action}.`);
				dispatch(fetchPMSThunk(filters));
			})
			.catch ((error) => {
				const message = error.message || error.toString() || "An unknown error occurred.";
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to ${action} PM item ID ${data.id}: ${message}`);
				console.error("PM verification failed:", error);
			});
	};

	// UI Click Handlers
	const handleOnClickVerify = (pmItem) => {
		setVerifyData(pmItem);
		setIsModalVerifyVisible(true);
		handleCloseBanner();
	};

	const handleOnClickCreate = () => {
		setEditData(null);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	const handleEdit = (data) => {
		setEditData(data);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	// Determine which handler to pass to the modal
	const currentSubmitHandler = verifyData ? handleVerify : handlePMSubmit;

	return (
		<div className={styles.pmContainer}>
			<div className={styles.breadcrumb}>
				<a href="/vendor">Vendor</a>
				<span className={styles.separator}>/</span>
				<a href={`/vendor/${vendorId}`}>Project</a>
				<span className={styles.separator}>/</span>
				<span>Project Monitoring</span>
			</div>

			<StatusBanner message={submissionMessage} type={submissionStatus} onClose={handleCloseBanner} />

			<h2>Project Monitoring</h2>
			<div className={styles.controlRow}>
				<div className={styles.inputGroup}>
					<label for="project-search-input">Search</label>
					<input key="project-search-input" type="text" placeholder="Search item" value={localSearchTerm} onChange={handleSearchChange} />
				</div>

				<div className={styles.inputGroupNotSearch}>
					<label for="pm-type-filter">Type</label>
					<select key="pm-type-filter" className={styles.selectInput} value={globalFilterPMType || ""} onChange={handleTypeChange}>
						<option value="">All</option>
						{pmTypeOptions.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>

				<div className={styles.inputGroupNotSearch}>
					<label for="pm-status-filter">Status</label>
					<select key="pm-status-filter" className={styles.selectInput} value={globalFilterPMStatus || ""} onChange={handleStatusChange}>
						<option value="">All</option>
						{pmStatusOptions.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>


				<DateRangeFilter key="date-range-picker" onRangeChange={handleDateRangeChange} startDate={globalFilterStartDate} endDate={globalFilterEndDate} />

				{canAddPM && (
					<div className={styles.verticalDivider}>
						<button type="button" className={styles.createButton} onClick={handleOnClickCreate} disabled={isLoading}>
							+ Create PM
						</button>
					</div>
				)}
			</div>
			{isLoading && (
				<div className={styles.loaderRight}>
					<CircularLoader />
				</div>
			)}
			{error && <p style={{color: "red", fontWeight: "bold"}}>Error loading data: {error}</p>}
			<div className={styles.layout}>
				<div className={styles.left}>
					<ProjectDetail data={extraData} />
				</div>

				<div className={styles.right}>
					{/* Pass the verify click handler to the table */}
					<PMTable handleEdit={handleEdit} handleVerifyClick={handleOnClickVerify} data={pms} currentPage={currentPage} pageSize={pageSize} />
					<Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
				</div>
			</div>

			{/* Modal */}
			{!isLoading && extraData && (
				<CreateEditPMModal
					visible={isModalVisible}
					onClose={() => {
						setIsModalVisible(false);
						setEditData(null);
					}}
					onSubmit={currentSubmitHandler}
					projectName={extraData.name}
					initialProjectId={extraData.id}
					initialData={editData}
				/>
			)}
			{!isLoading && (
				<VerifyPMModal
					visible={isModalVerifyVisible}
					onClose={() => {
						setIsModalVerifyVisible(false);
						setVerifyData(null);
					}}
					onSubmit={currentSubmitHandler}
					initialData={verifyData}
				/>
			)}
		</div>
	);
}
