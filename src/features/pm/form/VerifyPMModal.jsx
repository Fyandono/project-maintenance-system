import React, {useState, useEffect, useMemo} from "react";
import styles from "./VerifyPMModal.module.css";

// Initial state structure for form data
const getInitialFormData = (data) => {
	// Ensure data is an object, defaulting to an empty object if null or undefined.
	const safeData = data || {};

	return {
		id: safeData.id || "",
		pm_project_date: safeData.pm_project_date || "",
		pm_completion_date: safeData.pm_completion_date || "",
		is_verified: safeData.is_verified || false, // Default to false
		note: safeData.note || "",
	};
};

// Helper component for required fields
const RequiredLabel = ({children, isRequired}) => (
	// Updated to use mock styles
	<label className={styles.label}>
		{children} {isRequired && <span style={{color: "red", marginLeft: "4px"}}>*</span>}
	</label>
);

const getTodayString = () => {
    const today = new Date();
    
    // Get year, month, and day components
    const year = today.getFullYear();
    // Get month (0-11), add 1, and pad with a leading '0' if single digit
    const month = String(today.getMonth() + 1).padStart(2, '0');
    // Get day, and pad with a leading '0' if single digit
    const day = String(today.getDate()).padStart(2, '0');

    // Return the required YYYY-MM-DD format
    return `${year}-${month}-${day}`;
};

// Removed 'id' prop from the signature as it's now derived from initialData
export default function VerifyPMModal ({visible, onClose, onSubmit, initialData=null}) {
	// Function to calculate the initial state based on props (memoized)
	const calculateInitialFormState = useMemo(() => {
		return (data) => {
			// If we have existing data for an edit scenario, use it
			if (data && data.id) {
				return {
					id: data.id,
					pm_project_date: data.pm_project_date || "",
					pm_completion_date: data.pm_completion_date || "",
					is_verified: data.is_verified || "false",
					note: data.note || "",
				};
			}
			// Otherwise, use default initial state
			return getInitialFormData(data);
		};
	}, []);

	const [formData, setFormData] = useState(() => calculateInitialFormState(initialData));
	const [validationError, setValidationError] = useState("");

	// Removed the useEffect block that previously contained the mock fetch/thunk logic.

	// Reset form data when the modal becomes visible or the initial data changes
	useEffect(() => {
		// Pass initialData to correctly initialize the form
		setFormData(calculateInitialFormState(initialData));
		setValidationError("");
	}, [initialData, visible, calculateInitialFormState]);

	const resetForm = () => {
		// Reset based on the current initialData structure
		setFormData(getInitialFormData(initialData));
	};

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({...prev, [name]: value}));
		setValidationError(""); // Clear validation error on change
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	// Helper to build the FormData object and submit
	 const processSubmission = (isVerifiedStatus) => {
        setValidationError("");
        
        // 1. Client-side validation for mandatory ID
        if (!formData.id) {
            setValidationError("ID is missing. Cannot submit verification.");
            return;
        }

        // 2. Client-side validation for mandatory fields (like PM Date)
        if (!formData.pm_completion_date) {
             setValidationError("PM Completion Date is required.");
             return;
        }

        // 3. Conditional validation for 'note' if rejecting/revising
        // This check uses the status we are *about* to set (isVerifiedStatus)
        if (!isVerifiedStatus && !formData.note.trim()) {
            setValidationError("Note is mandatory when choosing to Revise.");
            return;
        }

        const noteValue = formData.note.trim() || "";
        
        // Both "Verify" (true) and "Revise" (false) now use the JSON structure
        const submissionPayload = {
            id: formData.id,
            pm_completion_date: formData.pm_completion_date,
            is_verified: isVerifiedStatus,
            // If note is empty, it sends an empty string in JSON
            note: noteValue, 
        };

        onSubmit(submissionPayload);
        onClose(); // Close on successful submission attempt
        resetForm(); // Reset after submission
    };


	const handleVerify = () => {
		processSubmission(true);
	};

	const handleReject = () => {
		processSubmission(false);
	};

	if (!visible) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h3 className="text-xl font-bold text-center">Verify Project Monitoring</h3>

				{validationError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{validationError}</div>}
				{/* Form tag is just a container now, submission is handled by buttons */}
				<form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
					{/* PM Completion Date (Mandatory for both actions) */}
					<RequiredLabel isRequired={true}>Completion Date</RequiredLabel>
					<input type="date" name="pm_completion_date" value={formData.pm_completion_date} onChange={handleChange} className={styles.input} min={formData.pm_project_date} max={getTodayString()}/>

					{/* Note Field (Conditionally Required) */}
					<RequiredLabel isRequired={false}>Note</RequiredLabel>
					<textarea name="note" value={formData.note} onChange={handleChange} placeholder="Required if revising; optional if verifying." rows="3" className={styles.input} />

					<div className={styles.modalButtons}>
						<button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
							Cancel
						</button>

						<button type="button" onClick={handleReject} style={{color: "white", backgroundColor: "#f44336"}} className="px-4 py-2 font-semibold rounded-lg hover:opacity-90 transition">
							Revise
						</button>

						<button type="button" onClick={handleVerify} style={{color: "white", backgroundColor: "#4CAF50"}} className="px-4 py-2 font-semibold rounded-lg hover:opacity-90 transition">
							Verify
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
