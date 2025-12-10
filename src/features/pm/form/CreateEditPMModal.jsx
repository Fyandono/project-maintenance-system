import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import styles from "./CreateEditPMModal.module.css";
import {fetchUnitsThunk} from "../../project/unitSlice";
import RequiredLabel from "../../../core/components/RequiredLabel";

const getInitialFormData = (initialProjectId) => ({
	project_id: initialProjectId,
	pm_description: "",
	pm_solution: "",
	pic_name: "",
	pic_email: "",
	pic_unit_id: null,
	pm_project_date: "",
	pm_type: "",
	// 'id' is intentionally omitted here as it's only present in edit mode
});

export default function CreateEditPMModal ({visible, onClose, onSubmit, projectName, initialProjectId, initialData=null}) {
	// Determine if we are in Edit mode
	const isEditMode = !!initialData;
	const modalTitle = isEditMode ? "Edit Project Monitoring" : "Create Project Monitoring";
	const submitButtonText = isEditMode ? "Save Changes" : "Create";

	// Function to calculate the initial state based on props
	const calculateInitialFormState = (data) => {
		console.log(data);
		if (data && data.id) {
			// Mapping initial data for editing
			return {
				project_id: initialProjectId,
				id: data.id,
				pm_description: data.pm_description || "",
				pm_solution: data.pm_solution || "",
				pic_name: data.pic_name || "",
				pic_email: data.pic_email || "",
				pic_unit_id: data.pic_unit_id ? data.pic_unit_id : null,
				pm_project_date: data.pm_project_date || "",
				pm_type: data.pm_type || "",
			};
		}
		// Initial state for creation
		return getInitialFormData(initialProjectId);
	};

	const [formData, setFormData] = useState(() => calculateInitialFormState(initialData));
	const [pmFile, setPmFile] = useState(null);
	const pmType = ["Data", "Change Request", "Incident", "Bugs Fixing", "New Project"];

	const dispatch = useDispatch();
	const units = useSelector((state) => state.units.units);
	const isLoadingUnits = useSelector((state) => state.units.isLoading);
	const unitError = useSelector((state) => state.units.error);
	const unitSearch = useSelector((state) => state.units.filterName);

	// Fetch units when the modal becomes visible
	useEffect(() => {
		if (visible) {
			// Note: unitSearch is used as a filter, assuming it's managed via Redux
			dispatch(fetchUnitsThunk({filterName: unitSearch}));
		}
	}, [dispatch, visible, unitSearch]);

	const resetForm = () => {
		setFormData(getInitialFormData(initialProjectId));
		setPmFile(null);
	};

	// Re-calculate and set form data whenever initialData changes (for opening/closing/switching)
	useEffect(() => {
		if (visible) {
			if (initialData) {
				setFormData({
					id: initialData.id || "",
					project_id: initialProjectId || "",
					pm_description: initialData.pm_description || "",
					pm_solution: initialData.pm_solution || "",
					pic_name: initialData.pic_name || "",
					pic_email: initialData.pic_email || "",
					pic_unit_id: initialData.pic_unit_id || null,
					pm_type: initialData.pm_type || "",
					pm_project_date: initialData.pm_project_date || "",
				});
			}
			else {
				setFormData(getInitialFormData(initialProjectId));
			}
		}
		setFormData(calculateInitialFormState(initialData));
		setPmFile(null);
	}, [initialProjectId, initialData, visible]);

	const handleChange = (e) => {
		const {name, value, files} = e.target;
		let newValue = value;

		if (name === "pic_unit_id") {
			newValue = value ? parseInt(value, 10) : null;
		}
		if (name === "pm_file" && files.length > 0) {
			setPmFile(files[0]);
			return;
		}
		setFormData((prev) => ({...prev, [name]: newValue}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const dataToSubmit = new FormData();

		// 1. Add PM ID if editing
		if (isEditMode && formData.id) {
			dataToSubmit.append("id", formData.id);
		}
		// 2. Add Project ID (required for both create and update)
		if (initialProjectId) {
			dataToSubmit.append("project_id", initialProjectId);
		}
		// 3. Append all other form fields
		Object.keys(formData).forEach((key) => {
			const value = formData[key];
			// Exclude project_id (already handled) and id (already handled)
			if (key !== "project_id" && key !== "id" && value !== null && value !== undefined && value !== "") {
				dataToSubmit.append(key, value);
			}
		});

		// 4. Append the new file (only if one was selected)
		if (pmFile) {
			dataToSubmit.append("file", pmFile);
		}
		// Pass the FormData object to the parent handler
		onSubmit(dataToSubmit);
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	if (!visible) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h3>{modalTitle}</h3>

				<form onSubmit={handleSubmit} className={styles.formGrid}>
					{/* READ-ONLY / REQUIRED Fields */}
					<RequiredLabel>Project</RequiredLabel>
					<input type="text" name="projectName" value={projectName} readOnly disabled />

					<RequiredLabel>Task</RequiredLabel>
					<textarea name="pm_description" value={formData.pm_description} onChange={handleChange} required />

					<RequiredLabel>Solution</RequiredLabel>
					<textarea name="pm_solution" value={formData.pm_solution} onChange={handleChange} required />

					<RequiredLabel>PM Type</RequiredLabel>
					<select name="pm_type" value={formData.pm_type} onChange={handleChange} required>
						<option value="" disabled>
							Select PM Type
						</option>
						{pmType.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>

					{/* File Upload: Required for create, optional for edit (only needed if changing) */}
					<RequiredLabel>File Upload</RequiredLabel>
					<div>
						<input type="file" name="pm_file" onChange={handleChange} required />
						{/* Display existing file info if editing and no new file selected */}
						{isEditMode && !pmFile && initialData?.file_name && <p style={{fontSize: "0.8rem", color: "#666"}}>Current file: {initialData.file_name}</p>}
					</div>

					<RequiredLabel>Project Date</RequiredLabel>
					<input type="date" name="pm_project_date" value={formData.pm_project_date} onChange={handleChange} required />

					{/* Optional PIC Fields */}
					<label>PIC Name</label>
					<input type="text" name="pic_name" value={formData.pic_name} onChange={handleChange} />

					<label>PIC Email</label>
					<input type="email" name="pic_email" value={formData.pic_email} onChange={handleChange} pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$" />

					<label>PIC Unit</label>
					<select name="pic_unit_id" value={formData.pic_unit_id || ""} onChange={handleChange} disabled={isLoadingUnits}>
						<option value="">{isLoadingUnits ? "Loading units..." : unitError ? `Error: ${unitError}` : "Select PIC Unit (Optional)"}</option>
						{units.map((unit) => (
							<option key={unit.id} value={unit.id}>
								{unit.name}
							</option>
						))}
					</select>

					<div className={styles.modalButtons}>
						<button type="button" onClick={handleCancel}>
							Cancel
						</button>
						<button type="submit">{submitButtonText}</button>
					</div>
				</form>
			</div>
		</div>
	);
}
