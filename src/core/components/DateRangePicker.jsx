import React from "react";
import styles from "./DateRangePicker.module.css";

export default function DateRangeFilter({ label, startDate, endDate, onRangeChange }) {
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        let newStartDate = startDate;
        let newEndDate = endDate;

        if (name === "startDate") newStartDate = value;
        else if (name === "endDate") newEndDate = value;

        onRangeChange([newStartDate || null, newEndDate || null]);
    };

    return (
        <div className={styles.dateRangeGroup}>
            <label>{label}</label>
            <div className={styles.inputsContainer}>
                <input 
                    type="date" 
                    name="startDate" 
                    value={startDate || ""} 
                    onChange={handleDateChange} 
                    className={styles.dateInput} 
                />
                <span className={styles.separator}>-</span>
                <input 
                    type="date" 
                    name="endDate" 
                    value={endDate || ""} 
                    onChange={handleDateChange} 
                    className={styles.dateInput} 
                />
            </div>
        </div>
    );
}