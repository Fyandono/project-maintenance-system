import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createUnitThunk, editUnitThunk, fetchUnitsThunk, setFilter} from "../unitSlice";
import styles from "./UnitPage.module.css";
import useDebounce from "../../../core/hooks/useDebounce";
import CircularLoader from "../../../core/components/CircularLoader";
import UnitTable from "../components/UnitTable";
import CreateEditUnitModal from "../form/CreateEditUnitModal";
import StatusBanner from "../../../core/components/StatusBanner";
import Pagination from "../../../core/components/Pagination";

export default function UnitPage () {
	const dispatch = useDispatch();
	// Select global Redux state (the *actual* filter and data)
	const {
		units,
		totalPage,
		currentPage,
		pageSize,
		filterName: globalFilterName, // Renamed to avoid local state conflict
		isLoading,
		error,
	} = useSelector((state) => state.unit);

	const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'failure'
	const [submissionMessage, setSubmissionMessage] = useState(null);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState(null);

	// 1. LOCAL STATE: Controls the input field value immediately on typing.
	const [localSearchTerm, setLocalSearchTerm] = useState(globalFilterName);

	// 2. DEBOUNCE HOOK: Delays updating the API filter until unit pauses typing for 300ms.
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

	// Effect to fetch units whenever the actual Redux filters change (page, pageSize, or stable filterName)
	useEffect(() => {
		dispatch(fetchUnitsThunk(filters));
	}, [filters, dispatch]);

	// Handlers
	const handleSearchChange = (e) => setLocalSearchTerm(e.target.value);
	const handlePageChange = (page) => dispatch(setFilter({name: "currentPage", value: page}));

	// ⭐️ UPDATED: handles submission and controls modal/banner state
	const handleUnitSubmit = (data) => {
		console.log(data);
		// Clear previous banner message
		handleCloseBanner();

		const thunk = editData ? editUnitThunk(data) : createUnitThunk(data);
		const action = editData ? "updated" : "created";

		dispatch(thunk)
			.unwrap()
			.then(() => {
				// SUCCESS LOGIC: Close modal, show success banner, re-fetch list
				setIsModalVisible(false);
				setSubmissionStatus("success");
				setSubmissionMessage(`Unit successfully ${action}.`);
				dispatch(fetchUnitsThunk(filters));
			})
			.catch ((error) => {
				// FAILURE LOGIC: DO NOT close modal, show failure banner
				// Error object might be payload or the error message string
				const message = error.message || error.toString() || "An unknown error occurred.";
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to ${action} unit: ${message}`);

				// Keep modal open on failure
				// setIsModalVisible(true); // already true

				console.error("Unit submission failed:", error);
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
	const handleOnClickEdit = (unit) => {
		setEditData(unit);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	return (
		<div className={styles.unitContainer}>
			<h1>Units</h1>

			<StatusBanner message={submissionMessage} type={submissionStatus} onClose={handleCloseBanner} />

			<div className={styles.controlRow}>
				<input key="unit-search-input" type="text" placeholder="Search unit" value={localSearchTerm} onChange={handleSearchChange} />

				<button type="button" className={styles.createButton} onClick={handleOnClickCreate} disabled={isLoading}>
					+ Create Unit
				</button>
			</div>

			{isLoading && (
				<div className={styles.loaderRight}>
					<CircularLoader />
				</div>
			)}
			{error && <p style={{color: "red", fontWeight: "bold"}}>Error loading data: {error}</p>}
			<div>
				<UnitTable handleEdit={handleOnClickEdit} data={units} currentPage={currentPage} pageSize={pageSize} />
				<Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
				<div />

				{/* Modal */}
				{!isLoading && <CreateEditUnitModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSubmit={handleUnitSubmit} initialData={editData} />}
			</div>
		</div>
	);
}
