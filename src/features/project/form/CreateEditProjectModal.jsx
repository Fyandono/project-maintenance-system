import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import styles from "./CreateEditProjectModal.module.css";
import {fetchUnitsThunk} from "../unitSlice";
import RequiredLabel from "../../../core/components/RequiredLabel";

const getInitialFormData = (initialVendorId) => ({
	vendor_id: initialVendorId,
	name: "",
	description: "",
	pic_name: "",
	pic_email: "",
	pic_unit_id: null,
	project_type: "",
});

export default function CreateEditProjectModal ({visible, onClose, onSubmit, vendorName, initialVendorId, initialData=null}) {
	const [formData, setFormData] = useState(() => getInitialFormData(initialVendorId));
	const projectTypes = ["Application", "Hardware"];

	const dispatch = useDispatch();
	const units = useSelector((state) => state.units.units);
	const isLoadingUnits = useSelector((state) => state.units.isLoading);
	const unitError = useSelector((state) => state.units.error);
	const unitSearch = useSelector((state) => state.units.filterName);

	useEffect(() => {
		if (visible) {
			dispatch(fetchUnitsThunk({filterName: unitSearch}));
		}
	}, [dispatch, visible, unitSearch]);

	const resetForm = () => {
		setFormData(getInitialFormData(initialVendorId));
	};

	useEffect(() => {
		if (visible) {
			if (initialData) {
				setFormData({
					id: initialData.id,
					vendor_id: initialVendorId,
					name: initialData.name || "",
					description: initialData.description || "",
					pic_name: initialData.pic_name || "",
					pic_email: initialData.pic_email || "",
					pic_unit_id: initialData.pic_unit_id || null,
					project_type: initialData.project_type || "",
				});
			}
			else {
				setFormData(getInitialFormData(initialVendorId));
			}
		}
	}, [initialData, initialVendorId, visible]);

	const handleChange = (e) => {
		const {name, value, type} = e.target;
		let newValue = value;

		if (name === "pic_unit_id") {
			newValue = value ? parseInt(value, 10) : null;
		}
		setFormData((prev) => ({...prev, [name]: newValue}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const success = true;

		if (success) {
			onSubmit(formData);
			resetForm();
			onClose();
		}
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	if (!visible) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h3>{initialData ? "Edit Project" : "Create Project"}</h3>
				<form onSubmit={handleSubmit} className={styles.formGrid}>
					{/* Required Fields */}
					<RequiredLabel>Vendor</RequiredLabel>
					<input type="text" name="vendorName" value={vendorName} readOnly disabled />

					<RequiredLabel>Name</RequiredLabel>
					<input type="text" name="name" value={formData.name} onChange={handleChange} required />

					<RequiredLabel>Project Type</RequiredLabel>
					<select name="project_type" value={formData.project_type} onChange={handleChange} required>
						<option value="" disabled>
							Select Project Type
						</option>

						{projectTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>

					<RequiredLabel>Description</RequiredLabel>
					<textarea name="description" value={formData.description} onChange={handleChange} required />

					{/* Optional PIC Fields */}
					<label>PIC Name</label>
					<input type="text" name="pic_name" value={formData.pic_name} onChange={handleChange} />

					<label>PIC Email</label>
					<input type="email" name="pic_email" value={formData.pic_email} pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$" onChange={handleChange} />

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
						<button type="submit">{initialData ? "Save Changes" : "Create"}</button>
					</div>
				</form>
			</div>
		</div>
	);
}
