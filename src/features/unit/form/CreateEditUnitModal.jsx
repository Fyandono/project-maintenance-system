import React, {useState, useEffect} from "react";
import styles from "./CreateEditUnitModal.module.css";
import RequiredLabel from "../../../core/components/RequiredLabel";

const getInitialFormData = () => ({
	id: null,
	name: "",
	is_active: true,
});

export default function CreateEditUnitModal ({visible, onClose, onSubmit, initialData=null}) {
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
					is_active: initialData.is_active !== undefined ? initialData.is_active : true,
				});
			}
			else {
				setFormData(getInitialFormData());
				a;
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

		// Construct payload, excluding empty password if editing
		const payloadToSubmit = {
			id: formData.id,
			name: formData.name,
			is_active: formData.is_active,
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

	// Tailwind input class for general use
	const inputClass = "w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500";

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h3 className="text-xl font-bold mb-4">{isEditMode ? "Edit Unit" : "Create Unit"}</h3>
				{validationError && <div className={styles.validationError}>{validationError}</div>}
				<form onSubmit={handleSubmit} className={styles.formGrid}>
					<RequiredLabel isRequired={true}>Name</RequiredLabel>
					<input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />

					<RequiredLabel isRequired={true}>Active Status</RequiredLabel>
					<div className={styles.checkboxContainer}>
						<input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className={styles.checkbox} id="is_active_toggle" />
						<label htmlFor="is_active_toggle" className={styles.checkboxLabel}>
							{formData.is_active ? "Account is Active" : "Account is Disabled"}
						</label>
					</div>

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
