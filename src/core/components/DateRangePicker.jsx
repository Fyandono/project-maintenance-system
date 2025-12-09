import React from "react";
import styles from "./DateRangePicker.module.css";
// Note: Removed unused imports: useState, useRef, useEffect, DateRange, format, getDateObject

export default function DateRangeFilter ({startDate, endDate, onRangeChange}) {
	const handleDateChange = (e) => {
		const {name, value} = e.target;

		let newStartDate = startDate;
		let newEndDate = endDate;

		if (name === "startDate") {

			newStartDate = value;
		}
		else if (name === "endDate") {
			newEndDate = value;
		}
		onRangeChange([newStartDate || null, newEndDate || null]);
	};

	const handleReset = () => {
		onRangeChange([null, null]);
	};

	return (
		<div className={styles.dateRangeContainer}>
			{/* Start Date Input with Placeholder */}
			<div className={styles.inputGroup}>
				<label for="start">Start date</label>
				<input type="date" id="start" name="startDate" value={startDate || ""} onChange={handleDateChange} className={styles.dateInput} />
			</div>
			-
            {/* End Date Input with Placeholder */}
			<div className={styles.inputGroup}>
				<label for="end">End date</label>
				<input type="date" id="end" name="endDate" value={endDate || ""} onChange={handleDateChange} className={styles.dateInput} />
			</div>
			<button type="button" className={styles.resetButton} onClick={handleReset} disabled={(startDate == null || startDate == "") && (endDate == null || endDate == "")}>
				Reset Date
			</button>
		</div>
	);
}
