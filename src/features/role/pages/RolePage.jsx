import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createRoleThunk, editRoleThunk, fetchRolesThunk, setFilter, fetchReportThunk} from "../roleSlice";
import styles from "./RolePage.module.css";
import useDebounce from "../../../core/hooks/useDebounce";
import CircularLoader from "../../../core/components/CircularLoader";
import RoleTable from "../components/RoleTable";
import CreateEditRoleModal from "../form/CreateEditRoleModal";
import StatusBanner from "../../../core/components/StatusBanner";
import Pagination from "../../../core/components/Pagination";
import { FaDownload } from "react-icons/fa";

export default function RolePage () {
	const dispatch = useDispatch();

	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canAddRole = user?.can_add_role === true;

	// Select global Redux state (the *actual* filter and data)
	const {
		roles,
		totalPage,
		currentPage,
		pageSize,
		filterName: globalFilterName, // Renamed to avoid local state conflict
		isLoading,
		error,
	} = useSelector((state) => state.role);

	const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'failure'
	const [submissionMessage, setSubmissionMessage] = useState(null);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState(null);

	// 1. LOCAL STATE: Controls the input field value immediately on typing.
	const [localSearchTerm, setLocalSearchTerm] = useState(globalFilterName);

	// 2. DEBOUNCE HOOK: Delays updating the API filter until role pauses typing for 300ms.
	const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

	// 3. EFFECT: Watch the debounced value and update the Redux store when it stabilizes.
	useEffect(() => {
		// Only dispatch if the debounced value is different from the current global filter.
		if (debouncedSearchTerm !== globalFilterName) {
			dispatch(setFilter({name: "filterName", value: debouncedSearchTerm}));
		}
	}, [debouncedSearchTerm, globalFilterName, dispatch]);

	// Filters object uses the current global filter (which is driven by the debounce effect)
	const filters = useMemo(() => ({currentPage, pageSize, filterName: globalFilterName}), [currentPage, pageSize, globalFilterName]);

	// Effect to fetch roles whenever the actual Redux filters change (page, pageSize, or stable filterName)
	useEffect(() => {
		dispatch(fetchRolesThunk(filters));
	}, [filters, dispatch]);

	// Handlers
	const handleSearchChange = (e) => setLocalSearchTerm(e.target.value);
	const handlePageChange = (page) => dispatch(setFilter({name: "currentPage", value: page}));

	// ⭐️ UPDATED: handles submission and controls modal/banner state
	const handleRoleSubmit = (data) => {
		console.log(data);
		// Clear previous banner message
		handleCloseBanner();

		const thunk = editData ? editRoleThunk(data) : createRoleThunk(data);
		const action = editData ? "updated" : "created";

		dispatch(thunk)
			.unwrap()
			.then(() => {
				// SUCCESS LOGIC: Close modal, show success banner, re-fetch list
				setIsModalVisible(false);
				setSubmissionStatus("success");
				setSubmissionMessage(`Role successfully ${action}.`);
				dispatch(fetchRolesThunk(filters));
			})
			.catch ((error) => {
				// FAILURE LOGIC: DO NOT close modal, show failure banner
				// Error object might be payload or the error message string
				const message = error.message || error.toString() || "An unknown error occurred.";
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to ${action} role: ${message}`);

				// Keep modal open on failure
				// setIsModalVisible(true); // already true

				console.error("Role submission failed:", error);
			});
	};

	const handleCloseBanner = () => {
		setSubmissionMessage(null);
		setSubmissionStatus(null);
	};

	const handleOnClickCreate = () => {
		setEditData(null);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	// Optional: handle edit (pass project object)
	const handleOnClickEdit = (role) => {
		setEditData(role);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	const handleDownload = () => {
			// Clear previous banner message
			handleCloseBanner();
	
			const thunk = fetchReportThunk(filters);
			const action = "download";
	
			dispatch(thunk)
				.unwrap()
				.then(() => {
					setIsModalVisible(false);
					setSubmissionStatus("success");
					setSubmissionMessage(`Role successfully ${action}.`);
				})
				.catch ((error) => {
					const message = error.message || error.toString() || "An unknown error occurred.";
					setSubmissionStatus("failure");
					setSubmissionMessage(`Failed to ${action} vendor: ${message}`);
					console.error("Role submission failed:", error);
				});
		};
	

	return (
		<div className={styles.roleContainer}>
			<h1>Roles</h1>

			<StatusBanner message={submissionMessage} type={submissionStatus} onClose={handleCloseBanner} />

			<div className={styles.controlRow}>
				<input key="role-search-input" type="text" placeholder="Search role" value={localSearchTerm} onChange={handleSearchChange} />

				<button className={styles.detailButton} onClick={() => handleDownload()}>
					<FaDownload size={10} className={styles.buttonIcon} />
					Report
				</button>

				{canAddRole && (
					<button type="button" className={styles.createButton} onClick={handleOnClickCreate} disabled={isLoading}>
						+ Create Role
					</button>
				)}
			</div>

			{isLoading && (
				<div className={styles.loaderRight}>
					<CircularLoader />
				</div>
			)}
			{error && <p style={{color: "red", fontWeight: "bold"}}>Error loading data: {error}</p>}
			<div>
				<RoleTable handleEdit={handleOnClickEdit} data={roles} currentPage={currentPage} pageSize={pageSize} />
				<Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
				<div />

				{/* Modal */}
				{!isLoading && <CreateEditRoleModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSubmit={handleRoleSubmit} initialData={editData} />}
			</div>
		</div>
	);
}
