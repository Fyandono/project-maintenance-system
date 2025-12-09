import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux"; // Import Redux hooks
import styles from "./CreateEditUserModal.module.css";
import RequiredLabel from "../../../core/components/RequiredLabel";

// Import Role fetching thunk (ASSUMED)
// You need to create and export this thunk in your roleSlice
import {fetchRolesThunk} from "../roleSlice"; 

const getInitialFormData = () => ({
    id: null,
    name: "",
    username: "",
    password: "",
    // Changed 'role' string to 'role_id' integer (or null)
    role_id: null, 
    is_active: true,
});

export default function CreateEditUserModal ({visible, onClose, onSubmit, initialData=null}) {
    const isEditMode = !!initialData;
    const [formData, setFormData] = useState(() => getInitialFormData());
    const [validationError, setValidationError] = useState(null);

    const dispatch = useDispatch();
    
    // --- Redux Selectors for Roles (ASSUMED) ---
    const roles = useSelector((state) => state.roles.roles);
    const isLoadingRoles = useSelector((state) => state.roles.isLoading);
    const roleError = useSelector((state) => state.roles.error);
    const roleSearch = useSelector((state) => state.roles.filterName); // Assuming you have a filter state

    // 1. Fetch Roles on component mount or visibility change
    useEffect(() => {
        if (visible) {
            // Dispatch a thunk to fetch all roles
            dispatch(fetchRolesThunk({filterName: roleSearch}));
        }
    }, [dispatch, visible, roleSearch]);

    const resetForm = () => {
        setFormData(getInitialFormData());
        setValidationError(null);
    };

    useEffect(() => {
        if (visible) {
            if (initialData) {
                // When editing, initialize with existing data, including role_id
                setFormData({
                    id: initialData.id,
                    name: initialData.name || "",
                    username: initialData.username || "",
                    password: "",
                    // ⭐️ Use role_id from initialData
                    role_id: initialData.role_id || null, 
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
        } else if (name === "role_id") {
            // ⭐️ Parse role_id as integer, or set to null if empty string (placeholder)
            newValue = value ? parseInt(value, 10) : null;
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

        // Basic Validation - Check if role_id is selected
        if (!formData.name.trim() || !formData.username.trim() || formData.role_id === null) {
            setValidationError("Name, Username, and Role are required fields.");
            return;
        }

        // Conditional Password Validation
        if (!isEditMode && formData.password.length < 8) {
            setValidationError("Password is required and must be at least 8 characters long for new users.");
            return;
        }
        if (isEditMode && formData.password.length > 0 && formData.password.length < 8) {
            setValidationError("If provided, the password must be at least 8 characters long.");
            return;
        }

        // Construct payload
        const payloadToSubmit = {
            id: formData.id,
            name: formData.name,
            username: formData.username,
            // ⭐️ Send role_id instead of role string
            role_id: formData.role_id, 
            is_active: formData.is_active,
        };

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

    const inputClass = "w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500";
    
    // Determine the text for the role selection placeholder
    let rolePlaceholder = "Select User Role";
    if (isLoadingRoles) {
        rolePlaceholder = "Loading roles...";
    } else if (roleError) {
        rolePlaceholder = `Error: ${roleError}`;
    }

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

                    {/* Password Field */}
                    <RequiredLabel isRequired={!isEditMode}>Password ({isEditMode ? "Optional" : "Min 8 Chars"})</RequiredLabel>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Leave blank to keep existing password" : ""} className={inputClass} />

                    {/* ⭐️ ROLE SELECTION DROPDOWN */}
                    <RequiredLabel isRequired={true}>Role</RequiredLabel>
                    <select 
                        name="role_id" 
                        value={formData.role_id || ""} 
                        onChange={handleChange} 
                        className={inputClass}
                        required
                        disabled={isLoadingRoles || !!roleError}
                    >
                        <option value="" disabled>
                            {rolePlaceholder}
                        </option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>

                    {/* Active Status Field */}
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