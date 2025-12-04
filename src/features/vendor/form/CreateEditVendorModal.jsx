import React, {useState, useEffect} from "react";
import styles from "./CreateEditVendorModal.module.css";
import RequiredLabel from "../../../core/components/RequiredLabel";

const getInitialFormData = () => ({
	id: null,
	name: "",
	address: "",
	email: "",
	phone_number: "",
});

export default function CreateEditVendorModal ({visible, onClose, onSubmit, initialData=null}) {
	const [formData, setFormData] = useState(() => getInitialFormData());

	const resetForm = () => {
		setFormData(getInitialFormData());
	};

	useEffect(() => {
		if (visible) {
			if (initialData) {
				setFormData({
					id: initialData.id,
					name: initialData.name || "",
					address: initialData.address || "",
					email: initialData.email || "",
					phone_number: initialData.phone_number || "",
				});
			}
			else {
				setFormData(getInitialFormData());
			}
		}
	}, [initialData, visible]);

	const handleChange = (e) => {
		const {name, value} = e.target;
		let newValue = value;

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
				<h3>{initialData ? "Edit Vendor" : "Create Vendor"}</h3>
				<form onSubmit={handleSubmit} className={styles.formGrid}>
					{/* Required Fields */}
					<RequiredLabel>Name</RequiredLabel>
					<input type="text" name="name" value={formData.name} onChange={handleChange} required />

					<RequiredLabel>Address</RequiredLabel>
					<textarea name="address" value={formData.address} onChange={handleChange} required />

					<RequiredLabel>Email</RequiredLabel>
					<input type="email" name="email" value={formData.email} onChange={handleChange} />

					<RequiredLabel>Phone Number</RequiredLabel>
					<input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />

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
