import React, {useState, useEffect} from "react";
import styles from "./CreateEditRoleModal.module.css";
import RequiredLabel from "../../../core/components/RequiredLabel";

// Define all default permission fields
const getInitialFormData = () => ({
	id: null,
	name: "",
	is_active: true,
	// --- Permission Fields ---
	can_add_role: false,
	can_edit_role: false,
	can_add_user: false,
	can_edit_user: false,
	can_add_vendor: false,
	can_edit_vendor: false,
	can_add_project: false,
	can_edit_project: false,
	can_add_pm: false,
	can_edit_pm: false,
	can_verify_pm: false,
	// ⭐️ NEW FIELDS ADDED HERE
	can_add_unit: false,
	can_edit_unit: false,
});

export default function CreateEditRoleModal ({visible, onClose, onSubmit, initialData=null}) {
	const isEditMode = !!initialData;
	const [formData, setFormData] = useState(() => getInitialFormData());
	const [validationError, setValidationError] = useState(null);

	const resetForm = () => {
		setFormData(getInitialFormData());
		setValidationError(null);
	};

	useEffect(() => {
		if (visible) {
			if (initialData) {
				// Map all initial data properties to the form state
				setFormData({
					...getInitialFormData(), // Start with defaults to ensure all fields are present
					...initialData,         // Override with initial data
					is_active: initialData.is_active !== undefined ? initialData.is_active : true, 
				});
			}
			else {
				setFormData(getInitialFormData());
			}
		}
	}, [initialData, visible]);

	const handleChange = (e) => {
		const {name, type, checked, value} = e.target;
		const newValue = type === "checkbox" ? checked : value;
		
		setFormData((prev) => ({...prev, [name]: newValue}));
		setValidationError(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setValidationError(null);

		if (!formData.name.trim()) {
			setValidationError("Role Name is required.");
			return;
		}

		const payloadToSubmit = {
			id: formData.id,
			name: formData.name,
			is_active: formData.is_active,
			can_add_role: formData.can_add_role,
			can_edit_role: formData.can_edit_role,
			can_add_user: formData.can_add_user,
			can_edit_user: formData.can_edit_user,
			can_add_vendor: formData.can_add_vendor,
			can_edit_vendor: formData.can_edit_vendor,
			can_add_project: formData.can_add_project,
			can_edit_project: formData.can_edit_project,
			can_add_pm: formData.can_add_pm,
			can_edit_pm: formData.can_edit_pm,
			can_verify_pm: formData.can_verify_pm,
			// ⭐️ NEW FIELDS ADDED TO PAYLOAD
			can_add_unit: formData.can_add_unit,
			can_edit_unit: formData.can_edit_unit,
		};

		onSubmit(payloadToSubmit);
		resetForm(); 
		onClose();
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	if (!visible) return null;

	// Helper component for permission checkbox pairs
	const PermissionPair = ({ title, addName, editName }) => (
		<div className={styles.permissionBox}>
			<p className={styles.permissionTitle}>{title} Permissions</p>
			<div className={styles.permissionRow}>
				<label htmlFor={addName} className={styles.permissionLabel}>Can Add</label>
				<input 
					type="checkbox" 
					name={addName} 
					checked={formData[addName]} 
					onChange={handleChange} 
					className={styles.checkbox} 
					id={addName} 
				/>
			</div>
			<div className={styles.permissionRow}>
				<label htmlFor={editName} className={styles.permissionLabel}>Can Edit</label>
				<input 
					type="checkbox" 
					name={editName} 
					checked={formData[editName]} 
					onChange={handleChange} 
					className={styles.checkbox} 
					id={editName} 
				/>
			</div>
		</div>
	);

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h3 className={styles.modalHeader}>{isEditMode ? "Edit Role" : "Create Role"}</h3>
				{validationError && <div className={styles.validationError}>{validationError}</div>}
				
				<form onSubmit={handleSubmit} className={styles.formContainer}>
					
					{/* --- Basic Fields (Name & Status) --- */}
					<div className={styles.basicFieldGrid}>
						<RequiredLabel isRequired={true}>Role Name</RequiredLabel>
						<input 
							type="text" 
							name="name" 
							value={formData.name} 
							onChange={handleChange} 
							className={styles.textInput} 
							placeholder="e.g., Project Manager"
						/>

						<RequiredLabel isRequired={true}>Active Status</RequiredLabel>
						<div className={styles.checkboxContainer}>
							<input 
								type="checkbox" 
								name="is_active" 
								checked={formData.is_active} 
								onChange={handleChange} 
								className={styles.checkbox} 
								id="is_active_toggle" 
							/>
							<label htmlFor="is_active_toggle" className={styles.checkboxLabel}>
								{formData.is_active ? "Role is Active" : "Role is Disabled"}
							</label>
						</div>
					</div>

					<hr className={styles.sectionDivider} />

					{/* --- Permission Grid --- */}
					<p className={styles.permissionsHeader}>Permissions</p>
					<div className={styles.permissionsGrid}>
						<PermissionPair title="Roles" addName="can_add_role" editName="can_edit_role" />
						<PermissionPair title="Users" addName="can_add_user" editName="can_edit_user" />
						{/* ⭐️ NEW PERMISSION PAIR ADDED HERE */}
						<PermissionPair title="Units" addName="can_add_unit" editName="can_edit_unit" />
						<PermissionPair title="Vendors" addName="can_add_vendor" editName="can_edit_vendor" />
						<PermissionPair title="Projects" addName="can_add_project" editName="can_edit_project" />
						<PermissionPair title="PMs" addName="can_add_pm" editName="can_edit_pm" />
						
						{/* Single PM Verification Permission */}
						<div className={styles.permissionBox}>
							<p className={styles.permissionTitle}>PM Verification</p>
							<div className={styles.permissionRow}>
								<label htmlFor="can_verify_pm" className={styles.permissionLabel}>Can Verify PM</label>
								<input 
									type="checkbox" 
									name="can_verify_pm" 
									checked={formData.can_verify_pm} 
									onChange={handleChange} 
									className={styles.checkbox} 
									id="can_verify_pm" 
								/>
							</div>
						</div>
					</div>

					{/* --- Buttons --- */}
					<div className={styles.modalButtons}>
						<button type="button" onClick={handleCancel} className={styles.cancelButton}>
							Cancel
						</button>
						<button type="submit" className={styles.submitButton}>
							{isEditMode ? "Save Changes" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}