import React, {useState, useEffect} from "react";
import styles from "./CreateEditRoleModal.module.css";
import RequiredLabel from "../../../core/components/RequiredLabel";

// Define all default permission fields
const getInitialFormData = () => ({
	id: null,
	name: "",
	is_active: true,
	// --- Permission Fields ---
	// Get permissions
	can_get_role: false,
	can_get_user: false,
	can_get_vendor: false,
	can_get_project: false,
	can_get_pm: false,
	can_get_unit: false,
	// Add permissions
	can_add_role: false,
	can_add_user: false,
	can_add_vendor: false,
	can_add_project: false,
	can_add_pm: false,
	can_add_unit: false,
	// Edit permissions
	can_edit_role: false,
	can_edit_user: false,
	can_edit_vendor: false,
	can_edit_project: false,
	can_edit_pm: false,
	can_edit_unit: false,
	// Verify permission
	can_verify_pm: false,
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
					...initialData,         // Override with initial data
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
			// Get permissions
			can_get_role: formData.can_get_role,
			can_get_user: formData.can_get_user,
			can_get_vendor: formData.can_get_vendor,
			can_get_project: formData.can_get_project,
			can_get_pm: formData.can_get_pm,
			can_get_unit: formData.can_get_unit,
			// Add permissions
			can_add_role: formData.can_add_role,
			can_add_user: formData.can_add_user,
			can_add_vendor: formData.can_add_vendor,
			can_add_project: formData.can_add_project,
			can_add_pm: formData.can_add_pm,
			can_add_unit: formData.can_add_unit,
			// Edit permissions
			can_edit_role: formData.can_edit_role,
			can_edit_user: formData.can_edit_user,
			can_edit_vendor: formData.can_edit_vendor,
			can_edit_project: formData.can_edit_project,
			can_edit_pm: formData.can_edit_pm,
			can_edit_unit: formData.can_edit_unit,
			// Verify permission
			can_verify_pm: formData.can_verify_pm,
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

	// Updated helper component for permission checkbox triplets (Get, Add, Edit)
	const PermissionTriplet = ({ title, getPermission, addPermission, editPermission }) => (
		<div className={styles.permissionBox}>
			<p className={styles.permissionTitle}>{title} Permissions</p>
			
			{/* Get Permission */}
			<div className={styles.permissionRow}>
				<label htmlFor={getPermission} className={styles.permissionLabel}>Can View</label>
				<input 
					type="checkbox" 
					name={getPermission} 
					checked={formData[getPermission]} 
					onChange={handleChange} 
					className={styles.checkbox} 
					id={getPermission} 
				/>
			</div>
			
			{/* Add Permission */}
			<div className={styles.permissionRow}>
				<label htmlFor={addPermission} className={styles.permissionLabel}>Can Add</label>
				<input 
					type="checkbox" 
					name={addPermission} 
					checked={formData[addPermission]} 
					onChange={handleChange} 
					className={styles.checkbox} 
					id={addPermission} 
				/>
			</div>
			
			{/* Edit Permission */}
			<div className={styles.permissionRow}>
				<label htmlFor={editPermission} className={styles.permissionLabel}>Can Edit</label>
				<input 
					type="checkbox" 
					name={editPermission} 
					checked={formData[editPermission]} 
					onChange={handleChange} 
					className={styles.checkbox} 
					id={editPermission} 
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
						<PermissionTriplet 
							title="Roles" 
							getPermission="can_get_role" 
							addPermission="can_add_role" 
							editPermission="can_edit_role" 
						/>
						<PermissionTriplet 
							title="Users" 
							getPermission="can_get_user" 
							addPermission="can_add_user" 
							editPermission="can_edit_user" 
						/>
						<PermissionTriplet 
							title="Units" 
							getPermission="can_get_unit" 
							addPermission="can_add_unit" 
							editPermission="can_edit_unit" 
						/>
						<PermissionTriplet 
							title="Vendors" 
							getPermission="can_get_vendor" 
							addPermission="can_add_vendor" 
							editPermission="can_edit_vendor" 
						/>
						<PermissionTriplet 
							title="Projects" 
							getPermission="can_get_project" 
							addPermission="can_add_project" 
							editPermission="can_edit_project" 
						/>
						<PermissionTriplet 
							title="PMs" 
							getPermission="can_get_pm" 
							addPermission="can_add_pm" 
							editPermission="can_edit_pm" 
						/>
						
						{/* PM Verification Permission */}
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