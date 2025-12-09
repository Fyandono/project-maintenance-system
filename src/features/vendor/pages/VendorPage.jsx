import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setFilter, fetchVendorsThunk, createVendorThunk, editVendorThunk} from "../vendorSlice";
import VendorTable from "../components/VendorTable";
import useDebounce from "../../../core/hooks/useDebounce";
import styles from "./VendorPage.module.css";
import CreateEditVendorModal from "../form/CreateEditVendorModal";
import CircularLoader from "../../../core/components/CircularLoader";
import Pagination from "../../../core/components/Pagination";
import StatusBanner from "../../../core/components/StatusBanner";

export default function VendorPage () {
	const dispatch = useDispatch();

	// Get User Role
	const user = useSelector((state) => state.auth.user);
	const canAddVendor = user?.can_add_vendor === true;

	// Select global Redux state (the *actual* filter and data)
	const {
		vendors,
		totalPage,
		currentPage,
		pageSize,
		filterName: globalFilterName, // Renamed to avoid local state conflict
		isLoading,
		error,
	} = useSelector((state) => state.vendors);

	const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'failure'
	const [submissionMessage, setSubmissionMessage] = useState(null);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState(null);

	// 1. LOCAL STATE: Controls the input field value immediately on typing.
	const [localSearchTerm, setLocalSearchTerm] = useState(globalFilterName);

	// 2. DEBOUNCE HOOK: Delays updating the API filter until user pauses typing for 300ms.
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

	// Effect to fetch vendors whenever the actual Redux filters change (page, pageSize, or stable filterName)
	useEffect(() => {
		dispatch(fetchVendorsThunk(filters));
	}, [filters, dispatch]);

	// Handlers
	const handleSearchChange = (e) => setLocalSearchTerm(e.target.value);
	const handlePageChange = (page) => dispatch(setFilter({name: "currentPage", value: page}));

	// ⭐️ UPDATED: handles submission and controls modal/banner state
	const handleVendorSubmit = (data) => {
		// Clear previous banner message
		handleCloseBanner();

		const thunk = data.id ? editVendorThunk(data) : createVendorThunk(data);
		const action = data.id ? "updated" : "created";

		dispatch(thunk)
			.unwrap()
			.then(() => {
				// SUCCESS LOGIC: Close modal, show success banner, re-fetch list
				setIsModalVisible(false);
				setSubmissionStatus("success");
				setSubmissionMessage(`Vendor successfully ${action}.`);
				dispatch(fetchVendorsThunk(filters));
			})
			.catch ((error) => {
				const message = error.message || error.toString() || "An unknown error occurred.";
				setSubmissionStatus("failure");
				setSubmissionMessage(`Failed to ${action} vendor: ${message}`);
				console.error("Vendor submission failed:", error);
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
	const handleOnClickEdit = (vendor) => {
		setEditData(vendor);
		setIsModalVisible(true);
		handleCloseBanner();
	};

	return (
		<div className={styles.vendorContainer}>
			<h1>Vendors</h1>

			<StatusBanner message={submissionMessage} type={submissionStatus} onClose={handleCloseBanner} />

			<div className={styles.controlRow}>
				<input key="vendor-search-input" type="text" placeholder="Search vendors" value={localSearchTerm} onChange={handleSearchChange} />

				{canAddVendor && (
					<button type="button" className={styles.createButton} onClick={handleOnClickCreate} disabled={isLoading}>
						+ Create Vendor
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
				<VendorTable handleEdit={handleOnClickEdit} data={vendors} currentPage={currentPage} pageSize={pageSize} />
				<Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange} />
				<div />

				{/* Modal */}
				{!isLoading && <CreateEditVendorModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSubmit={handleVendorSubmit} initialData={editData} />}
			</div>
		</div>
	);
}
