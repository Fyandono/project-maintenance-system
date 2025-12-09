import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setFilter, fetchProjectsThunk, createProjectThunk, editProjectThunk} from "../projectSlice";
import ProjectTable from "../components/ProjectTable";
import useDebounce from "../../../core/hooks/useDebounce";
import styles from "./ProjectPage.module.css";
import {useParams} from "react-router-dom";
import VendorDetail from "../components/VendorDetail";
import CircularLoader from "../../../core/components/CircularLoader";
import CreateEditProjectModal from "../form/CreateEditProjectModal";
import StatusBanner from "../../../core/components/StatusBanner";
import Pagination from "../../../core/components/Pagination";

export default function ProjectPage () {
	let params = useParams();
	const vendorId = params.vendorId;

	const dispatch = useDispatch();

	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canAddProject = user?.can_add_project === true;

	const {extraData, projects, totalPage, currentPage, pageSize, filterName: globalFilterName, isLoading, error, filterVendorId: globalVendorId} = useSelector((state) => state.projects);

	// ⭐️ NEW STATE for Submission Status Banner
	const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'failure'
	const [submissionMessage, setSubmissionMessage] = useState(null);

	const [localSearchTerm, setLocalSearchTerm] = useState(globalFilterName);
	const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState(null);

	// EFFECT 1: Watch debounced search term and update Redux
	useEffect(() => {
		if (debouncedSearchTerm !== globalFilterName) {
			dispatch(setFilter({name: "filterName", value: debouncedSearchTerm}));
		}
	}, [debouncedSearchTerm, globalFilterName, dispatch]);

	// EFFECT 2: Check if URL vendorId matches Redux vendorId
	useEffect(() => {
		if (vendorId && vendorId !== globalVendorId) {
			dispatch(setFilter({name: "filterVendorId", value: vendorId}));
		}
	}, [vendorId, globalVendorId, dispatch]);

	// FILTERS: Create filters object
	const filters = useMemo(
		() => ({
			currentPage,
			pageSize,
			filterName: globalFilterName,
			vendorId: globalVendorId,
		}),
		[currentPage, pageSize, globalFilterName, globalVendorId],
	);

	// EFFECT 3: Fetch projects whenever filters change
	useEffect(() => {
		if (filters.vendorId) {
			dispatch(fetchProjectsThunk(filters));
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

	// ⭐️ UPDATED: handles submission and controls modal/banner state
	const handleProjectSubmit = (data) => {
		// Clear previous banner message
		handleCloseBanner();

		const thunk = data.id ? editProjectThunk(data) : createProjectThunk(data);
		const action = data.id ? "updated" : "created";

		dispatch(thunk)
			.unwrap()
			.then(() => {
				// SUCCESS LOGIC: Close modal, show success banner, re-fetch list
				setIsModalVisible(false);
				setSubmissionStatus("success");
				setSubmissionMessage(`Project successfully ${action}.`);
				dispatch(fetchProjectsThunk(filters));
			})
			.catch ((error) => {
				// FAILURE LOGIC: DO NOT close modal, show failure banner
				// Error object might be payload or the error message string
				const message = error.message || error.toString() || "An unknown error occurred.";
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to ${action} project: ${message}`);

				// Keep modal open on failure
				// setIsModalVisible(true); // already true

				console.error("Project submission failed:", error);
			});
	};

	const handleOnClickCreate = () => {
		setEditData(null);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	// Optional: handle edit (pass project object)
	const handleOnClickEdit = (project) => {
		setEditData(project);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	return (
		<div className={styles.projectContainer}>
			<div className={styles.breadcrumb}>
				<a href="/vendor">Vendor</a>
				<span className={styles.separator}>/</span>
				<span>Project</span>
			</div>
			<h2>Projects for Vendor</h2>

			<StatusBanner message={submissionMessage} type={submissionStatus} onClose={handleCloseBanner} />

			<div className={styles.controlRow}>
				<input key="project-search-input" type="text" placeholder="Search projects" value={localSearchTerm} onChange={handleSearchChange} />

				{canAddProject && (
					<button type="button" className={styles.createButton} onClick={handleOnClickCreate} disabled={isLoading}>
						+ Create Project
					</button>
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
					<VendorDetail data={extraData} />
				</div>

				<div className={styles.right}>
					<ProjectTable handleEdit={handleOnClickEdit} vendorId={vendorId} data={projects} currentPage={currentPage} pageSize={pageSize} />
					<Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
				</div>
			</div>
			{/* Modal */}
			{!isLoading && extraData && <CreateEditProjectModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSubmit={handleProjectSubmit} vendorName={extraData.name} initialVendorId={extraData.id} initialData={editData} />}
		</div>
	);
}
