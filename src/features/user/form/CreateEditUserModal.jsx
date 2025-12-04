import React, {useState, useEffect} from "react";
import styles from "./CreateEditUserModal.module.css";
import RequiredLabel from "../../../core/components/RequiredLabel";

const getInitialFormData = () => ({
	id: null,
	name: "",
	username: "",
	password: "",
	role: "",
	is_active: true, // Default active for new users
});

export default function CreateEditUserModal ({visible, onClose, onSubmit, initialData=null}) {
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
				setFormData({
					id: initialData.id,
					name: initialData.name || "",
					username: initialData.username || "",
					// 1. Password field is reset in edit mode, as it's optional and should not pre-fill hash
					password: "",
					role: initialData.role || "",
					// 2. Initialize is_active from initialData, defaulting to true if not present
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

		let newValue;
		if (type === "checkbox") {
			newValue = checked;
		}
		else {
			newValue = value;
		}
		setFormData((prev) => ({...prev, [name]: newValue}));
		setValidationError(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setValidationError(null);

		// Basic Validation
		if (!formData.name.trim() || !formData.username.trim() || !formData.role.trim()) {
			setValidationError("Name, Username, and Role are required fields.");
			return;
		}
		// 3. Conditional Password Validation: Required ONLY in Create Mode
		if (!isEditMode && formData.password.length < 8) {
			setValidationError("Password is required and must be at least 8 characters long for new users.");
			return;
		}
		// If editing and password is provided, validate length
		if (isEditMode && formData.password.length > 0 && formData.password.length < 8) {
			setValidationError("If provided, the password must be at least 8 characters long.");
			return;
		}
		// Construct payload, excluding empty password if editing
		const payloadToSubmit = {
			id: formData.id,
			name: formData.name,
			username: formData.username,
			role: formData.role,
			// ALWAYS include is_active, regardless of mode (Step 2)
			is_active: formData.is_active,
		};

		// The check for isEditMode around is_active is removed, as it's always included.
		// if (isEditMode) {
		//     payloadToSubmit.is_active = formData.is_active;
		// }
		// Include password only if it's NOT empty
		if (formData.password.length > 0) {
			payloadToSubmit.password = formData.password;
		}
		onSubmit(payloadToSubmit);
		resetForm();
		onClose();
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	if (!visible) return null;

	// Tailwind input class for general use
	const inputClass = "w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500";

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h3 className="text-xl font-bold mb-4">{isEditMode ? "Edit User" : "Create User"}</h3>
				{validationError && <div className={styles.validationError}>{validationError}</div>}
				<form onSubmit={handleSubmit} className={styles.formGrid}>
					<RequiredLabel isRequired={true}>Name</RequiredLabel>
					<input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />

					<RequiredLabel isRequired={true}>Username</RequiredLabel>
					<input type="text" name="username" value={formData.username} onChange={handleChange} className={inputClass} />

					{/* 4. Password required status is conditional */}
					<RequiredLabel isRequired={!isEditMode}>Password ({isEditMode ? "Optional" : "Min 8 Chars"})</RequiredLabel>
					<input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Leave blank to keep existing password" : ""} className={inputClass} />

					<RequiredLabel isRequired={true}>Role</RequiredLabel>
					<input type="text" name="role" value={formData.role} onChange={handleChange} className={inputClass} />

					{/* 5. is_active field is now visible in ALL Modes (Create and Edit) */}
					<>
						<RequiredLabel isRequired={true}>Active Status</RequiredLabel>
						<div className={styles.checkboxContainer}>
							<input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className={styles.checkbox} id="is_active_toggle" />
							<label htmlFor="is_active_toggle" className={styles.checkboxLabel}>
								{formData.is_active ? "Account is Active" : "Account is Disabled"}
							</label>
						</div>
					</>

					<div className={styles.modalButtons}>
						<button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
							Cancel
						</button>
						<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
							{isEditMode ? "Save Changes" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
